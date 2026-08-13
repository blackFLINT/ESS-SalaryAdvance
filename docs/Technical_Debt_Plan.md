# Technical Debt Plan

## Debt Register

| Debt | Cause | Impact | Priority | Proposed Resolution | Classification |
|---|---|---|---|---|---|
| Simplified JWT secret management | 48-hour constraint; env var only | Risk if secret lifecycle is not managed | High | Move to managed secrets service (Azure Key Vault) | Critical |
| Minimal audit trail fields | Scope focused on core workflow | Reduced traceability for compliance | Medium | Add audit entity and immutable event log | Scheduled |
| No email/SMS notifications | Time-boxed delivery | Users must manually check status | Low | Integrate notification service and retry queue | Acceptable temporary |
| Basic RBAC roles only | Initial architecture simplification | Limited policy granularity | Medium | Add policy-based authorization and role hierarchy | Scheduled |
| Limited automated E2E tests | Time and tooling setup constraints | Higher regression risk on UI changes | High | Add Playwright E2E suite in CI | Scheduled |
| Docker Compose only deployment template | Focus on local reproducibility | Manual production hardening required | Medium | Add IaC + CI/CD templates for cloud | Scheduled |
| Basic frontend state persistence | Lightweight implementation | Token handling can be improved | Medium | Migrate to secure cookie/session strategy | Scheduled |

## Technical Debt Repayment Plan

### Sprint 1 (Immediate)
- Secret management hardening.
- Add E2E regression suite.

### Sprint 2
- Audit logging and policy-based authorization.

### Sprint 3
- Notification pipeline and cloud-native deployment automation.
