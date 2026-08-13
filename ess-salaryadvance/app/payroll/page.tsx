"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { exportReportCsv, getApprovedAdvances, getMyProfile, processAdvanceWithPlan } from "../../lib/api";
import { AdvanceRequest, EmployeeProfile } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canProcessPayroll } from "../../lib/roles";

export default function PayrollPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [approved, setApproved] = useState<AdvanceRequest[]>([]);
  const [installments, setInstallments] = useState(3);
  const [comment, setComment] = useState("Processed by payroll");

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
      if (!canProcessPayroll(session.role, session.features) || !canProcessPayroll(p.role, p.features)) {
        router.push("/dashboard");
        return;
      }
      const queue = await getApprovedAdvances(session.token);
      setApproved(queue);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payroll processing queue");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => {
    void load();
  }, [load]);

  const processItem = async (id: number) => {
    if (!session?.token) {
      return;
    }
    setError("");
    if (!window.confirm(`Mark request #${id} as processed and create repayment schedule?`)) {
      return;
    }
    try {
      await processAdvanceWithPlan(session.token, id, installments, comment);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process advance");
    }
  };

  const exportApproved = async () => {
    if (!session?.token) {
      return;
    }
    try {
      const csv = await exportReportCsv(session.token, "APPROVED");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "approved-advances.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  };

  if (session === undefined || !session) {
    return null;
  }

  const header = (
    <div className="page-head">
      <div>
        <h1 className="title">Payroll Processing</h1>
        <p className="subtitle">
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
  );

  return (
    <main className="app-shell">
      <AppMenu session={session} />
      <section className="card stack">
        {header}

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && (
          <section className="panel stack">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Approved Advances Awaiting Payroll</h2>
              <button type="button" className="secondary" onClick={exportApproved}>Export Queue</button>
            </div>
            <div className="grid-2 top-aligned-grid">
              <div>
                <label htmlFor="installments">Repayment Installments</label>
                <input id="installments" value={installments} onChange={(e) => setInstallments(Number(e.target.value))} />
              </div>
              <div>
                <label htmlFor="payroll-comment">Payroll Comment</label>
                <input id="payroll-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
            </div>
            {approved.length === 0 ? (
              <p className="empty-state">No approved advances pending payroll processing.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Employee</th>
                      <th>Amount</th>
                      <th>Reason</th>
                      <th>Approved Comment</th>
                      <th>Repayment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.employeeName}</td>
                        <td>{item.amount}</td>
                        <td>{item.reason}</td>
                        <td>{item.approverComment || "-"}</td>
                        <td>{installments} installments</td>
                        <td>
                          <button type="button" onClick={() => processItem(item.id)}>Mark Processed</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
