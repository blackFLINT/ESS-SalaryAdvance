package com.ess.salaryadvance.advance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AdvanceDecisionDto {

    @NotBlank(message = "Decision is required")
    @Pattern(regexp = "APPROVED|REJECTED", message = "Decision must be APPROVED or REJECTED")
    private String status;

    @Size(max = 400, message = "Comment must be 400 characters or less")
    private String comment;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
