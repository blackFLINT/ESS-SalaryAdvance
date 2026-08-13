package com.ess.salaryadvance.report;

import java.math.BigDecimal;
import java.util.Map;

public class ReportSummaryDto {
    private long totalRequests;
    private BigDecimal totalAmount;
    private BigDecimal processedAmount;
    private Map<String, Long> requestsByStatus;
    private Map<String, Long> requestsByDepartment;

    public ReportSummaryDto(long totalRequests, BigDecimal totalAmount, BigDecimal processedAmount,
            Map<String, Long> requestsByStatus, Map<String, Long> requestsByDepartment) {
        this.totalRequests = totalRequests;
        this.totalAmount = totalAmount;
        this.processedAmount = processedAmount;
        this.requestsByStatus = requestsByStatus;
        this.requestsByDepartment = requestsByDepartment;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getProcessedAmount() {
        return processedAmount;
    }

    public Map<String, Long> getRequestsByStatus() {
        return requestsByStatus;
    }

    public Map<String, Long> getRequestsByDepartment() {
        return requestsByDepartment;
    }
}