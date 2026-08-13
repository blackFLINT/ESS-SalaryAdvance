package com.ess.salaryadvance.advance;

import java.math.BigDecimal;
import java.time.Instant;

public class AdvanceResponseDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private BigDecimal amount;
    private String reason;
    private String status;
    private String approverComment;
    private String payrollComment;
    private Integer repaymentInstallments;
    private BigDecimal monthlyDeductionAmount;
    private BigDecimal remainingBalance;
    private String repaymentStatus;
    private Instant createdAt;
    private Instant updatedAt;

    public static AdvanceResponseDto from(SalaryAdvanceRequest request) {
        AdvanceResponseDto dto = new AdvanceResponseDto();
        dto.id = request.getId();
        dto.employeeId = request.getEmployee().getId();
        dto.employeeName = request.getEmployee().getFullName();
        dto.amount = request.getAmount();
        dto.reason = request.getReason();
        dto.status = request.getStatus().name();
        dto.approverComment = request.getApproverComment();
        dto.payrollComment = request.getPayrollComment();
        dto.repaymentInstallments = request.getRepaymentInstallments();
        dto.monthlyDeductionAmount = request.getMonthlyDeductionAmount();
        dto.remainingBalance = request.getRemainingBalance();
        dto.repaymentStatus = request.getRepaymentStatus().name();
        dto.createdAt = request.getCreatedAt();
        dto.updatedAt = request.getUpdatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public String getApproverComment() {
        return approverComment;
    }

    public String getPayrollComment() {
        return payrollComment;
    }

    public Integer getRepaymentInstallments() {
        return repaymentInstallments;
    }

    public BigDecimal getMonthlyDeductionAmount() {
        return monthlyDeductionAmount;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public String getRepaymentStatus() {
        return repaymentStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
