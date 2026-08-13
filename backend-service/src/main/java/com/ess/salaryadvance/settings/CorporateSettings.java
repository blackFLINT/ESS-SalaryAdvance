package com.ess.salaryadvance.settings;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "corporate_settings")
public class CorporateSettings {

    @Id
    private Long id = 1L;

    @Column(nullable = false, length = 120)
    private String companyName = "ESS Salary Advance";

    @Column(length = 300)
    private String logoUrl;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal maximumAdvancePercentage = new BigDecimal("50.00");

    @Column(nullable = false)
    private Integer minimumEmploymentMonths = 6;

    @Column(nullable = false)
    private Integer allowedRepaymentPeriods = 3;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal managerApprovalThreshold = new BigDecimal("1000.00");

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal financeApprovalThreshold = new BigDecimal("5000.00");

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public BigDecimal getMaximumAdvancePercentage() {
        return maximumAdvancePercentage;
    }

    public void setMaximumAdvancePercentage(BigDecimal maximumAdvancePercentage) {
        this.maximumAdvancePercentage = maximumAdvancePercentage;
    }

    public Integer getMinimumEmploymentMonths() {
        return minimumEmploymentMonths;
    }

    public void setMinimumEmploymentMonths(Integer minimumEmploymentMonths) {
        this.minimumEmploymentMonths = minimumEmploymentMonths;
    }

    public Integer getAllowedRepaymentPeriods() {
        return allowedRepaymentPeriods;
    }

    public void setAllowedRepaymentPeriods(Integer allowedRepaymentPeriods) {
        this.allowedRepaymentPeriods = allowedRepaymentPeriods;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getManagerApprovalThreshold() {
        return managerApprovalThreshold;
    }

    public void setManagerApprovalThreshold(BigDecimal managerApprovalThreshold) {
        this.managerApprovalThreshold = managerApprovalThreshold;
    }

    public BigDecimal getFinanceApprovalThreshold() {
        return financeApprovalThreshold;
    }

    public void setFinanceApprovalThreshold(BigDecimal financeApprovalThreshold) {
        this.financeApprovalThreshold = financeApprovalThreshold;
    }
}