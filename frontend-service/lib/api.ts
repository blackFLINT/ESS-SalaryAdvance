import { AdvanceRequest, EmployeeProfile, LoginResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
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
