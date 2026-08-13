package com.ess.salaryadvance.usermanagement;

import com.ess.salaryadvance.employee.Employee;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class UserManagementResponse {
    private Long id;
    private String employeeNumber;
    private String fullName;
    private String email;
    private String department;
    private String jobTitle;
    private String branchLocation;
    private String managerName;
    private String salaryBand;
    private BigDecimal maxAdvanceEligibility;
    private BigDecimal monthlySalary;
    private String role;
    private List<String> features;

    public static UserManagementResponse from(Employee employee) {
        UserManagementResponse dto = new UserManagementResponse();
        dto.id = employee.getId();
        dto.employeeNumber = employee.getEmployeeNumber();
        dto.fullName = employee.getFullName();
        dto.email = employee.getEmail();
        dto.department = employee.getDepartment();
        dto.jobTitle = employee.getJobTitle();
        dto.branchLocation = employee.getBranchLocation();
        dto.managerName = employee.getManagerName();
        dto.salaryBand = employee.getSalaryBand();
        dto.maxAdvanceEligibility = employee.getMaxAdvanceEligibility();
        dto.monthlySalary = employee.getMonthlySalary();
        dto.role = employee.getRole().name();
        dto.features = employee.getFeatures().stream().map(Enum::name).sorted(Comparator.naturalOrder()).toList();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartment() {
        return department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getBranchLocation() {
        return branchLocation;
    }

    public String getManagerName() {
        return managerName;
    }

    public String getSalaryBand() {
        return salaryBand;
    }

    public BigDecimal getMaxAdvanceEligibility() {
        return maxAdvanceEligibility;
    }

    public BigDecimal getMonthlySalary() {
        return monthlySalary;
    }

    public String getRole() {
        return role;
    }

    public List<String> getFeatures() {
        return features;
    }
}
