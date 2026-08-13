# User Manual

## 1. Accessing the System
- Open the frontend URL in your browser.
- Enter your email and password to log in.

## 2. Employee Actions
### Submit Salary Advance Request
1. Log in as Employee.
2. Go to Requests from the role-specific dashboard.
3. Enter amount and reason.
4. Click Submit.

### View Request History
- Open Requests or Dashboard to check My Requests for current statuses, comments, and repayment details.

### View Repayment Summary
- After HR/Payroll processes an approved advance, Dashboard shows installments, monthly deduction, remaining balance, and repayment status.

### View Notifications
- Dashboard shows recent in-app notifications such as submitted, approved/rejected, sent to payroll, and processed events.

## 3. Manager Actions
### Review Pending Requests
1. Log in as Manager.
2. Go to Pending Approvals from the dashboard.
3. Select Approve or Reject.
4. Provide an optional comment.
5. Confirm the action when prompted.

## 4. HR/Payroll Actions
### Process Approved Advances
1. Log in as HR/Payroll.
2. Go to Payroll Processing.
3. Review approved advances awaiting payroll.
4. Set repayment installments and payroll comment.
5. Click Mark Processed and confirm.

### Export Payroll Queue
- From Payroll Processing or Reports, use CSV export for approved or processed advances.

## 5. System Admin Actions
### Manage Users and Permissions
1. Log in as Admin.
2. Go to User Management.
3. Create users with department, job title, branch/location, manager, salary band, salary, role, and feature access.
4. Use Assign Role & Features to update existing users.
5. Review the Role/Feature Matrix for permission visibility.

### View Audit Trail
- Go to Audit Trail to review request, payroll, password, settings, user, and access-change events.

### Manage Corporate Settings
- Go to Corporate Settings to configure company name, logo URL, maximum advance percentage, minimum employment months, repayment periods, currency, and approval thresholds.

### View Reports
- Go to Reports & Exports to view monthly summary, requests by status, requests by department, total amount, processed amount, and CSV exports.

### View System Health
- Go to System Health to check backend API availability.

## 6. Validation and Errors
- Invalid forms show inline error messages.
- Business rule violations, such as exceeding configured advance eligibility, show clear API error messages.
- Empty lists show user-friendly empty states.
- Approve, reject, and process actions require confirmation.

## 7. Security Notes
- Do not share credentials.
- Log out after use on shared devices.
- Change password from the Security page when required.
- The password policy requires uppercase, lowercase, number, symbol, and 8-64 characters.
- Accounts are temporarily locked after repeated failed login attempts.
- Demo passwords must be shared privately and must not be published in documentation.

## 8. Troubleshooting
- If login fails, confirm credentials.
- If API is unavailable, check backend and database container status.
- If a page redirects to Dashboard, confirm the current user has the required role and feature access.
