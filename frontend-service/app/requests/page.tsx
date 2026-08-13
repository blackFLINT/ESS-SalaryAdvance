"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMyAdvances, getMyProfile } from "../../lib/api";
import { AdvanceRequest, EmployeeProfile } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { RequestAdvanceForm } from "../../components/RequestAdvanceForm";
import { RequestHistory } from "../../components/RequestHistory";

export default function RequestsPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [myRequests, setMyRequests] = useState<AdvanceRequest[]>([]);

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
      const [p, mine] = await Promise.all([getMyProfile(session.token), getMyAdvances(session.token)]);
      setProfile(p);
      setMyRequests(mine);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load requests page");
    } finally {
      setLoading(false);
    }
  }, [router, session?.token]);

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
            <h1 className="title" style={{ marginBottom: 6 }}>Requests</h1>
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
          <div className="grid-2 top-aligned-grid">
            <RequestAdvanceForm token={session.token} onSuccess={() => void load()} />
            <RequestHistory items={myRequests} />
          </div>
        )}
      </section>
    </main>
  );
}
