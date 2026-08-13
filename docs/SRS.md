# Software Requirements Specification (SRS)

## 1. Introduction
This SRS defines requirements for the Employee Self Service Salary Advance System.

## 2. Stakeholders and Users
- Employee: submits and tracks requests.
- Manager: reviews and decides requests.
- Admin: oversight and system management.
- HR/Payroll: downstream processing.

## 3. Functional Requirements
### FR-01 Authentication
Users shall log in using email and password.

### FR-02 Authorization
System shall enforce role-based access control:
- Employee: own data and requests.
- Manager: pending requests review.
- Admin: all manager capabilities plus monitoring.

### FR-03 Submit Request
Employee shall submit salary advance request with amount and reason.

### FR-04 Request Rule Validation
System shall reject requests where amount exceeds 50% of monthly salary.

### FR-05 Request Tracking
Employee shall view own request history and status.

### FR-06 Approval Workflow
Manager/Admin shall approve or reject pending requests with comments.

### FR-07 Error Feedback
System shall provide clear validation and business rule errors.

## 4. Non-Functional Requirements
### NFR-01 Security
- JWT authentication
- Password hashing (BCrypt)
- CORS restrictions
- Input validation and sanitized error responses

### NFR-02 Performance
- Typical API response under 500ms for core operations in normal load.

### NFR-03 Availability
- Target 99.5% monthly uptime.

### NFR-04 Scalability
- Independent scaling of frontend and backend services.

### NFR-05 Usability
- Responsive UI for desktop and mobile screens.

### NFR-06 Maintainability
- Modular architecture, test coverage for critical workflows.

## 5. Requirement Prioritization (MoSCoW)
### Must Have
- FR-01 to FR-06, NFR-01, NFR-05

### Should Have
- NFR-02, NFR-04, API monitoring, audit enhancement

### Could Have
- Notifications and advanced analytics

### Won't Have (v1)
- Direct payroll disbursement integration

## 6. Constraints
- 48-hour academic build constraint for initial delivery.
- Limited time for full observability and load testing.

## 7. Assumptions
- Users have organizational email accounts.
- Managers are pre-assigned by HR data.
- PostgreSQL service is available in deployment environment.
