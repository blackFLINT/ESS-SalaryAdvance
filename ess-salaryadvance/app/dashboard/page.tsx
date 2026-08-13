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
      
      <div className="main-content">
        <header className="page-header">
          <h1 className="page-header-title">Employee Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 bg-transparent" title="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 bg-transparent" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 bg-transparent" title="Help">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 bg-transparent" title="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </header>

        {loading && <p className="text-slate-500">Loading your workspace...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}
        {dashboardNotice && <p className="text-slate-500 text-sm mb-4">{dashboardNotice}</p>}

        {!loading && profile && (
          <div className="bento-grid">
            
            {/* LEFT COLUMN: Profile & Advance Management */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              
              {/* Profile Card */}
              <div className="bento-card flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-4 relative">
                  <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500 font-bold bg-gradient-to-br from-slate-100 to-slate-300">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800">{profile.fullName}</h2>
                <p className="text-sm text-slate-500 mb-6">{profile.jobTitle || profile.role}</p>
                
                <div className="flex w-full border-b border-slate-200 mb-4">
                  <button className="flex-1 pb-2 border-b-2 border-red-600 text-red-600 font-medium text-xs bg-transparent">Employee Profile</button>
                  <button className="flex-1 pb-2 text-slate-400 font-medium text-xs bg-transparent hover:text-slate-600">Contact Info</button>
                </div>
                
                <div className="w-full flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Department</p>
                      <p className="text-sm font-medium text-slate-800">{profile.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Manager</p>
                      <p className="text-sm font-medium text-slate-800">{profile.managerName || "None"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm font-medium text-slate-800">{profile.branchLocation || "HQ"}</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-white border border-slate-200 text-red-600 rounded-lg py-2 text-sm font-semibold hover:bg-slate-50">
                  View Profile
                </button>
              </div>
              
              {/* Advance Management */}
              <div className="bento-card">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                  <h3 className="font-bold text-slate-800">Salary Advances</h3>
                </div>
                
                <div className="flex flex-col gap-4 relative">
                  {/* Line connection */}
                  <div className="absolute left-[20px] top-4 bottom-14 w-px bg-slate-200"></div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 py-1 bg-slate-100 text-slate-800 rounded text-center text-sm font-bold border border-slate-200">{pendingMine}</div>
                    <span className="text-sm font-medium text-slate-700">Pending Requests</span>
                  </div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 py-1 bg-blue-50 text-blue-600 rounded text-center text-sm font-bold border border-blue-100">{profile.maxAdvanceEligibility}</div>
                    <span className="text-sm font-medium text-slate-700">Max Limit</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pl-6 relative z-10">
                    <div className="w-8 py-1 bg-blue-50 text-blue-600 rounded text-center text-xs font-bold border border-blue-100">{activeRepayment ? activeRepayment.remainingBalance : 0}</div>
                    <span className="text-xs font-medium text-slate-600">Active Balance</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pl-6 relative z-10">
                    <div className="w-8 py-1 bg-blue-50 text-blue-600 rounded text-center text-xs font-bold border border-blue-100">{approvedMine}</div>
                    <span className="text-xs font-medium text-slate-600">Total Approved</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-white border border-red-200 text-red-600 rounded-lg py-2 text-sm font-semibold hover:bg-red-50" onClick={() => router.push('/requests')}>
                  Request Advance
                </button>
              </div>

            </div>
            
            {/* MIDDLE COLUMN: Current State, Announcements, Quick Links */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              
              {/* Top status */}
              <div className="bento-card flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Repayment Status</p>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {activeRepayment ? "Active Deductions" : "All Clear"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeRepayment ? `${activeRepayment.monthlyDeductionAmount} deducted per month` : "No active repayment plans."}
                  </p>
                </div>
                <button className={`px-4 py-2 rounded-lg font-semibold text-sm ${activeRepayment ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                  {activeRepayment ? "View Plan" : "Request"}
                </button>
              </div>
              
              {/* Announcements */}
              <div className="bento-card flex-1">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M11.69 5c3.08-1.57 6-1.07 8.31.25M8.47 7.7C6.04 9.17 4.14 11.58 3.5 15c-1 5 1 6 1 6"/><path d="M11 21c-2-1.78-2-3.8-2-5.74M21 9c-1 5-4.43 7.85-8 9"/></svg>
                  <h3 className="font-bold text-slate-800">Announcements</h3>
                </div>
                
                <div className="flex flex-col gap-5">
                  {notifications.length > 0 ? notifications.slice(0, 4).map(notice => (
                    <div key={notice.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-slate-800">{notice.title}</h4>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-blue-600">System</p>
                          <p className="text-[10px] text-slate-400">Today</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 pr-12">{notice.message}</p>
                    </div>
                  )) : (
                    <>
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-800">Quarterly reviews begin next week.</h4>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-blue-600">Management</p>
                            <p className="text-[10px] text-slate-400">10 June</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 pr-12">Please check your calendar for your scheduled time slot.</p>
                      </div>
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-800">Scheduled system maintenance</h4>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-blue-600">IT Admin</p>
                            <p className="text-[10px] text-slate-400">09 June</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 pr-12">Saturday, 7-9 PM. Access may be limited during this window.</p>
                      </div>
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-800">New advance policies are now live.</h4>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-blue-600">HR</p>
                            <p className="text-[10px] text-slate-400">08 June</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 pr-12">Please send by 5 PM Thursday to review updates. Thank you.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Media/Gallery (Placeholder from screenshot) */}
              <div className="bento-card">
                 <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  <h3 className="font-bold text-slate-800">Recent Documents</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 relative">
                  <button className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm z-10">&larr;</button>
                  <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm z-10">&rarr;</button>
                  
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 text-xs font-medium">Policy.pdf</div>
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 text-xs font-medium">Payslip.pdf</div>
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 text-xs font-medium">Contract.pdf</div>
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 text-xs font-medium">Terms.pdf</div>
                </div>
              </div>

            </div>
            
            {/* RIGHT COLUMN: Calendar & Upcoming Events */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              
              <div className="bento-card">
                 <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <h3 className="font-bold text-slate-800">Calendar</h3>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <button className="text-slate-400 hover:text-slate-700 bg-transparent">&lt;</button>
                  <span className="font-bold text-sm text-slate-800">June 2026</span>
                  <button className="text-slate-400 hover:text-slate-700 bg-transparent">&gt;</button>
                </div>
                
                <div className="grid grid-cols-7 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <span key={day} className="text-[10px] font-semibold text-slate-400">{day}</span>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-medium text-slate-700">
                  <div className="py-1">1</div><div className="py-1">2</div><div className="py-1">3</div><div className="py-1">4</div><div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div>
                  <div className="py-1">8</div><div className="py-1">9</div><div className="py-1">10</div><div className="py-1">11</div><div className="py-1">12</div><div className="py-1 bg-red-600 text-white rounded text-center">13</div><div className="py-1">14</div>
                  <div className="py-1">15</div><div className="py-1">16</div><div className="py-1 bg-red-50 text-red-600 rounded">17</div><div className="py-1">18</div><div className="py-1 bg-red-50 text-red-600 rounded">19</div><div className="py-1">20</div><div className="py-1">21</div>
                  <div className="py-1">22</div><div className="py-1 bg-red-50 text-red-600 rounded">23</div><div className="py-1 bg-red-100 text-red-600 rounded">24</div><div className="py-1">25</div><div className="py-1">26</div><div className="py-1 bg-red-50 text-red-600 rounded">27</div><div className="py-1">28</div>
                  <div className="py-1">29</div><div className="py-1 bg-red-50 text-red-600 rounded">30</div><div className="py-1">31</div>
                </div>
              </div>
              
              <div className="bento-card flex-1">
                 <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                  <h3 className="font-bold text-slate-800">Upcoming Deductions</h3>
                </div>
                
                <div className="flex flex-col gap-4">
                  {myRequests.filter(r => r.repaymentStatus === "ACTIVE").map(r => (
                    <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll Deduction</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-800">Monthly Repayment</h4>
                        <span className="text-xs font-medium text-slate-700">End of Month</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Update</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-800">Interest Rates Review</h4>
                      <span className="text-xs font-medium text-slate-700">17 June</span>
                    </div>
                  </div>
                  
                  <div className="border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-800">Company Town Hall</h4>
                      <span className="text-xs font-medium text-slate-700">27 June</span>
                    </div>
                  </div>
                </div>
                
              </div>

            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}
