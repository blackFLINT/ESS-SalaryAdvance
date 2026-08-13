import { LoginResponse } from "./types";

const KEY = "ess.auth";

export function saveSession(payload: LoginResponse): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getSession(): LoginResponse | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(KEY);
}
