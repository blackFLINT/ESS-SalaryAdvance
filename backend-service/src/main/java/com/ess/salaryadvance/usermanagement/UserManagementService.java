package com.ess.salaryadvance.usermanagement;

import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.common.FeatureAccess;
import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.audit.AuditService;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import com.ess.salaryadvance.notification.NotificationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public UserManagementService(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder,
            AuditService auditService, NotificationService notificationService) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<UserManagementResponse> listUsers() {
        return employeeRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Employee::getId))
                .map(UserManagementResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> listFeatures() {
        return Arrays.stream(FeatureAccess.values())
                .map(Enum::name)
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    @Transactional
    public UserManagementResponse createUser(CreateUserRequest request) {
        if (employeeRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            throw new BusinessException("Email already exists");
        }
        if (employeeRepository.existsByEmployeeNumberIgnoreCase(request.getEmployeeNumber().trim())) {
            throw new BusinessException("Employee number already exists");
        }

        Employee employee = new Employee();
        employee.setEmployeeNumber(request.getEmployeeNumber().trim());
        employee.setFullName(request.getFullName().trim());
        employee.setEmail(request.getEmail().trim().toLowerCase());
        employee.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        employee.setDepartment(request.getDepartment().trim());
        employee.setJobTitle(clean(request.getJobTitle()));
        employee.setBranchLocation(clean(request.getBranchLocation()));
        employee.setManagerName(clean(request.getManagerName()));
        employee.setSalaryBand(clean(request.getSalaryBand()));
        employee.setMonthlySalary(request.getMonthlySalary());
        employee.setMaxAdvanceEligibility(request.getMaxAdvanceEligibility());
        employee.setRole(parseRole(request.getRole()));
        employee.setFeatures(parseFeatures(request.getFeatures()));
        employee.setCreatedAt(Instant.now());

        Employee saved = employeeRepository.save(employee);
        auditService.record("USER_CREATED", saved.getId(), "EMPLOYEE", "Created user " + saved.getEmail(),
                saved.getEmail());
        notificationService.notifyEmployee(saved, "Welcome to ESS Salary Advance",
                "Your employee self-service account has been created.");
        return UserManagementResponse.from(saved);
    }

    @Transactional
    public UserManagementResponse updateAccess(Long userId, UpdateUserAccessRequest request) {
        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        String before = employee.getRole().name() + " " + employee.getFeatures();
        employee.setRole(parseRole(request.getRole()));
        employee.setFeatures(parseFeatures(request.getFeatures()));

        Employee saved = employeeRepository.save(employee);
        auditService.record("USER_ACCESS_CHANGED", saved.getId(), "EMPLOYEE",
                "Access changed from " + before + " to " + saved.getRole().name() + " " + saved.getFeatures(),
                saved.getEmail());
        notificationService.notifyEmployee(saved, "Access updated",
                "Your role or feature permissions have been updated.");
        return UserManagementResponse.from(saved);
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (Exception ex) {
            throw new BusinessException("Invalid role value");
        }
    }

    private Set<FeatureAccess> parseFeatures(Set<String> features) {
        try {
            return features.stream()
                    .map(value -> FeatureAccess.valueOf(value.trim().toUpperCase()))
                    .collect(Collectors.toSet());
        } catch (Exception ex) {
            throw new BusinessException("Invalid feature value");
        }
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
