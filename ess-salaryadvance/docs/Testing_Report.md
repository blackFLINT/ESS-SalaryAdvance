# Testing Report

## 1. Testing Scope
- Functional testing
- Unit testing
- Integration testing
- System testing
- User acceptance testing

## 2. Test Environment
- Backend: Spring Boot 3, JUnit 5, Mockito, MockMvc
- Frontend: Next.js, Vitest
- Database: PostgreSQL 16

## 3. Test Cases

| Test Case | Expected Result | Actual Result | Pass/Fail | Defects | Corrective Action |
|---|---|---|---|---|---|
| Login with valid employee credentials | JWT token returned | Token returned | Pass | None | N/A |
| Login with invalid password | 401 Unauthorized | 401 returned | Pass | None | N/A |
| Submit request within configured eligibility | Request created with PENDING status | Created | Pass | None | N/A |
| Submit request above configured eligibility | Rejected with validation message | Rejected | Pass | None | N/A |
| Manager views pending requests | Pending list returned | Returned | Pass | None | N/A |
| Manager approves pending request | Status changes to APPROVED | Updated | Pass | None | N/A |
| Employee tries manager endpoint | 403 Forbidden | 403 returned | Pass | None | N/A |
| Admin/Employee cannot view pending approvals | Access denied or redirected | Restricted | Pass | None | N/A |
| HR/Payroll views approved requests | Approved queue returned | Returned | Pass | None | N/A |
| HR/Payroll processes approved advance | Status changes to PROCESSED and repayment becomes ACTIVE | Updated | Pass | None | N/A |
| Notification created on request submission | Employee and manager notifications recorded | Recorded | Pass | None | N/A |
| Notification created on approval/payroll events | Employee/HR notifications recorded | Recorded | Pass | None | N/A |
| Audit log records request lifecycle | Audit entries created for create, approve/reject, process | Recorded | Pass | None | N/A |
| Admin creates user with corporate profile fields | User created with role, features, department, job title, branch, manager, salary band | Created | Pass | None | N/A |
| Admin updates role/features | Role/feature access updated and audited | Updated | Pass | None | N/A |
| Reports monthly summary | Totals by status and department returned | Returned | Pass | None | N/A |
| CSV export approved advances | CSV file content returned | Returned | Pass | None | N/A |
| Corporate settings update | Settings saved and audited | Saved | Pass | None | N/A |
| Change password with valid current password | Password updated | Updated | Pass | None | N/A |
| Repeated invalid login attempts | Account lockout triggered | Locked | Pass | None | N/A |
| Frontend invalid email format | Inline validation error shown | Error shown | Pass | None | N/A |
| Frontend weak password | Inline validation error shown | Error shown | Pass | None | N/A |
| Frontend amount invalid format | Inline validation error shown | Error shown | Pass | None | N/A |

## 4. Unit Testing Evidence
- Backend service rule validations covered in `AdvanceServiceTest`.
- Frontend schema validation covered in `validation.test.ts`.

## 5. Integration Testing Evidence
- Backend controller security and endpoint behavior covered with MockMvc tests.

## 6. System Testing
- End-to-end user flow verified manually:
  - Employee login -> Dashboard -> Submit Request -> Notification -> Request History.
  - Manager login -> Pending Approvals -> Approve/Reject with confirmation -> Audit entry.
  - HR/Payroll login -> Payroll Processing -> Mark Processed -> Repayment tracking -> Export queue.
  - Admin login -> User Management -> Role/Feature Matrix -> Reports -> Audit Trail -> Corporate Settings.

## 7. User Acceptance Testing
- Scenario-based validation with representative employee and manager actions.

## 8. Security Testing (Baseline)
- Unauthorized endpoint access checks.
- RBAC checks by role.
- Feature-level UI and API access checks.
- Password policy checks.
- Account lockout checks.
- Refresh-token endpoint checks.
- Input validation and error handling checks.

## 9. Defects and Resolution Summary
- No blocking defects in implemented core scope.
- Medium-priority enhancements and external integrations are tracked in the technical debt plan.
