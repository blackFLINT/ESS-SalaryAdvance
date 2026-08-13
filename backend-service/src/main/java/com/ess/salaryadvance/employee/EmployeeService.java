package com.ess.salaryadvance.employee;

import com.ess.salaryadvance.common.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getByEmail(String email) {
        return employeeRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException("Employee not found"));
    }

    @Transactional(readOnly = true)
    public EmployeeProfileDto getProfile(String email) {
        Employee employee = getByEmail(email);
        // Ensure features collection is initialized within transaction
        var features = employee.getFeatures();
        if (features != null && !features.isEmpty()) {
            // Force lazy collection initialization
        }
        return new EmployeeProfileDto(employee);
    }
}
