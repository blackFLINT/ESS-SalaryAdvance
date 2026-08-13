# Technical Debt Plan

## Debt Register

| Debt | Cause | Impact | Priority | Proposed Resolution | Classification |
|---|---|---|---|---|---|
| Simplified JWT secret management | 48-hour constraint; env var only | Risk if secret lifecycle is not managed | High | Move to managed secrets service (Azure Key Vault) | Critical |
| Audit trail retention and export policy not finalized | Audit entity exists, but retention/export rules need governance | Compliance reporting may be incomplete | Medium | Add retention policy, filters, and export controls | Scheduled |
| In-app notifications only | Email/SMS provider not integrated | Users must log in to see updates | Medium | Integrate email/SMS provider with retry queue | Scheduled |
| Feature-level RBAC exists, but no policy engine | Current model uses enums and role checks | Complex approval policies need code changes | Medium | Add policy-based authorization and role hierarchy | Scheduled |
| Multi-level approval engine not implemented | Thresholds are configurable but approval chain is not dynamic | Large-enterprise financial controls are limited | Medium | Add approval workflow entity and escalation logic | Scheduled |
| Reports are CSV/basic summary only | Enterprise analytics deferred | Limited management insight | Low | Add Excel/PDF exports, filters, and trend charts | Scheduled |
| Limited automated E2E tests | Time and tooling setup constraints | Higher regression risk on UI changes | High | Add Playwright E2E suite in CI | Scheduled |
| Docker Compose only deployment template | Focus on local reproducibility | Manual production hardening required | Medium | Add IaC + CI/CD templates for cloud | Scheduled |
| Basic frontend state persistence | Lightweight implementation | Token handling can be improved | Medium | Migrate to secure cookie/session strategy | Scheduled |

## Technical Debt Repayment Plan

### Sprint 1 (Immediate)
- Secret management hardening.
- Add E2E regression suite.

### Sprint 2
- Audit retention/export improvements and policy-based authorization.

### Sprint 3
- Email/SMS notification pipeline and cloud-native deployment automation.

### Sprint 4
- Multi-level approval workflow and advanced reporting exports.
