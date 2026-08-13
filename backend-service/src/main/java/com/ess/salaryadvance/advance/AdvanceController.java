package com.ess.salaryadvance.advance;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/advances")
public class AdvanceController {

    private final AdvanceService advanceService;

    public AdvanceController(AdvanceService advanceService) {
        this.advanceService = advanceService;
    }

    @PostMapping
    public ResponseEntity<AdvanceResponseDto> create(Authentication authentication,
            @Valid @RequestBody CreateAdvanceRequestDto request) {
        return ResponseEntity.ok(advanceService.create(authentication.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AdvanceResponseDto>> myRequests(Authentication authentication) {
        return ResponseEntity.ok(advanceService.listMyRequests(authentication.getName()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AdvanceResponseDto>> pending() {
        return ResponseEntity.ok(advanceService.listPending());
    }

    @PatchMapping("/{id}/decision")
    public ResponseEntity<AdvanceResponseDto> decide(@PathVariable("id") Long id,
            @Valid @RequestBody AdvanceDecisionDto dto) {
        return ResponseEntity.ok(advanceService.decide(id, dto));
    }
}
