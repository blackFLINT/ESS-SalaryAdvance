"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "../../lib/api";
import { clearSession, getSession } from "../../lib/auth";
import { AppMenu } from "../../components/AppMenu";
import { PasswordChangeInput, passwordChangeSchema } from "../../lib/validation";

export default function SecurityPage() {
  const router = useRouter();
  const session = getSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordChangeInput>({ resolver: zodResolver(passwordChangeSchema) });

  if (!session) return null;

  const onSubmit = async (values: PasswordChangeInput) => {
    setError("");
    setSuccess("");
    try {
      await changePassword(session.token, values.currentPassword, values.newPassword);
      setSuccess("Password changed successfully.");
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to change password");
    }
  };

  return (<main className="app-shell"><AppMenu session={session} /><section className="card stack"><div className="page-head"><div><h1 className="title">Security</h1><p className="subtitle">Password policy, account lockout, JWT refresh tokens, and 2FA readiness.</p></div><button type="button" className="secondary" onClick={() => { clearSession(); router.push("/"); }}>Sign Out</button></div><div className="grid-2 top-aligned-grid"><section className="panel stack"><h2 style={{ margin: 0 }}>Change Password</h2><form className="stack" onSubmit={handleSubmit(onSubmit)}><label>Current Password<input type="password" {...register("currentPassword")} /></label>{errors.currentPassword && <p className="error">{errors.currentPassword.message}</p>}<label>New Password<input type="password" {...register("newPassword")} /></label>{errors.newPassword && <p className="error">{errors.newPassword.message}</p>}{error && <p className="error">{error}</p>}{success && <p className="success">{success}</p>}<button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Change Password"}</button></form></section><section className="panel stack"><h2 style={{ margin: 0 }}>Corporate Security Controls</h2><p style={{ margin: 0 }}><strong>Password policy:</strong> upper, lower, number, symbol, 8-64 characters.</p><p style={{ margin: 0 }}><strong>Account lockout:</strong> 5 failed attempts locks account for 15 minutes.</p><p style={{ margin: 0 }}><strong>JWT refresh:</strong> login issues access and refresh tokens with rotation.</p><p style={{ margin: 0 }}><strong>2FA:</strong> profile field is ready for optional future rollout.</p></section></div></section></main>);
}