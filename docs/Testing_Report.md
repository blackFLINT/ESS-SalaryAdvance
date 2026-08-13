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
| Submit request <= 50% salary | Request created with PENDING status | Created | Pass | None | N/A |
| Submit request > 50% salary | Rejected with validation message | Rejected | Pass | None | N/A |
| Manager views pending requests | Pending list returned | Returned | Pass | None | N/A |
| Manager approves pending request | Status changes to APPROVED | Updated | Pass | None | N/A |
| Employee tries manager endpoint | 403 Forbidden | 403 returned | Pass | None | N/A |
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
  - Login -> Dashboard -> Submit Request -> Manager Review -> Decision.

## 7. User Acceptance Testing
- Scenario-based validation with representative employee and manager actions.

## 8. Security Testing (Baseline)
- Unauthorized endpoint access checks.
- RBAC checks by role.
- Input validation and error handling checks.

## 9. Defects and Resolution Summary
- No blocking defects in implemented core scope.
- Medium-priority enhancements tracked in technical debt plan.
