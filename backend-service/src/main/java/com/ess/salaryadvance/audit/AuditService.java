package com.ess.salaryadvance.audit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, Long entityId, String entityType, String details, String actor) {
        AuditLog log = new AuditLog();
        log.setOccurredAt(Instant.now());
        log.setAction(action);
        log.setEntityId(entityId);
        log.setEntityType(entityType);
        log.setDetails(details);
        log.setActor(actor == null || actor.isBlank() ? "system" : actor);
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> latest() {
        return auditLogRepository.findTop100ByOrderByOccurredAtDesc();
    }
}