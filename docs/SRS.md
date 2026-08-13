# Software Requirements Specification (SRS)

## 1. Introduction
This SRS defines requirements for the Employee Self Service Salary Advance System.

## 2. Stakeholders and Users
- Employee: submits and tracks requests.
- Manager: reviews and decides requests.
- System Admin: manages users, feature access, corporate settings, audit trail, system health, and reporting.
- HR/Payroll: processes approved advances, exports payroll queues, and monitors repayment information.
- Organization leadership / assessor: reviews reports, controls, traceability, and enterprise readiness.

## 3. Functional Requirements
### FR-01 Authentication
Users shall log in using email and password. The system shall issue JWT access tokens and refresh tokens.

### FR-02 Authorization
System shall enforce role-based and feature-level access control:
- Employee: own data and requests.
- Manager: pending request review and approval/rejection.
- System Admin: user management, role/feature assignment, corporate settings, audit trail, reports, and system health.
- HR/Payroll: approved advance processing, repayment plan setup, and payroll exports.

### FR-03 Submit Request
Employee shall submit salary advance request with amount and reason.

### FR-04 Request Rule Validation
System shall reject requests where amount exceeds configured advance eligibility. Eligibility shall consider corporate maximum advance percentage and employee-specific maximum advance eligibility.

### FR-05 Request Tracking
Employee shall view own request history, status, comments, and repayment summary.

### FR-06 Approval Workflow
Manager shall approve or reject pending requests with comments. Admin and Employee shall not access manager pending approval queues.

### FR-07 Error Feedback
System shall provide clear validation and business rule errors.

### FR-08 HR/Payroll Processing
HR/Payroll shall view approved advances, add payroll processing comments, set repayment installments, and mark approved advances as processed.

### FR-09 Repayment Tracking
System shall track amount advanced, number of repayment installments, monthly deduction amount, remaining balance, and repayment status: pending, active, completed, or overdue.

### FR-10 Notifications
System shall create in-app notifications for request submitted, approval reminder, request approved/rejected, request sent to payroll, and request processed events.

### FR-11 Audit Trail
System shall maintain an audit trail for created requests, approval/rejection decisions, payroll processing, created users, role/feature changes, password changes, and corporate settings updates.

### FR-12 Reports and Exports
System shall provide monthly salary advance reports, requests by status, requests by department, processed amount totals, and CSV exports for approved and processed advances.

### FR-13 User Management
System Admin shall create users and assign roles and feature access. Employee profile data shall include department, job title, employee number, branch/location, manager, salary band, monthly salary, and maximum advance eligibility.

### FR-14 Corporate Settings
System Admin shall configure company name, logo URL, maximum advance percentage, minimum employment duration, allowed repayment periods, currency, manager approval threshold, and finance approval threshold.

### FR-15 Dashboard Experience
After login, users shall see role-specific dashboard actions and statistics:
- Employee: request advance, view status, repayment summary, notifications.
- Manager: pending approvals, approval queue count, and request decision actions.
- System Admin: users, roles, permissions, audit trail, reports, settings, and system health.
- HR/Payroll: approved advances, processed payment workflow, repayment setup, and export queue.

### FR-16 Account Security
System shall enforce password policy, support password change, lock accounts after repeated failed login attempts, support refresh-token rotation, and include a 2FA-ready profile flag for future rollout.

## 4. Non-Functional Requirements
### NFR-01 Security
- JWT authentication
- Refresh-token rotation
- Password hashing (BCrypt)
- Password complexity policy
- Account lockout after repeated failed login attempts
- CORS restrictions
- Input validation and sanitized error responses
- Feature-level access control
- Audit logging for financial and access-control actions

### NFR-02 Performance
- Typical API response under 500ms for core operations in normal load.

### NFR-03 Availability
- Target 99.5% monthly uptime.

### NFR-04 Scalability
- Independent scaling of frontend and backend services.

### NFR-05 Usability
- Responsive UI for desktop and mobile screens.
- Role-specific navigation and empty states.
- Confirmation prompts for approve, reject, and process actions.
- Consistent status badges for pending, approved, rejected, and processed states.

### NFR-06 Maintainability
- Modular architecture, test coverage for critical workflows.

### NFR-07 Auditability
- The system shall preserve traceable records of financial workflow events and administrative access changes.

### NFR-08 Configurability
- Corporate policy values shall be configurable by System Admin without code changes where implemented.

## 5. Requirement Prioritization (MoSCoW)
### Must Have
- FR-01 to FR-16, NFR-01, NFR-05, NFR-07

### Should Have
- NFR-02, NFR-04, NFR-08, API monitoring, expanded automated regression testing

### Could Have
- Email/SMS delivery for notifications, Excel export, advanced analytics, SSO, direct payroll API integration

### Won't Have (v1)
- Direct payroll disbursement integration
- Full multi-level approval engine
- Production SSO/SAML integration

## 6. Constraints
- 48-hour academic build constraint for initial delivery.
- Limited time for full observability and load testing.

## 7. Assumptions
- Users have organizational email accounts.
- Managers are pre-assigned by HR data.
- PostgreSQL service is available in deployment environment.
- Assessor demo credentials are shared privately and not published in production-facing documentation.
