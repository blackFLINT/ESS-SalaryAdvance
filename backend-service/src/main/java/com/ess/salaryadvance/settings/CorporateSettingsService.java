package com.ess.salaryadvance.settings;

import com.ess.salaryadvance.audit.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CorporateSettingsService {

    private final CorporateSettingsRepository settingsRepository;
    private final AuditService auditService;

    public CorporateSettingsService(CorporateSettingsRepository settingsRepository, AuditService auditService) {
        this.settingsRepository = settingsRepository;
        this.auditService = auditService;
    }

    @Transactional
    public CorporateSettings get() {
        return settingsRepository.findById(1L).orElseGet(() -> settingsRepository.save(new CorporateSettings()));
    }

    @Transactional
    public CorporateSettings update(CorporateSettings request, String actor) {
        CorporateSettings settings = get();
        settings.setCompanyName(request.getCompanyName());
        settings.setLogoUrl(request.getLogoUrl());
        settings.setMaximumAdvancePercentage(request.getMaximumAdvancePercentage());
        settings.setMinimumEmploymentMonths(request.getMinimumEmploymentMonths());
        settings.setAllowedRepaymentPeriods(request.getAllowedRepaymentPeriods());
        settings.setCurrency(request.getCurrency());
        settings.setManagerApprovalThreshold(request.getManagerApprovalThreshold());
        settings.setFinanceApprovalThreshold(request.getFinanceApprovalThreshold());
        auditService.record("SETTINGS_UPDATED", settings.getId(), "CORPORATE_SETTINGS",
                "Corporate settings updated", actor);
        return settingsRepository.save(settings);
    }
}