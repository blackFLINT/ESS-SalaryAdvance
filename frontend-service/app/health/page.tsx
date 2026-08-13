"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMyProfile, getSystemHealth } from "../../lib/api";
import { EmployeeProfile } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canViewSystemHealth } from "../../lib/roles";

export default function HealthPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [status, setStatus] = useState("UNKNOWN");

  useEffect(() => {
    setSession(getSession());
  }, []);

  const load = useCallback(async () => {
    if (session === undefined) {
      return;
    }
    if (!session?.token) {
      router.push("/");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const p = await getMyProfile(session.token);
      setProfile(p);
      if (!canViewSystemHealth(session.role, session.features) || !canViewSystemHealth(p.role, p.features)) {
        router.push("/dashboard");
        return;
      }
      const health = await getSystemHealth(session.token);
      setStatus(health.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to retrieve system health");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => {
    void load();
  }, [load]);

  if (session === undefined || !session) {
    return null;
  }

  return (
    <main className="app-shell">
      <AppMenu session={session} />
      <section className="card stack">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <h1 className="title" style={{ marginBottom: 6 }}>System Health</h1>
            <p className="subtitle" style={{ margin: 0 }}>
              {profile ? `${profile.fullName} (${profile.role})` : session.email}
            </p>
          </div>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              clearSession();
              router.push("/");
            }}
          >
            Sign Out
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && (
          <section className="panel stack">
            <h2 style={{ margin: 0 }}>Application Health Status</h2>
            <p style={{ margin: 0 }}>Current Status: <strong>{status}</strong></p>
            <button type="button" onClick={() => void load()}>Refresh Status</button>
          </section>
        )}
      </section>
    </main>
  );
}
