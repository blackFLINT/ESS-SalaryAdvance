"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMyAdvances, getMyProfile, getPendingAdvances } from "../../lib/api";
import { AdvanceRequest, EmployeeProfile } from "../../lib/types";
import { RequestAdvanceForm } from "../../components/RequestAdvanceForm";
import { RequestHistory } from "../../components/RequestHistory";
import { PendingRequestsTable } from "../../components/PendingRequestsTable";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [myRequests, setMyRequests] = useState<AdvanceRequest[]>([]);
  const [pending, setPending] = useState<AdvanceRequest[]>([]);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const load = useCallback(async () => {
    if (!session?.token) {
      router.push("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [p, mine] = await Promise.all([getMyProfile(session.token), getMyAdvances(session.token)]);
      setProfile(p);
      setMyRequests(mine);
      if (p.role === "MANAGER" || p.role === "ADMIN") {
        const queue = await getPendingAdvances(session.token);
        setPending(queue);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [router, session?.token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!session) {
    return null;
  }

  return (
    <main className="page">
      <section className="card stack">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <h1 className="title" style={{ marginBottom: 6 }}>Dashboard</h1>
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

        {!loading && profile && (
          <div className="grid-2">
            <div className="stack">
              <section className="panel stack">
                <h2 style={{ margin: 0 }}>My Profile</h2>
                <p style={{ margin: 0 }}><strong>Employee No:</strong> {profile.employeeNumber}</p>
                <p style={{ margin: 0 }}><strong>Department:</strong> {profile.department}</p>
                <p style={{ margin: 0 }}><strong>Monthly Salary:</strong> {profile.monthlySalary}</p>
              </section>
              <RequestAdvanceForm token={session.token} onSuccess={() => void load()} />
            </div>

            <div className="stack">
              <RequestHistory items={myRequests} />
              {(profile.role === "MANAGER" || profile.role === "ADMIN") && (
                <PendingRequestsTable token={session.token} items={pending} onDecision={() => void load()} />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
