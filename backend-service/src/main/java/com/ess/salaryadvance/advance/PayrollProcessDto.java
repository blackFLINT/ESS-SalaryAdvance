package com.ess.salaryadvance.advance;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class PayrollProcessDto {

    @Min(value = 1, message = "Repayment installments must be at least 1")
    @Max(value = 24, message = "Repayment installments cannot exceed 24")
    private Integer repaymentInstallments = 3;

    @Size(max = 400, message = "Payroll comment must be 400 characters or less")
    private String comment;

    public Integer getRepaymentInstallments() {
        return repaymentInstallments;
    }

    public void setRepaymentInstallments(Integer repaymentInstallments) {
        this.repaymentInstallments = repaymentInstallments;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}