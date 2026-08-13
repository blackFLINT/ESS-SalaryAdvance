"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canApprove, canManageSettings, canManageUsers, canProcessPayroll, canViewAudit, canViewReports, canViewSystemHealth } from "../lib/roles";
import { LoginResponse } from "../lib/types";

type AppMenuProps = {
  session: LoginResponse;
};

type MenuItem = {
  href: string;
  label: string;
  visible?: boolean;
};

export function AppMenu({ session }: AppMenuProps) {
  const pathname = usePathname();
  const items: MenuItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/requests", label: "Requests" },
    { href: "/pending", label: "Approvals", visible: canApprove(session.role) },
    { href: "/users", label: "Users", visible: canManageUsers(session.role, session.features) },
    { href: "/payroll", label: "Payroll", visible: canProcessPayroll(session.role, session.features) },
    { href: "/reports", label: "Reports", visible: canViewReports(session.role, session.features) },
    { href: "/audit", label: "Audit", visible: canViewAudit(session.role, session.features) },
    { href: "/settings", label: "Settings", visible: canManageSettings(session.role, session.features) },
    { href: "/health", label: "Health", visible: canViewSystemHealth(session.role, session.features) },
    { href: "/security", label: "Security" }
  ];

  return (
    <nav className="app-menu" aria-label="Application pages">
      <div className="app-menu-title">ESS Salary Advance</div>
      <div className="app-menu-links">
        {items.filter((item) => item.visible !== false).map((item) => (
          <Link
            aria-current={pathname === item.href ? "page" : undefined}
            className={pathname === item.href ? "app-menu-link active" : "app-menu-link"}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
