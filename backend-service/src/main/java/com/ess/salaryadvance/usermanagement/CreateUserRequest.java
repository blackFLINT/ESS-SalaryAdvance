package com.ess.salaryadvance.usermanagement;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.Set;

public class CreateUserRequest {

    @NotBlank(message = "Employee number is required")
    @Size(max = 50, message = "Employee number is too long")
    private String employeeNumber;

    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name is too long")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    @Size(max = 120, message = "Email is too long")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,64}$", message = "Password must include upper, lower, number, and symbol")
    private String password;

    @NotBlank(message = "Department is required")
    @Size(max = 80, message = "Department is too long")
    private String department;

    @Size(max = 100, message = "Job title is too long")
    private String jobTitle;

    @Size(max = 100, message = "Branch/location is too long")
    private String branchLocation;

    @Size(max = 120, message = "Manager name is too long")
    private String managerName;

    @Size(max = 80, message = "Salary band is too long")
    private String salaryBand;

    @DecimalMin(value = "0.00", message = "Max advance eligibility cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Max advance eligibility format is invalid")
    private BigDecimal maxAdvanceEligibility;

    @NotNull(message = "Monthly salary is required")
    @DecimalMin(value = "1.00", message = "Monthly salary must be at least 1.00")
    @Digits(integer = 10, fraction = 2, message = "Monthly salary format is invalid")
    private BigDecimal monthlySalary;

    @NotBlank(message = "Role is required")
    private String role;

    @NotEmpty(message = "At least one feature is required")
    private Set<String> features;

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getBranchLocation() {
        return branchLocation;
    }

    public void setBranchLocation(String branchLocation) {
        this.branchLocation = branchLocation;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getSalaryBand() {
        return salaryBand;
    }

    public void setSalaryBand(String salaryBand) {
        this.salaryBand = salaryBand;
    }

    public BigDecimal getMaxAdvanceEligibility() {
        return maxAdvanceEligibility;
    }

    public void setMaxAdvanceEligibility(BigDecimal maxAdvanceEligibility) {
        this.maxAdvanceEligibility = maxAdvanceEligibility;
    }

    public BigDecimal getMonthlySalary() {
        return monthlySalary;
    }

    public void setMonthlySalary(BigDecimal monthlySalary) {
        this.monthlySalary = monthlySalary;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<String> getFeatures() {
        return features;
    }

    public void setFeatures(Set<String> features) {
        this.features = features;
    }
}
