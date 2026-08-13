package com.ess.salaryadvance.employee;

import java.math.BigDecimal;

public class EmployeeProfileDto {
    private Long id;
    private String employeeNumber;
    private String fullName;
    private String email;
    private String department;
    private BigDecimal monthlySalary;
    private String role;

    public EmployeeProfileDto(Employee employee) {
        this.id = employee.getId();
        this.employeeNumber = employee.getEmployeeNumber();
        this.fullName = employee.getFullName();
        this.email = employee.getEmail();
        this.department = employee.getDepartment();
        this.monthlySalary = employee.getMonthlySalary();
        this.role = employee.getRole().name();
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

    public BigDecimal getMonthlySalary() {
        return monthlySalary;
    }

    public String getRole() {
        return role;
    }
}
