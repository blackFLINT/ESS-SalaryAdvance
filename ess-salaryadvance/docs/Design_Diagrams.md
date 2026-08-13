# System Design Diagrams

## 1. Use Case Diagram
```mermaid
flowchart LR
  E[Employee]
  M[Manager]
  A[Admin]
  H[HR/Payroll]
  S[(ESS System)]

  E -->|Login| S
  E -->|Submit Advance Request| S
  E -->|View Request Status| S
  E -->|View Repayment Summary| S
  E -->|View Notifications| S

  M -->|Login| S
  M -->|View Pending Requests| S
  M -->|Approve/Reject Requests| S

  A -->|Login| S
  A -->|Manage Users/Roles/Features| S
  A -->|Configure Corporate Settings| S
  A -->|View Audit Trail| S
  A -->|View Reports and Health| S

  H -->|Login| S
  H -->|Process Approved Advances| S
  H -->|Export Payroll Queue| S
```

## 2. Component Diagram
```mermaid
flowchart TB
  subgraph Frontend[Next.js Frontend Service]
    UI[App Router UI]
    VAL[Zod + React Hook Form Validation]
    APIClient[API Client]
  end

  subgraph Backend[Spring Boot Backend Service]
    AUTH[Auth Controller + JWT]
    ADV[Advance Controller/Service]
    EMP[Employee Controller/Service]
    USR[User Management]
    NOTIF[Notifications]
    AUD[Audit Trail]
    REP[Reports + CSV Export]
    SET[Corporate Settings]
    SEC[Security Filter Chain + RBAC]
    REPO[JPA Repositories]
  end

  DB[(PostgreSQL)]

  UI --> VAL
  UI --> APIClient
  APIClient --> AUTH
  APIClient --> ADV
  APIClient --> EMP
  APIClient --> USR
  APIClient --> NOTIF
  APIClient --> AUD
  APIClient --> REP
  APIClient --> SET
  AUTH --> SEC
  ADV --> SEC
  EMP --> SEC
  ADV --> REPO
  EMP --> REPO
  USR --> REPO
  NOTIF --> REPO
  AUD --> REPO
  REP --> REPO
  SET --> REPO
  REPO --> DB
```

## 3. Sequence Diagram (Submit Request)
```mermaid
sequenceDiagram
  actor Employee
  participant FE as Next.js Frontend
  participant BE as Spring Boot Backend
  participant DB as PostgreSQL

  Employee->>FE: Enter amount + reason
  FE->>FE: Validate with Zod
  FE->>BE: POST /api/advances (JWT)
  BE->>BE: Validate DTO + business rule
  BE->>DB: Save request (PENDING)
  BE->>DB: Save audit log + notifications
  DB-->>BE: Request persisted
  BE-->>FE: 200 + request payload
  FE-->>Employee: Success message + updated history
```

## 4. Sequence Diagram (Approve and Process Request)
```mermaid
sequenceDiagram
  actor Manager
  actor Payroll as HR/Payroll
  participant FE as Next.js Frontend
  participant BE as Spring Boot Backend
  participant DB as PostgreSQL

  Manager->>FE: Approve pending request with comment
  FE->>BE: PATCH /api/advances/{id}/decision (JWT)
  BE->>DB: Update status to APPROVED
  BE->>DB: Save audit log + employee/payroll notifications
  BE-->>FE: Approved request

  Payroll->>FE: Mark approved request processed
  FE->>BE: PATCH /api/advances/{id}/process (JWT)
  BE->>DB: Update status to PROCESSED + repayment plan
  BE->>DB: Save audit log + employee notification
  BE-->>FE: Processed request with repayment data
```

## 5. ER Diagram
```mermaid
erDiagram
  EMPLOYEES ||--o{ SALARY_ADVANCE_REQUESTS : submits
  EMPLOYEES ||--o{ NOTIFICATIONS : receives
  EMPLOYEES ||--o{ REFRESH_TOKENS : owns

  EMPLOYEES {
    bigint id PK
    string employee_number
    string full_name
    string email
    string password_hash
    string department
    string job_title
    string branch_location
    string manager_name
    string salary_band
    decimal max_advance_eligibility
    decimal monthly_salary
    string role
    int failed_login_attempts
    boolean account_locked
    boolean two_factor_enabled
    datetime created_at
  }

  SALARY_ADVANCE_REQUESTS {
    bigint id PK
    bigint employee_id FK
    decimal amount
    string reason
    string status
    string approver_comment
    string payroll_comment
    int repayment_installments
    decimal monthly_deduction_amount
    decimal remaining_balance
    string repayment_status
    datetime created_at
    datetime updated_at
  }

  NOTIFICATIONS {
    bigint id PK
    bigint employee_id FK
    string title
    string message
    boolean read
    datetime created_at
  }

  AUDIT_LOGS {
    bigint id PK
    datetime occurred_at
    string action
    string entity_type
    bigint entity_id
    string actor
    string details
  }

  CORPORATE_SETTINGS {
    bigint id PK
    string company_name
    string logo_url
    decimal maximum_advance_percentage
    int minimum_employment_months
    int allowed_repayment_periods
    string currency
    decimal manager_approval_threshold
    decimal finance_approval_threshold
  }

  REFRESH_TOKENS {
    bigint id PK
    bigint employee_id FK
    string token
    datetime expires_at
    boolean revoked
  }
```
