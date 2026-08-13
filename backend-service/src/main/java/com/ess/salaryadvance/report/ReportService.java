package com.ess.salaryadvance.report;

import com.ess.salaryadvance.advance.RequestStatus;
import com.ess.salaryadvance.advance.SalaryAdvanceRequest;
import com.ess.salaryadvance.advance.SalaryAdvanceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final SalaryAdvanceRequestRepository requestRepository;

    public ReportService(SalaryAdvanceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Transactional(readOnly = true)
    public ReportSummaryDto monthlySummary(int year, int month) {
        List<SalaryAdvanceRequest> requests = requestRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(
                start(year, month), end(year, month));
        BigDecimal totalAmount = requests.stream().map(SalaryAdvanceRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal processedAmount = requests.stream()
                .filter(request -> request.getStatus() == RequestStatus.PROCESSED)
                .map(SalaryAdvanceRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Long> byStatus = requests.stream()
                .collect(Collectors.groupingBy(request -> request.getStatus().name(), Collectors.counting()));
        Map<String, Long> byDepartment = requests.stream()
                .collect(
                        Collectors.groupingBy(request -> request.getEmployee().getDepartment(), Collectors.counting()));
        return new ReportSummaryDto(requests.size(), totalAmount, processedAmount, byStatus, byDepartment);
    }

    @Transactional(readOnly = true)
    public String exportCsv(RequestStatus status) {
        List<SalaryAdvanceRequest> requests = requestRepository.findByStatusOrderByUpdatedAtAsc(status);
        StringBuilder csv = new StringBuilder(
                "id,employee,department,amount,status,repaymentStatus,createdAt,updatedAt\n");
        for (SalaryAdvanceRequest request : requests) {
            csv.append(request.getId()).append(',')
                    .append(escape(request.getEmployee().getFullName())).append(',')
                    .append(escape(request.getEmployee().getDepartment())).append(',')
                    .append(request.getAmount()).append(',')
                    .append(request.getStatus()).append(',')
                    .append(request.getRepaymentStatus()).append(',')
                    .append(request.getCreatedAt()).append(',')
                    .append(request.getUpdatedAt()).append('\n');
        }
        return csv.toString();
    }

    private Instant start(int year, int month) {
        return LocalDate.of(year, month, 1).atStartOfDay().toInstant(ZoneOffset.UTC);
    }

    private Instant end(int year, int month) {
        return LocalDate.of(year, month, 1).plusMonths(1).atStartOfDay().toInstant(ZoneOffset.UTC);
    }

    private String escape(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}