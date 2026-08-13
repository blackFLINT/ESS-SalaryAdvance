package com.ess.salaryadvance.config;

import com.ess.salaryadvance.common.FeatureAccess;
import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Value("${app.seed.password}")
    private String seedPassword;

    @Bean
    CommandLineRunner seedUsers(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            ensureSeedUser(employeeRepository, passwordEncoder, new SeedUser(
                    "EMP-1001",
                    "Employee One",
                    "employee@ess.local",
                    "Finance",
                    new BigDecimal("12000.00"),
                    Role.EMPLOYEE,
                    EnumSet.of(FeatureAccess.DASHBOARD_VIEW, FeatureAccess.REQUEST_SUBMIT,
                            FeatureAccess.REQUEST_HISTORY_VIEW, FeatureAccess.NOTIFICATIONS_VIEW)));

            ensureSeedUser(employeeRepository, passwordEncoder, new SeedUser(
                    "MGR-2001",
                    "Manager One",
                    "manager@ess.local",
                    "Finance",
                    new BigDecimal("22000.00"),
                    Role.MANAGER,
                    EnumSet.of(FeatureAccess.DASHBOARD_VIEW, FeatureAccess.REQUEST_SUBMIT,
                            FeatureAccess.REQUEST_HISTORY_VIEW, FeatureAccess.PENDING_APPROVAL_VIEW,
                            FeatureAccess.APPROVE_REQUEST, FeatureAccess.NOTIFICATIONS_VIEW)));

            ensureSeedUser(employeeRepository, passwordEncoder, new SeedUser(
                    "ADM-3001",
                    "Admin One",
                    "admin@ess.local",
                    "IT",
                    new BigDecimal("30000.00"),
                    Role.ADMIN,
                    EnumSet.of(FeatureAccess.DASHBOARD_VIEW, FeatureAccess.REQUEST_SUBMIT,
                            FeatureAccess.REQUEST_HISTORY_VIEW, FeatureAccess.USER_MANAGEMENT,
                            FeatureAccess.SYSTEM_HEALTH_VIEW, FeatureAccess.AUDIT_LOG_VIEW,
                            FeatureAccess.REPORTS_VIEW, FeatureAccess.SETTINGS_MANAGE,
                            FeatureAccess.NOTIFICATIONS_VIEW)));

            ensureSeedUser(employeeRepository, passwordEncoder, new SeedUser(
                    "HR-4001",
                    "Payroll One",
                    "payroll@ess.local",
                    "Payroll",
                    new BigDecimal("18000.00"),
                    Role.HR_PAYROLL,
                    EnumSet.of(FeatureAccess.DASHBOARD_VIEW, FeatureAccess.REQUEST_HISTORY_VIEW,
                            FeatureAccess.APPROVED_ADVANCES_VIEW, FeatureAccess.ADVANCE_PROCESS,
                            FeatureAccess.REPORTS_VIEW, FeatureAccess.NOTIFICATIONS_VIEW)));
        };
    }

    private void ensureSeedUser(EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            SeedUser seedUser) {
        Optional<Employee> existing = employeeRepository.findByEmailIgnoreCase(seedUser.email());
        if (existing.isPresent()) {
            Employee employee = existing.get();
            employee.setRole(seedUser.role());
            employee.setFeatures(seedUser.features());
            applyCorporateProfile(employee, seedUser);
            employeeRepository.save(employee);
            return;
        }

        employeeRepository.save(createEmployee(seedUser, passwordEncoder));
    }

    private Employee createEmployee(SeedUser seedUser, PasswordEncoder passwordEncoder) {
        Employee employee = new Employee();
        employee.setEmployeeNumber(seedUser.employeeNumber());
        employee.setFullName(seedUser.fullName());
        employee.setEmail(seedUser.email());
        employee.setDepartment(seedUser.department());
        applyCorporateProfile(employee, seedUser);
        employee.setMonthlySalary(seedUser.salary());
        employee.setRole(seedUser.role());
        employee.setFeatures(seedUser.features());
        employee.setPasswordHash(passwordEncoder.encode(seedPassword));
        employee.setCreatedAt(Instant.now());
        return employee;
    }

    private void applyCorporateProfile(Employee employee, SeedUser seedUser) {
        employee.setJobTitle(seedUser.role().name().replace('_', ' '));
        employee.setBranchLocation("Head Office");
        employee.setManagerName(seedUser.role() == Role.EMPLOYEE ? "Manager One" : "Executive Office");
        employee.setSalaryBand(seedUser.role() == Role.ADMIN ? "E4" : "E2");
        employee.setMaxAdvanceEligibility(seedUser.salary().multiply(new BigDecimal("0.50")));
    }

    private record SeedUser(String employeeNumber,
            String fullName,
            String email,
            String department,
            BigDecimal salary,
            Role role,
            Set<FeatureAccess> features) {
    }
}
