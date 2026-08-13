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

The backend seeds three users on first startup:

- Employee
	- email: employee@ess.local
	- password: Password@123
- Manager
	- email: manager@ess.local
	- password: Password@123
- Admin
	- email: admin@ess.local
	- password: Password@123

## Core Features

- JWT authentication and role-based authorization
- Employee self-service salary advance request
- Validation rule: requested amount must be <= 50% of monthly salary
- Manager/Admin review and approve/reject flow
- Responsive frontend with production-grade form validation (Zod + React Hook Form)
- Backend input validation and centralized error handling
- Unit tests and integration-style controller tests

## API Endpoints

### Auth
- `POST /api/auth/login`

### Employee
- `GET /api/employees/me`
- `POST /api/advances`
- `GET /api/advances/me`

### Manager/Admin
- `GET /api/advances/pending`
- `PATCH /api/advances/{id}/decision`

## Documentation

Project documentation is in `docs/`:
- `Project_Documentation.md`
- `SRS.md`
- `Testing_Report.md`
- `Technical_Debt_Plan.md`
- `User_Manual.md`
- `Deployment_and_Source_Links.txt`

These map directly to your submission checklist and can be exported to PDF for LMS upload.
