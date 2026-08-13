"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMonthlyReport, getMyAdvances, getMyProfile, getNotifications, getPendingAdvances } from "../../lib/api";
import { AdvanceRequest, EmployeeProfile, NotificationItem, ReportSummary } from "../../lib/types";
import { DashboardCharts } from "../../components/DashboardCharts";
import { AppMenu } from "../../components/AppMenu";
import { canApprove, canViewReports } from "../../lib/roles";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [myRequests, setMyRequests] = useState<AdvanceRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [dashboardNotice, setDashboardNotice] = useState("");
  const [showCompensation, setShowCompensation] = useState(false);

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
    setDashboardNotice("");
    try {
      const [p, mine] = await Promise.all([getMyProfile(session.token), getMyAdvances(session.token)]);
      setProfile(p);
      setMyRequests(mine);
      setPendingCount(0);
      setNotifications([]);
      setReport(null);

      const optionalLoads: Promise<void>[] = [];
      if (canApprove(session.role) && canApprove(p.role)) {
        optionalLoads.push(getPendingAdvances(session.token).then((queue) => setPendingCount(queue.length)));
      }
      if ((p.features ?? []).includes("NOTIFICATIONS_VIEW")) {
        optionalLoads.push(getNotifications(session.token).then(setNotifications));
      }
      if (canViewReports(p.role, p.features)) {
        optionalLoads.push(getMonthlyReport(session.token).then(setReport));
      }

      const results = await Promise.allSettled(optionalLoads);
      if (results.some((result) => result.status === "rejected")) {
        setDashboardNotice("Some dashboard widgets could not be loaded. Core profile and request data are available.");
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

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return null;
  }

  const pendingMine = myRequests.filter((x) => x.status === "PENDING").length;
  const approvedMine = myRequests.filter((x) => x.status === "APPROVED").length;
  const rejectedMine = myRequests.filter((x) => x.status === "REJECTED").length;
  const processedMine = myRequests.filter((x) => x.status === "PROCESSED").length;
  const activeRepayment = myRequests.find((x) => x.repaymentStatus === "ACTIVE");

  return (
    <main className="app-shell">
      <AppMenu session={session} />
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
        {dashboardNotice && <p className="hint">{dashboardNotice}</p>}

        {!loading && profile && (
          <>
            <div className="stats-grid">
              <section className="panel stat-card">
                <p className="stat-label">My Total Requests</p>
                <p className="stat-value">{myRequests.length}</p>
              </section>
              <section className="panel stat-card">
                <p className="stat-label">My Pending</p>
                <p className="stat-value">{pendingMine}</p>
              </section>
              <section className="panel stat-card">
                <p className="stat-label">My Approved</p>
                <p className="stat-value">{approvedMine}</p>
              </section>
              <section className="panel stat-card">
                <p className="stat-label">My Rejected</p>
                <p className="stat-value">{rejectedMine}</p>
              </section>
              <section className="panel stat-card">
                <p className="stat-label">My Processed</p>
                <p className="stat-value">{processedMine}</p>
              </section>
              {canApprove(session.role) && canApprove(profile.role) && (
                <section className="panel stat-card accent">
                  <p className="stat-label">Team Pending Queue</p>
                  <p className="stat-value">{pendingCount}</p>
                </section>
              )}
            </div>

            <div className="grid-2">
              <section className="panel stack">
                <div className="section-head">
                  <h2 style={{ margin: 0 }}>My Profile</h2>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={showCompensation ? "Hide salary and limit" : "Show salary and limit"}
                    title={showCompensation ? "Hide salary and limit" : "Show salary and limit"}
                    onClick={() => setShowCompensation((value) => !value)}
                  >
                    {showCompensation ? "Hide" : "View"}
                  </button>
                </div>
                <p style={{ margin: 0 }}><strong>Employee No:</strong> {profile.employeeNumber}</p>
                <p style={{ margin: 0 }}><strong>Department:</strong> {profile.department}</p>
                <p style={{ margin: 0 }}><strong>Job Title:</strong> {profile.jobTitle || "-"}</p>
                <p style={{ margin: 0 }}><strong>Branch:</strong> {profile.branchLocation || "-"}</p>
                <p style={{ margin: 0 }}><strong>Manager:</strong> {profile.managerName || "-"}</p>
                <p style={{ margin: 0 }}><strong>Salary Band:</strong> {profile.salaryBand || "-"}</p>
                <p style={{ margin: 0 }}><strong>Monthly Salary:</strong> <span className={showCompensation ? undefined : "masked-value"}>{showCompensation ? profile.monthlySalary : "••••••"}</span></p>
                <p style={{ margin: 0 }}><strong>Max Advance Eligibility:</strong> <span className={showCompensation ? undefined : "masked-value"}>{showCompensation ? profile.maxAdvanceEligibility ?? "-" : "••••••"}</span></p>
                <p style={{ margin: 0 }}><strong>Role:</strong> {profile.role}</p>
              </section>

              <DashboardCharts items={myRequests} />
            </div>

            <div className="grid-2">
              <section className="panel stack">
                <h2 style={{ margin: 0 }}>Repayment Summary</h2>
                {activeRepayment ? (
                  <>
                    <p style={{ margin: 0 }}><strong>Amount Advanced:</strong> {activeRepayment.amount}</p>
                    <p style={{ margin: 0 }}><strong>Installments:</strong> {activeRepayment.repaymentInstallments}</p>
                    <p style={{ margin: 0 }}><strong>Monthly Deduction:</strong> {activeRepayment.monthlyDeductionAmount}</p>
                    <p style={{ margin: 0 }}><strong>Remaining Balance:</strong> {activeRepayment.remainingBalance}</p>
                    <span className="badge processed">{activeRepayment.repaymentStatus}</span>
                  </>
                ) : (
                  <p className="hint">No active repayment plan right now.</p>
                )}
              </section>

              <section className="panel stack">
                <h2 style={{ margin: 0 }}>Notifications</h2>
                {notifications.length === 0 ? (
                  <p className="hint">No notifications yet.</p>
                ) : notifications.slice(0, 4).map((item) => (
                  <div className="notice" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.message}</span>
                  </div>
                ))}
              </section>
            </div>

            {report && (
              <section className="panel stack">
                <h2 style={{ margin: 0 }}>This Month At A Glance</h2>
                <div className="stats-grid">
                  <section className="stat-card"><p className="stat-label">Requests</p><p className="stat-value">{report.totalRequests}</p></section>
                  <section className="stat-card"><p className="stat-label">Total Amount</p><p className="stat-value">{report.totalAmount}</p></section>
                  <section className="stat-card"><p className="stat-label">Processed</p><p className="stat-value">{report.processedAmount}</p></section>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
