# Employee Self Service Salary Advance (ESS)

Production-ready Employee Self Service web application with:
- Spring Boot backend microservice
- Next.js frontend microservice
- PostgreSQL database

## Monorepo Structure

```
ESS-SalaryAdvance/
├── backend-service/
├── frontend-service/
├── docs/
├── docker-compose.yml
└── README.md
```

## Quick Start

### 1. Configure environment

Copy the examples and adjust values as needed:

```bash
cp backend-service/.env.example backend-service/.env
cp frontend-service/.env.example frontend-service/.env.local
```

### 2. Run with Docker Compose

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

### 3. Seeded Login Accounts

The backend seeds four users on first startup. Use local/demo passwords only in private assessor channels; do not publish production passwords.

- Employee
	- email: employee@ess.local
- Manager
	- email: manager@ess.local
- Admin
	- email: admin@ess.local
- HR/Payroll
	- email: payroll@ess.local

The local seed password is controlled by `APP_SEED_PASSWORD`. Share assessor-safe demo passwords privately, not in public documentation.

## Core Features

- JWT authentication and role-based authorization
- Refresh-token support, password change, password policy, and account lockout
- Role-based and feature-level authorization
- Employee self-service salary advance request
- Configurable advance eligibility using corporate settings and employee-specific max advance eligibility
- Manager review and approve/reject flow
- HR/Payroll approved advance processing with repayment schedule setup
- Repayment tracking: installments, monthly deduction, remaining balance, repayment status
- In-app notifications for submitted, approved/rejected, payroll-ready, and processed events
- Audit trail for request lifecycle, user creation, role/feature changes, settings updates, and password changes
- Monthly reports and CSV export for approved/processed advances
- Admin user-management module: create users, assign roles, assign feature access
- Admin corporate settings module
- Admin system health and audit visibility
- Role/Feature Matrix for visual permission auditing
- Responsive frontend with production-grade form validation (Zod + React Hook Form)
- Backend input validation and centralized error handling
- Unit tests and integration-style controller tests

## API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/change-password`

### Employee
- `GET /api/employees/me`
- `POST /api/advances`
- `GET /api/advances/me`

### Manager
- `GET /api/advances/pending`
- `PATCH /api/advances/{id}/decision`

### HR/Payroll
- `GET /api/advances/approved`
- `PATCH /api/advances/{id}/process`

### Admin User Management
- `GET /api/users`
- `GET /api/users/features`
- `POST /api/users`
- `PATCH /api/users/{userId}/access`

### Enterprise Operations
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `GET /api/audit`
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/reports/monthly`
- `GET /api/reports/export`

## Documentation

Project documentation is in `docs/`:
- `Project_Documentation.md`
- `SRS.md`
- `Testing_Report.md`
- `Technical_Debt_Plan.md`
- `User_Manual.md`
- `Deployment_and_Source_Links.txt`

These map directly to your submission checklist and can be exported to PDF for LMS upload.
