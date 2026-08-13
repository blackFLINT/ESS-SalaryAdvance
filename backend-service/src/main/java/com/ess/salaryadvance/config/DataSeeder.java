package com.ess.salaryadvance.config;

import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.Instant;

@Configuration
public class DataSeeder {

    @Value("${app.seed.password}")
    private String seedPassword;

    @Bean
    CommandLineRunner seedUsers(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!employeeRepository.existsByEmailIgnoreCase("employee@ess.local")) {
                employeeRepository.save(createEmployee(
                        "EMP-1001",
                        "Employee One",
                        "employee@ess.local",
                        "Finance",
                        new BigDecimal("12000.00"),
                        Role.EMPLOYEE,
                        passwordEncoder));
            }

            if (!employeeRepository.existsByEmailIgnoreCase("manager@ess.local")) {
                employeeRepository.save(createEmployee(
                        "MGR-2001",
                        "Manager One",
                        "manager@ess.local",
                        "Finance",
                        new BigDecimal("22000.00"),
                        Role.MANAGER,
                        passwordEncoder));
            }

            if (!employeeRepository.existsByEmailIgnoreCase("admin@ess.local")) {
                employeeRepository.save(createEmployee(
                        "ADM-3001",
                        "Admin One",
                        "admin@ess.local",
                        "IT",
                        new BigDecimal("30000.00"),
                        Role.ADMIN,
                        passwordEncoder));
            }
        };
    }

    private Employee createEmployee(String employeeNumber,
            String fullName,
            String email,
            String department,
            BigDecimal salary,
            Role role,
            PasswordEncoder passwordEncoder) {
        Employee employee = new Employee();
        employee.setEmployeeNumber(employeeNumber);
        employee.setFullName(fullName);
        employee.setEmail(email);
        employee.setDepartment(department);
        employee.setMonthlySalary(salary);
        employee.setRole(role);
        employee.setPasswordHash(passwordEncoder.encode(seedPassword));
        employee.setCreatedAt(Instant.now());
        return employee;
    }
}
