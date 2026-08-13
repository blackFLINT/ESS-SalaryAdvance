"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getAuditLogs, getMyProfile } from "../../lib/api";
import { AuditLogItem } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canViewAudit } from "../../lib/roles";

export default function AuditPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => setSession(getSession()), []);

  const load = useCallback(async () => {
    if (session === undefined) return;
    if (!session?.token) {
      router.push("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const profile = await getMyProfile(session.token);
      if (!canViewAudit(profile.role, profile.features)) {
        router.push("/dashboard");
        return;
      }
      setLogs(await getAuditLogs(session.token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load audit trail");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => { void load(); }, [load]);

  if (session === undefined || !session) return null;

  return (
    <main className="app-shell">
      <AppMenu session={session} />
      <section className="card stack">
        <div className="page-head">
          <div><h1 className="title">Audit Trail</h1><p className="subtitle">Financial workflow and access-control events.</p></div>
          <button type="button" className="secondary" onClick={() => { clearSession(); router.push("/"); }}>Sign Out</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && (
          <section className="panel stack">
            {logs.length === 0 ? <p className="empty-state">No audit events recorded yet.</p> : (
              <div className="table-wrap"><table className="table"><thead><tr><th>Time</th><th>Action</th><th>Actor</th><th>Entity</th><th>Details</th></tr></thead><tbody>
                {logs.map((log) => <tr key={log.id}><td>{new Date(log.occurredAt).toLocaleString()}</td><td>{log.action}</td><td>{log.actor}</td><td>{log.entityType} #{log.entityId ?? "-"}</td><td>{log.details}</td></tr>)}
              </tbody></table></div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}