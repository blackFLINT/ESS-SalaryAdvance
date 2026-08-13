package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "salary_advance_requests")
public class SalaryAdvanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 600)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status;

    @Column(length = 400)
    private String approverComment;

    @Column(length = 400)
    private String payrollComment;

    @Column(nullable = false)
    private Integer repaymentInstallments = 3;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal monthlyDeductionAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal remainingBalance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RepaymentStatus repaymentStatus = RepaymentStatus.PENDING;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getApproverComment() {
        return approverComment;
    }

    public void setApproverComment(String approverComment) {
        this.approverComment = approverComment;
    }

    public String getPayrollComment() {
        return payrollComment;
    }

    public void setPayrollComment(String payrollComment) {
        this.payrollComment = payrollComment;
    }

    public Integer getRepaymentInstallments() {
        return repaymentInstallments;
    }

    public void setRepaymentInstallments(Integer repaymentInstallments) {
        this.repaymentInstallments = repaymentInstallments;
    }

    public BigDecimal getMonthlyDeductionAmount() {
        return monthlyDeductionAmount;
    }

    public void setMonthlyDeductionAmount(BigDecimal monthlyDeductionAmount) {
        this.monthlyDeductionAmount = monthlyDeductionAmount;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(BigDecimal remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

    public RepaymentStatus getRepaymentStatus() {
        return repaymentStatus;
    }

    public void setRepaymentStatus(RepaymentStatus repaymentStatus) {
        this.repaymentStatus = repaymentStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
