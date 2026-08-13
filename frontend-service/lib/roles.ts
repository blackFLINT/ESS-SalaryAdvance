import { FeatureAccess, UserRole } from "./types";

export function canApprove(role?: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageUsers(role?: UserRole, features?: FeatureAccess[]): boolean {
  return role === "ADMIN" && (features ?? []).includes("USER_MANAGEMENT");
}

export function canProcessPayroll(role?: UserRole, features?: FeatureAccess[]): boolean {
  const f = features ?? [];
  return role === "HR_PAYROLL" && f.includes("APPROVED_ADVANCES_VIEW") && f.includes("ADVANCE_PROCESS");
}

export function canViewSystemHealth(role?: UserRole, features?: FeatureAccess[]): boolean {
  return role === "ADMIN" && (features ?? []).includes("SYSTEM_HEALTH_VIEW");
}

export function canViewAudit(role?: UserRole, features?: FeatureAccess[]): boolean {
  return role === "ADMIN" && (features ?? []).includes("AUDIT_LOG_VIEW");
}

export function canViewReports(role?: UserRole, features?: FeatureAccess[]): boolean {
  const f = features ?? [];
  return (role === "ADMIN" || role === "HR_PAYROLL") && f.includes("REPORTS_VIEW");
}

export function canManageSettings(role?: UserRole, features?: FeatureAccess[]): boolean {
  return role === "ADMIN" && (features ?? []).includes("SETTINGS_MANAGE");
}
