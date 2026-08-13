package com.ess.salaryadvance.settings;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class CorporateSettingsController {

    private final CorporateSettingsService settingsService;

    public CorporateSettingsController(CorporateSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<CorporateSettings> get() {
        return ResponseEntity.ok(settingsService.get());
    }

    @PutMapping
    public ResponseEntity<CorporateSettings> update(@Valid @RequestBody CorporateSettings request,
            Authentication authentication) {
        return ResponseEntity.ok(settingsService.update(request, authentication.getName()));
    }
}