package com.ess.salaryadvance.employee;

import com.ess.salaryadvance.common.BusinessException;
import org.springframework.stereotype.Service;

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

    public EmployeeProfileDto getProfile(String email) {
        return new EmployeeProfileDto(getByEmail(email));
    }
}
