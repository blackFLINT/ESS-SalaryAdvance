package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.audit.AuditService;
import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeService;
import com.ess.salaryadvance.notification.NotificationService;
import com.ess.salaryadvance.settings.CorporateSettings;
import com.ess.salaryadvance.settings.CorporateSettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdvanceServiceTest {

    @Mock
    private SalaryAdvanceRequestRepository requestRepository;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private CorporateSettingsService settingsService;

    @Mock
    private AuditService auditService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdvanceService advanceService;

    private Employee employee;
    private CorporateSettings settings;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setEmployeeNumber("EMP-1");
        employee.setFullName("Test Employee");
        employee.setEmail("employee@ess.local");
        employee.setDepartment("IT");
        employee.setMonthlySalary(new BigDecimal("10000.00"));
        employee.setRole(Role.EMPLOYEE);
        employee.setCreatedAt(Instant.now());

        settings = new CorporateSettings();
        settings.setMaximumAdvancePercentage(new BigDecimal("50.00"));
        settings.setAllowedRepaymentPeriods(3);
    }

    @Test
    void shouldRejectAmountOverHalfSalary() {
        CreateAdvanceRequestDto dto = new CreateAdvanceRequestDto();
        dto.setAmount(new BigDecimal("6000.00"));
        dto.setReason("Emergency expense that needs support");

        when(employeeService.getByEmail("employee@ess.local")).thenReturn(employee);
        when(settingsService.get()).thenReturn(settings);

        assertThrows(BusinessException.class, () -> advanceService.create("employee@ess.local", dto));
    }

    @Test
    void shouldUpdatePendingRequestToApproved() {
        SalaryAdvanceRequest request = new SalaryAdvanceRequest();
        request.setEmployee(employee);
        request.setAmount(new BigDecimal("2000.00"));
        request.setReason("Reason text long enough");
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(Instant.now());
        request.setUpdatedAt(Instant.now());

        when(requestRepository.findById(7L)).thenReturn(Optional.of(request));
        when(requestRepository.save(request)).thenReturn(request);

        AdvanceDecisionDto dto = new AdvanceDecisionDto();
        dto.setStatus("APPROVED");
        dto.setComment("Approved for this cycle");

        AdvanceResponseDto response = advanceService.decide(7L, dto, "manager@ess.local");
        assertEquals("APPROVED", response.getStatus());
    }
}
