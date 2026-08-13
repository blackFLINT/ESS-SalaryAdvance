"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { exportReportCsv, getMonthlyReport, getMyProfile } from "../../lib/api";
import { ReportSummary } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canViewReports } from "../../lib/roles";

export default function ReportsPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ReportSummary | null>(null);

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
      if (!canViewReports(profile.role, profile.features)) {
        router.push("/dashboard");
        return;
      }
      setReport(await getMonthlyReport(session.token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => { void load(); }, [load]);

  const download = async (status: "APPROVED" | "PROCESSED") => {
    if (!session?.token) return;
    const csv = await exportReportCsv(session.token, status);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${status.toLowerCase()}-advances.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (session === undefined || !session) return null;

  return (
    <main className="app-shell">
      <AppMenu session={session} />
      <section className="card stack">
        <div className="page-head"><div><h1 className="title">Reports & Exports</h1><p className="subtitle">Monthly salary advance report, status totals, and payroll exports.</p></div><button type="button" className="secondary" onClick={() => { clearSession(); router.push("/"); }}>Sign Out</button></div>
        <div className="dashboard-actions"><button type="button" onClick={() => void download("APPROVED")}>Export Approved CSV</button><button type="button" onClick={() => void download("PROCESSED")}>Export Processed CSV</button></div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && report && (
          <>
            <div className="stats-grid"><section className="panel stat-card"><p className="stat-label">Requests</p><p className="stat-value">{report.totalRequests}</p></section><section className="panel stat-card"><p className="stat-label">Total Amount</p><p className="stat-value">{report.totalAmount}</p></section><section className="panel stat-card"><p className="stat-label">Processed Amount</p><p className="stat-value">{report.processedAmount}</p></section></div>
            <div className="grid-2"><section className="panel stack"><h2 style={{ margin: 0 }}>Requests By Status</h2>{Object.entries(report.requestsByStatus).map(([key, value]) => <p key={key} style={{ margin: 0 }}><strong>{key}:</strong> {value}</p>)}</section><section className="panel stack"><h2 style={{ margin: 0 }}>Requests By Department</h2>{Object.entries(report.requestsByDepartment).map(([key, value]) => <p key={key} style={{ margin: 0 }}><strong>{key}:</strong> {value}</p>)}</section></div>
          </>
        )}
      </section>
    </main>
  );
}