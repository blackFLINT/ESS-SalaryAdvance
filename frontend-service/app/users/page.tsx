"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clearSession, getSession } from "../../lib/auth";
import { createUser, getFeatures, getMyProfile, getUsers, updateUserAccess } from "../../lib/api";
import { FeatureAccess, ManagedUser, UserRole } from "../../lib/types";
import { AppMenu } from "../../components/AppMenu";
import { canManageUsers } from "../../lib/roles";
import { CreateUserInput, createUserSchema, UpdateAccessInput, updateAccessSchema } from "../../lib/validation";

const roleOptions: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "HR_PAYROLL"];

export default function UsersPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [features, setFeatures] = useState<FeatureAccess[]>([]);

  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    setValue: setCreateValue,
    watch: watchCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isCreating }
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "EMPLOYEE",
      features: []
    }
  });

  const {
    register: accessRegister,
    handleSubmit: handleAccessSubmit,
    setValue: setAccessValue,
    watch: watchAccess,
    formState: { errors: accessErrors, isSubmitting: isUpdating }
  } = useForm<UpdateAccessInput>({
    resolver: zodResolver(updateAccessSchema),
    defaultValues: {
      role: "EMPLOYEE",
      features: []
    }
  });

  const createFeatures = watchCreate("features") ?? [];
  const accessFeatures = watchAccess("features") ?? [];

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

  const selectedUser = useMemo(
    () => users.find((u) => String(u.id) === watchAccess("userId")),
    [users, watchAccess]
  );

  const roleFeatureMap = useMemo(() => {
    const map = new Map<UserRole, Set<FeatureAccess>>();
    roleOptions.forEach((role) => map.set(role, new Set<FeatureAccess>()));

    users.forEach((user) => {
      const bucket = map.get(user.role);
      if (!bucket) {
        return;
      }
      user.features.forEach((feature) => bucket.add(feature));
    });

    return map;
  }, [users]);

  const roleCounts = useMemo(() => {
    const map = new Map<UserRole, number>();
    roleOptions.forEach((role) => map.set(role, 0));
    users.forEach((user) => map.set(user.role, (map.get(user.role) ?? 0) + 1));
    return map;
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      setAccessValue("role", selectedUser.role);
      setAccessValue("features", selectedUser.features);
    }
  }, [selectedUser, setAccessValue]);

  const toggleListValue = (current: string[], value: string): string[] => {
    if (current.includes(value)) {
      return current.filter((x) => x !== value);
    }
    return [...current, value];
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
      resetCreate({ role: "EMPLOYEE", features: [] });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    }
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
      setSuccess("User role/features updated successfully.");
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <h1 className="title" style={{ marginBottom: 6 }}>User Management</h1>
            <p className="subtitle" style={{ margin: 0 }}>Create users, assign roles, and feature access.</p>
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
        {success && <p style={{ color: "#166534", margin: 0 }}>{success}</p>}

        {!loading && (
          <>
            <div className="grid-2">
              <section className="panel stack">
                <h2 style={{ margin: 0 }}>Add User</h2>
                <form className="stack" onSubmit={handleCreateSubmit(onCreate)}>
                  <input placeholder="Employee Number" {...createRegister("employeeNumber")} />
                  {createErrors.employeeNumber && <p className="error">{createErrors.employeeNumber.message}</p>}

                  <input placeholder="Full Name" {...createRegister("fullName")} />
                  {createErrors.fullName && <p className="error">{createErrors.fullName.message}</p>}

                  <input placeholder="Email" {...createRegister("email")} />
                  {createErrors.email && <p className="error">{createErrors.email.message}</p>}

                  <input type="password" placeholder="Temporary Password" {...createRegister("password")} />
                  {createErrors.password && <p className="error">{createErrors.password.message}</p>}

                  <input placeholder="Department" {...createRegister("department")} />
                  {createErrors.department && <p className="error">{createErrors.department.message}</p>}

                  <input placeholder="Job Title" {...createRegister("jobTitle")} />
                  <input placeholder="Branch / Location" {...createRegister("branchLocation")} />
                  <input placeholder="Manager" {...createRegister("managerName")} />
                  <input placeholder="Salary Band" {...createRegister("salaryBand")} />
                  <input placeholder="Max Advance Eligibility" {...createRegister("maxAdvanceEligibility")} />
                  {createErrors.maxAdvanceEligibility && <p className="error">{createErrors.maxAdvanceEligibility.message}</p>}

                  <input placeholder="Monthly Salary" {...createRegister("monthlySalary")} />
                  {createErrors.monthlySalary && <p className="error">{createErrors.monthlySalary.message}</p>}

                  <select {...createRegister("role")}>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>

                  <div className="stack" style={{ gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>Feature Access</p>
                    {features.map((feature) => (
                      <label key={feature} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={createFeatures.includes(feature)}
                          onChange={() => setCreateValue("features", toggleListValue(createFeatures, feature))}
                        />
                        {feature}
                      </label>
                    ))}
                    {createErrors.features && <p className="error">{createErrors.features.message as string}</p>}
                  </div>

                  <button type="submit" disabled={isCreating}>{isCreating ? "Creating..." : "Create User"}</button>
                </form>
              </section>

              <section className="panel stack">
                <h2 style={{ margin: 0 }}>Assign Role & Features</h2>
                <form className="stack" onSubmit={handleAccessSubmit(onUpdateAccess)}>
                  <select {...accessRegister("userId")}>
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
                    ))}
                  </select>
                  {accessErrors.userId && <p className="error">{accessErrors.userId.message}</p>}

                  <select {...accessRegister("role")}>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>

                  <div className="stack" style={{ gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>Feature Access</p>
                    {features.map((feature) => (
                      <label key={feature} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={accessFeatures.includes(feature)}
                          onChange={() => setAccessValue("features", toggleListValue(accessFeatures, feature))}
                        />
                        {feature}
                      </label>
                    ))}
                    {accessErrors.features && <p className="error">{accessErrors.features.message as string}</p>}
                  </div>

                  <button type="submit" disabled={isUpdating}>{isUpdating ? "Updating..." : "Update Access"}</button>
                </form>
              </section>
            </div>

            <section className="panel stack">
              <h2 style={{ margin: 0 }}>All Users</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Job Title</th>
                      <th>Role</th>
                      <th>Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td>{user.jobTitle || "-"}</td>
                        <td>{user.role}</td>
                        <td>{user.features.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel stack">
              <h2 style={{ margin: 0 }}>Role/Feature Matrix</h2>
              <p className="hint" style={{ margin: 0 }}>
                Features are shown by role based on current user assignments.
              </p>
              <div className="table-wrap">
                <table className="table matrix-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {roleOptions.map((role) => (
                        <th key={role}>
                          {role}
                          <div className="matrix-sub">Users: {roleCounts.get(role) ?? 0}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature}>
                        <td><strong>{feature}</strong></td>
                        {roleOptions.map((role) => {
                          const enabled = roleFeatureMap.get(role)?.has(feature) ?? false;
                          return (
                            <td key={`${feature}-${role}`}>
                              <span className={enabled ? "matrix-pill yes" : "matrix-pill no"}>
                                {enabled ? "YES" : "NO"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
