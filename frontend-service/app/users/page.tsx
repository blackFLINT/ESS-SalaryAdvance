"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clearSession, getSession } from "../../lib/auth";
import { getFeatures, getMyProfile, getUsers, updateUserAccess } from "../../lib/api";
import { FeatureAccess, ManagedUser, UserRole } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canManageUsers } from "../../lib/roles";
import { UpdateAccessInput, updateAccessSchema } from "../../lib/validation";

const roleOptions: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "HR_PAYROLL"];

export default function UsersPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [features, setFeatures] = useState<FeatureAccess[]>([]);
  const [viewUser, setViewUser] = useState<ManagedUser | null>(null);
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UpdateAccessInput>({
    resolver: zodResolver(updateAccessSchema),
    defaultValues: {
      userId: "",
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

      const [allUsers, allFeatures] = await Promise.all([getUsers(session.token), getFeatures(session.token)]);
      setUsers(allUsers);
      setFeatures(allFeatures as FeatureAccess[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load user management");
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!editUser) {
      reset({ userId: "", role: "EMPLOYEE", features: [] });
      return;
    }

    reset({
      userId: String(editUser.id),
      role: editUser.role,
      features: editUser.features
    });
  }, [editUser, reset]);

  const roleCounts = useMemo(() => {
    const map = new Map<UserRole, number>();
    roleOptions.forEach((role) => map.set(role, 0));
    users.forEach((user) => map.set(user.role, (map.get(user.role) ?? 0) + 1));
    return map;
  }, [users]);

  const toggleFeature = (value: FeatureAccess) => {
    if (selectedFeatures.includes(value)) {
      setValue("features", selectedFeatures.filter((feature) => feature !== value));
      return;
    }
    setValue("features", [...selectedFeatures, value]);
  };

  const closeModal = () => {
    setViewUser(null);
    setEditUser(null);
  };

  const onUpdateAccess = async (values: UpdateAccessInput) => {
    if (!session?.token) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      await updateUserAccess(session.token, Number(values.userId), {
        role: values.role,
        features: values.features as FeatureAccess[]
      });
      setSuccess("User access updated successfully.");
      closeModal();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update user access");
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
            <h1 className="title">User Management</h1>
            <p className="subtitle">Browse users, inspect profiles, and manage role-based access.</p>
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
        {success && <p className="success">{success}</p>}

        {!loading && (
          <>
            <div className="user-list-toolbar">
              <div className="stats-grid compact-stats">
                <section className="panel stat-card">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{users.length}</p>
                </section>
                {roleOptions.map((role) => (
                  <section className="panel stat-card" key={role}>
                    <p className="stat-label">{role}</p>
                    <p className="stat-value">{roleCounts.get(role) ?? 0}</p>
                  </section>
                ))}
              </div>
              <Link className="button-link" href="/users/new">Add New User</Link>
            </div>

            <section className="panel stack">
              <div className="page-head">
                <div>
                  <h2 style={{ margin: 0 }}>Users</h2>
                  <p className="hint" style={{ margin: "4px 0 0" }}>Use View for profile details or Edit to update role and feature access.</p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Features</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td><strong>{user.fullName}</strong><div className="matrix-sub">{user.employeeNumber}</div></td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td><span className="badge processed">{user.role}</span></td>
                        <td>{user.features.length}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="secondary" onClick={() => setViewUser(user)}>View</button>
                            <button type="button" onClick={() => setEditUser(user)}>Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>

      {viewUser && (
        <dialog className="modal-backdrop" open aria-labelledby="view-user-title">
          <section className="modal stack">
            <div className="page-head">
              <div>
                <h2 id="view-user-title" style={{ margin: 0 }}>{viewUser.fullName}</h2>
                <p className="subtitle">{viewUser.email}</p>
              </div>
              <button type="button" className="secondary" onClick={closeModal}>Close</button>
            </div>
            <div className="detail-grid">
              <p><strong>Employee No:</strong> {viewUser.employeeNumber}</p>
              <p><strong>Department:</strong> {viewUser.department}</p>
              <p><strong>Job Title:</strong> {viewUser.jobTitle || "-"}</p>
              <p><strong>Branch:</strong> {viewUser.branchLocation || "-"}</p>
              <p><strong>Manager:</strong> {viewUser.managerName || "-"}</p>
              <p><strong>Salary Band:</strong> {viewUser.salaryBand || "-"}</p>
              <p><strong>Monthly Salary:</strong> {viewUser.monthlySalary}</p>
              <p><strong>Max Advance:</strong> {viewUser.maxAdvanceEligibility ?? "-"}</p>
              <p><strong>Role:</strong> {viewUser.role}</p>
            </div>
            <div className="feature-pill-list">
              {viewUser.features.map((feature) => <span className="badge" key={feature}>{feature}</span>)}
            </div>
          </section>
        </dialog>
      )}

      {editUser && (
        <dialog className="modal-backdrop" open aria-labelledby="edit-user-title">
          <section className="modal stack">
            <div className="page-head">
              <div>
                <h2 id="edit-user-title" style={{ margin: 0 }}>Edit Access</h2>
                <p className="subtitle">{editUser.fullName} ({editUser.email})</p>
              </div>
              <button type="button" className="secondary" onClick={closeModal}>Close</button>
            </div>
            <form className="stack" onSubmit={handleSubmit(onUpdateAccess)}>
              <input type="hidden" {...register("userId")} />
              <div className="field-stack">
                <label htmlFor="edit-user-role">Role</label>
                <select id="edit-user-role" {...register("role")}>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Feature Access</p>
                <div className="feature-check-grid">
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
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </section>
        </dialog>
      )}
    </main>
  );
}
