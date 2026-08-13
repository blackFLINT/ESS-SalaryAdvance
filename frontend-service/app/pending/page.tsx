"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMyProfile, getPendingAdvances } from "../../lib/api";
import { AppMenu } from "../../components/AppMenu";
import { PendingRequestsTable } from "../../components/PendingRequestsTable";
import { AdvanceRequest, EmployeeProfile } from "../../lib/types";
import { canApprove } from "../../lib/roles";

export default function PendingPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [pending, setPending] = useState<AdvanceRequest[]>([]);

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

      if (!canApprove(session.role) || !canApprove(p.role)) {
        router.push("/dashboard");
        return;
      }

      const queue = await getPendingAdvances(session.token);
      setPending(queue);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  }, [router, session?.token, session?.role]);

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
            <h1 className="title" style={{ marginBottom: 6 }}>Pending Approvals</h1>
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

        {!loading && profile && canApprove(profile.role) && (
          <PendingRequestsTable token={session.token} items={pending} onDecision={() => void load()} />
        )}
      </section>
    </main>
  );
}
