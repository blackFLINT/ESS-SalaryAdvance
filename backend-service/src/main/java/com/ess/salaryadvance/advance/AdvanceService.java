package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.audit.AuditService;
import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeService;
import com.ess.salaryadvance.notification.NotificationService;
import com.ess.salaryadvance.settings.CorporateSettings;
import com.ess.salaryadvance.settings.CorporateSettingsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
public class AdvanceService {

    private static final String ADVANCE_ENTITY = "SALARY_ADVANCE_REQUEST";

    private final SalaryAdvanceRequestRepository requestRepository;
    private final EmployeeService employeeService;
    private final CorporateSettingsService settingsService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public AdvanceService(SalaryAdvanceRequestRepository requestRepository,
            EmployeeService employeeService,
            CorporateSettingsService settingsService,
            AuditService auditService,
            NotificationService notificationService) {
        this.requestRepository = requestRepository;
        this.employeeService = employeeService;
        this.settingsService = settingsService;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Transactional
    public AdvanceResponseDto create(String email, CreateAdvanceRequestDto dto) {
        Employee employee = employeeService.getByEmail(email);
        CorporateSettings settings = settingsService.get();
        BigDecimal configuredMax = employee.getMonthlySalary()
                .multiply(settings.getMaximumAdvancePercentage())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal maxAllowed = employee.getMaxAdvanceEligibility() == null
                ? configuredMax
                : employee.getMaxAdvanceEligibility().min(configuredMax).setScale(2, RoundingMode.HALF_UP);
        if (dto.getAmount().compareTo(maxAllowed) > 0) {
            throw new BusinessException("Requested amount exceeds current advance eligibility");
        }

        SalaryAdvanceRequest request = new SalaryAdvanceRequest();
        request.setEmployee(employee);
        request.setAmount(dto.getAmount().setScale(2, RoundingMode.HALF_UP));
        request.setReason(dto.getReason().trim());
        request.setStatus(RequestStatus.PENDING);
        request.setRepaymentInstallments(settings.getAllowedRepaymentPeriods());
        request.setMonthlyDeductionAmount(BigDecimal.ZERO);
        request.setRemainingBalance(dto.getAmount().setScale(2, RoundingMode.HALF_UP));
        request.setRepaymentStatus(RepaymentStatus.PENDING);
        request.setCreatedAt(Instant.now());
        request.setUpdatedAt(Instant.now());

        SalaryAdvanceRequest saved = requestRepository.save(request);
        auditService.record("REQUEST_CREATED", saved.getId(), ADVANCE_ENTITY,
                "Created advance request for " + saved.getAmount(), email);
        notificationService.notifyEmployee(employee, "Request submitted",
                "Your salary advance request has been submitted for manager review.");
        notificationService.notifyRole(Role.MANAGER, "Approval reminder",
                "A salary advance request is pending manager approval.");
        return AdvanceResponseDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<AdvanceResponseDto> listMyRequests(String email) {
        Employee employee = employeeService.getByEmail(email);
        return requestRepository.findByEmployeeOrderByCreatedAtDesc(employee)
                .stream()
                .map(AdvanceResponseDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdvanceResponseDto> listPending() {
        return requestRepository.findByStatusOrderByCreatedAtAsc(RequestStatus.PENDING)
                .stream()
                .map(AdvanceResponseDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdvanceResponseDto> listApprovedForPayroll() {
        return requestRepository.findByStatusOrderByUpdatedAtAsc(RequestStatus.APPROVED)
                .stream()
                .map(AdvanceResponseDto::from)
                .toList();
    }

    @Transactional
    public AdvanceResponseDto decide(Long requestId, AdvanceDecisionDto dto, String actor) {
        SalaryAdvanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BusinessException("Only pending requests can be updated");
        }

        RequestStatus nextStatus = RequestStatus.valueOf(dto.getStatus());
        request.setStatus(nextStatus);
        request.setApproverComment(dto.getComment() == null ? null : dto.getComment().trim());
        request.setUpdatedAt(Instant.now());

        SalaryAdvanceRequest saved = requestRepository.save(request);
        auditService.record(nextStatus == RequestStatus.APPROVED ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
                saved.getId(), ADVANCE_ENTITY, "Manager decision: " + nextStatus.name(), actor);
        notificationService.notifyEmployee(saved.getEmployee(), "Request " + nextStatus.name().toLowerCase(),
                "Your salary advance request has been " + nextStatus.name().toLowerCase() + ".");
        if (nextStatus == RequestStatus.APPROVED) {
            notificationService.notifyRole(Role.HR_PAYROLL, "Request sent to payroll",
                    "An approved salary advance is ready for payroll processing.");
        }
        return AdvanceResponseDto.from(saved);
    }

    @Transactional
    public AdvanceResponseDto markProcessed(Long requestId, PayrollProcessDto dto, String actor) {
        SalaryAdvanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Request not found"));

        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new BusinessException("Only approved requests can be processed by payroll");
        }

        request.setStatus(RequestStatus.PROCESSED);
        int installments = dto.getRepaymentInstallments() == null ? 3 : dto.getRepaymentInstallments();
        request.setRepaymentInstallments(installments);
        request.setMonthlyDeductionAmount(
                request.getAmount().divide(new BigDecimal(installments), 2, RoundingMode.HALF_UP));
        request.setRemainingBalance(request.getAmount());
        request.setRepaymentStatus(RepaymentStatus.ACTIVE);
        request.setPayrollComment(dto.getComment() == null ? null : dto.getComment().trim());
        request.setUpdatedAt(Instant.now());
        SalaryAdvanceRequest saved = requestRepository.save(request);
        auditService.record("REQUEST_PROCESSED", saved.getId(), ADVANCE_ENTITY,
                "Payroll processed advance with " + installments + " installments", actor);
        notificationService.notifyEmployee(saved.getEmployee(), "Request processed",
                "Payroll has processed your salary advance. Your repayment plan is now active.");
        return AdvanceResponseDto.from(saved);
    }
}
