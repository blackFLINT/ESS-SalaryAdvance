"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "../../lib/auth";
import { getMyProfile, getSettings, updateSettings } from "../../lib/api";
import { CorporateSettings } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canManageSettings } from "../../lib/roles";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [settings, setSettings] = useState<CorporateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      if (!canManageSettings(profile.role, profile.features)) {
        router.push("/dashboard");
        return;
      }
      setSettings(await getSettings(session.token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    if (!session?.token || !settings) return;
    setError("");
    setSuccess("");
    try {
      setSettings(await updateSettings(session.token, settings));
      setSuccess("Corporate settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    }
  };

  if (session === undefined || !session) return null;

  return (
    <main className="app-shell"><AppMenu session={session} /><section className="card stack"><div className="page-head"><div><h1 className="title">Corporate Settings</h1><p className="subtitle">Configure company branding, eligibility, currency, and approval thresholds.</p></div><button type="button" className="secondary" onClick={() => { clearSession(); router.push("/"); }}>Sign Out</button></div>{loading && <p>Loading...</p>}{error && <p className="error">{error}</p>}{success && <p className="success">{success}</p>}{!loading && settings && (<section className="panel stack"><div className="grid-2 top-aligned-grid"><label>Company Name<input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} /></label><label>Logo URL<input value={settings.logoUrl ?? ""} onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} /></label><label>Maximum Advance %<input value={settings.maximumAdvancePercentage} onChange={(e) => setSettings({ ...settings, maximumAdvancePercentage: Number(e.target.value) })} /></label><label>Minimum Employment Months<input value={settings.minimumEmploymentMonths} onChange={(e) => setSettings({ ...settings, minimumEmploymentMonths: Number(e.target.value) })} /></label><label>Allowed Repayment Periods<input value={settings.allowedRepaymentPeriods} onChange={(e) => setSettings({ ...settings, allowedRepaymentPeriods: Number(e.target.value) })} /></label><label>Currency<input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })} /></label><label>Manager Approval Threshold<input value={settings.managerApprovalThreshold} onChange={(e) => setSettings({ ...settings, managerApprovalThreshold: Number(e.target.value) })} /></label><label>Finance Approval Threshold<input value={settings.financeApprovalThreshold} onChange={(e) => setSettings({ ...settings, financeApprovalThreshold: Number(e.target.value) })} /></label></div><button type="button" onClick={() => void save()}>Save Settings</button></section>)}</section></main>
  );
}