"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canApprove, canManageSettings, canManageUsers, canProcessPayroll, canViewAudit, canViewReports, canViewSystemHealth } from "../lib/roles";
import { LoginResponse } from "../lib/types";
import { Home, User, Clock, FileText, DollarSign, Activity, Calendar, Users, Folder, LogOut, CheckSquare } from "lucide-react";
import { clearSession } from "../lib/auth";

type AppMenuProps = {
  session: LoginResponse;
};

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  visible?: boolean;
};

export function AppMenu({ session }: AppMenuProps) {
  const pathname = usePathname();
  const items: MenuItem[] = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/timesheet", label: "Timesheet", icon: Clock, visible: false }, // Placeholder based on design
    { href: "/requests", label: "Requests", icon: FileText },
    { href: "/pending", label: "Approvals", icon: CheckSquare, visible: canApprove(session.role) },
    { href: "/payroll", label: "Payroll", icon: DollarSign, visible: canProcessPayroll(session.role, session.features) },
    { href: "/reports", label: "Performance", icon: Activity, visible: canViewReports(session.role, session.features) },
    { href: "/calendar", label: "Calendar", icon: Calendar, visible: false }, // Placeholder
    { href: "/users", label: "Directory", icon: Users, visible: canManageUsers(session.role, session.features) },
    { href: "/audit", label: "Documents", icon: Folder, visible: canViewAudit(session.role, session.features) },
    { href: "/settings", label: "Settings", icon: Activity, visible: canManageSettings(session.role, session.features) },
  ];

  return (
    <nav className="w-64 bg-[#f8fafc] border-r border-slate-200 h-screen sticky top-0 flex flex-col py-6" aria-label="Application pages">
      <div className="px-6 flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
          E
        </div>
        <span className="font-bold text-slate-800 text-lg">ESS Advance</span>
      </div>
      
      <div className="flex-1 flex flex-col gap-1 px-3">
        {items.filter((item) => item.visible !== false).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive 
                  ? "bg-slate-200/50 text-slate-900 before:absolute before:left-0 before:h-8 before:w-1 before:bg-red-600 before:rounded-r-full" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              href={item.href}
              key={item.href}
              style={{ position: 'relative' }}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-slate-800" : "text-slate-500"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-3 mt-auto">
        <button
          onClick={() => {
            clearSession();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors font-medium text-sm bg-transparent !text-slate-600"
        >
          <LogOut className="w-5 h-5 text-slate-500" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
