import {
  AdvanceRequest,
  AuditLogItem,
  CorporateSettings,
  CreateUserPayload,
  EmployeeProfile,
  LoginResponse,
  ManagedUser,
  NotificationItem,
  ReportSummary,
  UpdateUserAccessPayload
} from "./types";

const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const API_BASE = runtimeEnv?.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

async function errorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return "Request failed";
  }
  try {
    const payload = JSON.parse(text) as { message?: string; details?: Record<string, string> };
    if (payload.details) {
      return Object.values(payload.details).join(" ");
    }
    return payload.message ?? text;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function refreshToken(refreshTokenValue: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue })
  });
}

export function changePassword(token: string, currentPassword: string, newPassword: string): Promise<void> {
  return request<void>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword })
  }, token);
}

export function getMyProfile(token: string): Promise<EmployeeProfile> {
  return request<EmployeeProfile>("/employees/me", {}, token);
}

export function createAdvance(token: string, amount: number, reason: string): Promise<AdvanceRequest> {
  return request<AdvanceRequest>("/advances", {
    method: "POST",
    body: JSON.stringify({ amount, reason })
  }, token);
}

export function getMyAdvances(token: string): Promise<AdvanceRequest[]> {
  return request<AdvanceRequest[]>("/advances/me", {}, token);
}

export function getPendingAdvances(token: string): Promise<AdvanceRequest[]> {
  return request<AdvanceRequest[]>("/advances/pending", {}, token);
}

export function getApprovedAdvances(token: string): Promise<AdvanceRequest[]> {
  return request<AdvanceRequest[]>("/advances/approved", {}, token);
}

export function decideAdvance(
  token: string,
  requestId: number,
  status: "APPROVED" | "REJECTED",
  comment: string
): Promise<AdvanceRequest> {
  return request<AdvanceRequest>(`/advances/${requestId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ status, comment })
  }, token);
}

export function processAdvance(token: string, requestId: number): Promise<AdvanceRequest> {
  return request<AdvanceRequest>(`/advances/${requestId}/process`, {
    method: "PATCH",
    body: JSON.stringify({ repaymentInstallments: 3, comment: "Processed by payroll" })
  }, token);
}

export function processAdvanceWithPlan(
  token: string,
  requestId: number,
  repaymentInstallments: number,
  comment: string
): Promise<AdvanceRequest> {
  return request<AdvanceRequest>(`/advances/${requestId}/process`, {
    method: "PATCH",
    body: JSON.stringify({ repaymentInstallments, comment })
  }, token);
}

export function getSystemHealth(token: string): Promise<{ status: string }> {
  return request<{ status: string }>("/health", {}, token);
}

export function getUsers(token: string): Promise<ManagedUser[]> {
  return request<ManagedUser[]>("/users", {}, token);
}

export function getFeatures(token: string): Promise<string[]> {
  return request<string[]>("/users/features", {}, token);
}

export function createUser(token: string, payload: CreateUserPayload): Promise<ManagedUser> {
  return request<ManagedUser>("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  }, token);
}

export function updateUserAccess(token: string, userId: number, payload: UpdateUserAccessPayload): Promise<ManagedUser> {
  return request<ManagedUser>(`/users/${userId}/access`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  }, token);
}

export function getNotifications(token: string): Promise<NotificationItem[]> {
  return request<NotificationItem[]>("/notifications", {}, token);
}

export function getAuditLogs(token: string): Promise<AuditLogItem[]> {
  return request<AuditLogItem[]>("/audit", {}, token);
}

export function getSettings(token: string): Promise<CorporateSettings> {
  return request<CorporateSettings>("/settings", {}, token);
}

export function updateSettings(token: string, payload: CorporateSettings): Promise<CorporateSettings> {
  return request<CorporateSettings>("/settings", {
    method: "PUT",
    body: JSON.stringify(payload)
  }, token);
}

export function getMonthlyReport(token: string): Promise<ReportSummary> {
  return request<ReportSummary>("/reports/monthly", {}, token);
}

export async function exportReportCsv(token: string, status: "APPROVED" | "PROCESSED" = "APPROVED"): Promise<string> {
  const response = await fetch(`${API_BASE}/reports/export?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response) || "Export failed");
  }
  return response.text();
}
