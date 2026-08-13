export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN" | "HR_PAYROLL";
export type FeatureAccess =
  | "DASHBOARD_VIEW"
  | "REQUEST_SUBMIT"
  | "REQUEST_HISTORY_VIEW"
  | "PENDING_APPROVAL_VIEW"
  | "APPROVE_REQUEST"
  | "USER_MANAGEMENT"
  | "APPROVED_ADVANCES_VIEW"
  | "ADVANCE_PROCESS"
  | "SYSTEM_HEALTH_VIEW"
  | "AUDIT_LOG_VIEW"
  | "REPORTS_VIEW"
  | "SETTINGS_MANAGE"
  | "NOTIFICATIONS_VIEW";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  role: UserRole;
  fullName: string;
  email: string;
  features: FeatureAccess[];
}

export interface EmployeeProfile {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  department: string;
  jobTitle?: string;
  branchLocation?: string;
  managerName?: string;
  salaryBand?: string;
  maxAdvanceEligibility?: number;
  monthlySalary: number;
  role: UserRole;
  features: FeatureAccess[];
  twoFactorEnabled?: boolean;
}

export interface AdvanceRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
  approverComment?: string;
  payrollComment?: string;
  repaymentInstallments: number;
  monthlyDeductionAmount: number;
  remainingBalance: number;
  repaymentStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "OVERDUE";
  createdAt: string;
  updatedAt: string;
}

export interface ManagedUser {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  department: string;
  jobTitle?: string;
  branchLocation?: string;
  managerName?: string;
  salaryBand?: string;
  maxAdvanceEligibility?: number;
  monthlySalary: number;
  role: UserRole;
  features: FeatureAccess[];
}

export interface CreateUserPayload {
  employeeNumber: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
  jobTitle?: string;
  branchLocation?: string;
  managerName?: string;
  salaryBand?: string;
  maxAdvanceEligibility?: number;
  monthlySalary: number;
  role: UserRole;
  features: FeatureAccess[];
}

export interface UpdateUserAccessPayload {
  role: UserRole;
  features: FeatureAccess[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: number;
  occurredAt: string;
  action: string;
  entityType: string;
  entityId?: number;
  actor: string;
  details: string;
}

export interface CorporateSettings {
  id: number;
  companyName: string;
  logoUrl?: string;
  maximumAdvancePercentage: number;
  minimumEmploymentMonths: number;
  allowedRepaymentPeriods: number;
  currency: string;
  managerApprovalThreshold: number;
  financeApprovalThreshold: number;
}

export interface ReportSummary {
  totalRequests: number;
  totalAmount: number;
  processedAmount: number;
  requestsByStatus: Record<string, number>;
  requestsByDepartment: Record<string, number>;
}
