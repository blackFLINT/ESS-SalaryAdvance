package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
public class AdvanceService {

    private final SalaryAdvanceRequestRepository requestRepository;
    private final EmployeeService employeeService;

    public AdvanceService(SalaryAdvanceRequestRepository requestRepository,
            EmployeeService employeeService) {
        this.requestRepository = requestRepository;
        this.employeeService = employeeService;
    }

    @Transactional
    public AdvanceResponseDto create(String email, CreateAdvanceRequestDto dto) {
        Employee employee = employeeService.getByEmail(email);
        BigDecimal maxAllowed = employee.getMonthlySalary().multiply(new BigDecimal("0.50"))
                .setScale(2, RoundingMode.HALF_UP);
        if (dto.getAmount().compareTo(maxAllowed) > 0) {
            throw new BusinessException("Requested amount exceeds 50% of monthly salary");
        }

        SalaryAdvanceRequest request = new SalaryAdvanceRequest();
        request.setEmployee(employee);
        request.setAmount(dto.getAmount().setScale(2, RoundingMode.HALF_UP));
        request.setReason(dto.getReason().trim());
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(Instant.now());
        request.setUpdatedAt(Instant.now());

        return AdvanceResponseDto.from(requestRepository.save(request));
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

    @Transactional
    public AdvanceResponseDto decide(Long requestId, AdvanceDecisionDto dto) {
        SalaryAdvanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BusinessException("Only pending requests can be updated");
        }

        RequestStatus nextStatus = RequestStatus.valueOf(dto.getStatus());
        request.setStatus(nextStatus);
        request.setApproverComment(dto.getComment() == null ? null : dto.getComment().trim());
        request.setUpdatedAt(Instant.now());

        return AdvanceResponseDto.from(requestRepository.save(request));
    }
}
