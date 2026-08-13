package com.ess.salaryadvance.report;

import com.ess.salaryadvance.advance.RequestStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ReportSummaryDto> monthly(@RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        return ResponseEntity.ok(reportService.monthlySummary(year == null ? now.getYear() : year,
                month == null ? now.getMonthValue() : month));
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<String> export(@RequestParam(defaultValue = "APPROVED") String status) {
        String csv = reportService.exportCsv(RequestStatus.valueOf(status.trim().toUpperCase()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=salary-advances.csv")
                .contentType(new MediaType("text", "csv"))
                .body(csv);
    }
}