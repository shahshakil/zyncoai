"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApi } from "@/lib/useApi";
import {
  LayoutDashboard, Building2, PhoneCall, DollarSign, HeartPulse, ScrollText,
  Settings, LogOut, ChevronsLeft, ChevronsRight, ShieldCheck, Megaphone,
  Wallet, Receipt, Calculator, Server, Brain, ShieldAlert, LockKeyhole, Bell, Users, Globe, FileWarning,
} from "lucide-react";

const NAV = [
  { href: "/platform-admin", label: "Command Centre", icon: LayoutDashboard, color: "#6366F1" },
  { href: "/platform-admin/website-analytics", label: "Website Analytics", icon: Globe, color: "#0EA5E9" },
  { href: "/platform-admin/businesses", label: "Businesses", icon: Building2, color: "#3B82F6" },
  { href: "/platform-admin/tenants", label: "Tenant & Staff Registry", icon: Users, color: "#3B82F6" },
  { href: "/platform-admin/calls", label: "Calls Analytics", icon: PhoneCall, color: "#10B981" },
  { href: "/platform-admin/revenue", label: "Revenue & Profit", icon: DollarSign, color: "#F59E0B" },
  { href: "/platform-admin/costs", label: "Cost Tracking", icon: Wallet, color: "#F97316" },
  { href: "/platform-admin/invoices", label: "Invoices", icon: Receipt, color: "#14B8A6" },
  { href: "/platform-admin/tax", label: "Tax & BAS", icon: Calculator, color: "#0EA5E9" },
  { href: "/platform-admin/health", label: "System Health", icon: HeartPulse, color: "#EF4444" },
  { href: "/platform-admin/audit", label: "Audit Log", icon: ScrollText, color: "#6B7280" },
  { href: "/platform-admin/notifications", label: "Notifications", icon: Megaphone, color: "#8B5CF6" },
  { href: "/platform-admin/infrastructure", label: "Infrastructure", icon: Server, color: "#0EA5E9" },
  { href: "/platform-admin/ai-engine", label: "AI Engine", icon: Brain, color: "#8B5CF6" },
  { href: "/platform-admin/fraud", label: "Fraud Monitor", icon: ShieldAlert, color: "#F59E0B" },
  { href: "/platform-admin/security", label: "Security", icon: LockKeyhole, color: "#EF4444" },
  { href: "/platform-admin/alerts", label: "Alert Inbox", icon: Bell, color: "#DC2626", badge: true },
  { href: "/platform-admin/data-breaches", label: "Data Breach Report", icon: FileWarning, color: "#DC2626" },
];

export function Sidebar({
  admin, onLogout, collapsed, setCollapsed,
}: { admin: { email: string; name?: string | null } | null; onLogout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();
  const { data: alertCount } = useApi<{ count: number }>("/api/admin/platform/alerts/unread-count", { refreshInterval: 30000 });

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      className="no-print fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#E5E7EB] bg-white shadow-[1px_0_3px_rgba(0,0,0,0.03)]"
    >
      <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-sm">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-[#1F2937]">ZyncoAI <span className="text-[#9CA3AF] font-normal">Admin</span></span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {NAV.map((item) => {
          const active = item.href === "/platform-admin" ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-[#EEF2FF] text-[#1F2937]" : "text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1F2937]"
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full" style={{ background: item.color }} />}
              <span className="relative shrink-0">
                <Icon className="h-[18px] w-[18px]" style={{ color: item.color }} />
                {"badge" in item && item.badge && !!alertCount?.count && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#DC2626] text-[8px] font-bold text-white">
                    {alertCount.count > 9 ? "9+" : alertCount.count}
                  </span>
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && "badge" in item && item.badge && !!alertCount?.count && (
                <span className="ml-auto rounded-full bg-[#FEE2E2] px-1.5 py-0.5 text-[10px] font-bold text-[#DC2626]">{alertCount.count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E7EB] p-2">
        <Link
          href="/platform-admin/settings"
          title={collapsed ? "Settings" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1F2937]"
        >
          <Settings className="h-[18px] w-[18px] shrink-0 text-slate-500" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1F2937]"
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        <div className={`mt-2 flex items-center gap-3 rounded-xl px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-semibold text-white">
            {(admin?.name || admin?.email || "A").slice(0, 1).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#1F2937]">{admin?.name || "Admin"}</p>
              <p className="truncate text-[11px] text-[#9CA3AF]">{admin?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={onLogout} title="Sign out" className="text-[#9CA3AF] hover:text-[#EF4444]">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
