"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clearSession, getSession } from "../../../lib/auth";
import { createUser, getFeatures, getMyProfile } from "../../../lib/api";
import { FeatureAccess, UserRole } from "../../../lib/types";
import { AppMenu } from "../../../components/AppMenu";
import { canManageUsers } from "../../../lib/roles";
import { CreateUserInput, createUserSchema } from "../../../lib/validation";

const roleOptions: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "HR_PAYROLL"];

export default function NewUserPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [features, setFeatures] = useState<FeatureAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "EMPLOYEE",
      features: []
    }
  });

  const selectedFeatures = watch("features") ?? [];

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
      const profile = await getMyProfile(session.token);
      if (!canManageUsers(session.role, session.features) || !canManageUsers(profile.role, profile.features)) {
        router.push("/dashboard");
        return;
      }
      const allFeatures = await getFeatures(session.token);
      setFeatures(allFeatures as FeatureAccess[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load new user form");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleFeature = (value: FeatureAccess) => {
    if (selectedFeatures.includes(value)) {
      setValue("features", selectedFeatures.filter((feature) => feature !== value));
      return;
    }
    setValue("features", [...selectedFeatures, value]);
  };

  const onCreate = async (values: CreateUserInput) => {
    if (!session?.token) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      await createUser(session.token, {
        employeeNumber: values.employeeNumber,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        department: values.department,
        monthlySalary: Number(values.monthlySalary),
        jobTitle: values.jobTitle,
        branchLocation: values.branchLocation,
        managerName: values.managerName,
        salaryBand: values.salaryBand,
        maxAdvanceEligibility: values.maxAdvanceEligibility ? Number(values.maxAdvanceEligibility) : undefined,
        role: values.role,
        features: values.features as FeatureAccess[]
      });
      setSuccess("User created successfully.");
      reset({ role: "EMPLOYEE", features: [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    }
  };

  if (session === undefined || !session) {
    return null;
  }

  return (
    <main className="app-shell">
      <AppMenu session={session} />
      <section className="card stack">
        <div className="page-head">
          <div>
            <h1 className="title">Add User</h1>
            <p className="subtitle">Create an employee profile, assign a role, then select feature access.</p>
          </div>
          <div className="dashboard-actions">
            <Link className="nav-link" href="/users">Back To Users</Link>
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
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {!loading && (
          <form className="stack" onSubmit={handleSubmit(onCreate)}>
            <section className="panel stack">
              <h2 style={{ margin: 0 }}>Employee Details</h2>
              <div className="form-grid">
                <label>Employee Number<input placeholder="EMP-001" {...register("employeeNumber")} /></label>
                <label>Full Name<input placeholder="Full name" {...register("fullName")} /></label>
                <label>Email<input placeholder="user@ess.local" {...register("email")} /></label>
                <label>Temporary Password<input type="password" placeholder="Temporary password" {...register("password")} /></label>
                <label>Department<input placeholder="Department" {...register("department")} /></label>
                <label>Job Title<input placeholder="Job title" {...register("jobTitle")} /></label>
                <label>Branch / Location<input placeholder="Branch or location" {...register("branchLocation")} /></label>
                <label>Manager<input placeholder="Manager name" {...register("managerName")} /></label>
                <label>Salary Band<input placeholder="Salary band" {...register("salaryBand")} /></label>
                <label>Max Advance Eligibility<input placeholder="0.00" {...register("maxAdvanceEligibility")} /></label>
                <label>Monthly Salary<input placeholder="0.00" {...register("monthlySalary")} /></label>
                <label>
                  Role
                  <select {...register("role")}>
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>
              </div>
              <div className="form-errors">
                {Object.entries(errors).filter(([key]) => key !== "features").map(([key, value]) => (
                  <p className="error" key={key}>{value?.message as string}</p>
                ))}
              </div>
            </section>

            <section className="panel stack">
              <div>
                <h2 style={{ margin: 0 }}>Feature Access</h2>
                <p className="hint" style={{ margin: "4px 0 0" }}>Select the pages and capabilities this user should be able to access.</p>
              </div>
              <div className="feature-check-grid spacious">
                {features.map((feature) => (
                  <label className="check-card" key={feature}>
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
              {errors.features && <p className="error">{errors.features.message as string}</p>}
            </section>

            <div className="modal-actions">
              <Link className="nav-link" href="/users">Cancel</Link>
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create User"}</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
