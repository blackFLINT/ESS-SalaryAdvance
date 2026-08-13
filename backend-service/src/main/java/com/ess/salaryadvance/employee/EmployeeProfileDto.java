package com.ess.salaryadvance.employee;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class EmployeeProfileDto {
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
    private Boolean twoFactorEnabled;

    public EmployeeProfileDto(Employee employee) {
        this.id = employee.getId();
        this.employeeNumber = employee.getEmployeeNumber();
        this.fullName = employee.getFullName();
        this.email = employee.getEmail();
        this.department = employee.getDepartment();
        this.jobTitle = employee.getJobTitle();
        this.branchLocation = employee.getBranchLocation();
        this.managerName = employee.getManagerName();
        this.salaryBand = employee.getSalaryBand();
        this.maxAdvanceEligibility = employee.getMaxAdvanceEligibility();
        this.monthlySalary = employee.getMonthlySalary();
        this.role = employee.getRole().name();
        this.features = employee.getFeatures().stream().map(Enum::name).sorted(Comparator.naturalOrder()).toList();
        this.twoFactorEnabled = employee.getTwoFactorEnabled();
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

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }
}
