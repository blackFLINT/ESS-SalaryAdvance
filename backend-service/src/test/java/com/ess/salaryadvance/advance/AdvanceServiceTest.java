package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeService;
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

    @InjectMocks
    private AdvanceService advanceService;

    private Employee employee;

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
    }

    @Test
    void shouldRejectAmountOverHalfSalary() {
        CreateAdvanceRequestDto dto = new CreateAdvanceRequestDto();
        dto.setAmount(new BigDecimal("6000.00"));
        dto.setReason("Emergency expense that needs support");

        when(employeeService.getByEmail("employee@ess.local")).thenReturn(employee);

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

        AdvanceResponseDto response = advanceService.decide(7L, dto);
        assertEquals("APPROVED", response.getStatus());
    }
}
