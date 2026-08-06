"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Phone,
  CalendarClock,
  Users,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  DollarSign,
  FileHeart,
  CalendarDays,
  FolderOpen,
  ChefHat,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "./BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { BrandLogo } from "@/components/layout/BrandLogo";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  children?: { href: string; label: string }[];
}

const SETTINGS_CHILDREN = [
  { href: "/dashboard/settings?tab=profile", label: "Profile" },
  { href: "/dashboard/settings?tab=staff", label: "Staff Management" },
  { href: "/dashboard/settings?tab=integrations", label: "Integrations" },
  { href: "/dashboard/settings?tab=webhooks", label: "Webhooks" },
  { href: "/dashboard/settings?tab=compliance", label: "Security & Compliance" },
];

function buildNav(role: string, vertical: string): NavItem[] {
  const ops = getVerticalOps(vertical);
  const base: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];

  if (role === "OWNER" || role === "ADMIN") {
    base.push({ href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 });
    base.push({ href: "/dashboard/billing", label: "Billing & Subscription", icon: CreditCard });
  }

  if (role !== "DOCTOR") {
    base.push({ href: "/dashboard/calls", label: "Call History", icon: Phone });
  } else {
    base.push({ href: "/dashboard/calls", label: "My Calls", icon: Phone });
  }

  base.push({ href: "/dashboard/bookings", label: role === "DOCTOR" ? "My Schedule" : "Bookings", icon: CalendarClock });
  base.push({ href: "/dashboard/contacts", label: role === "DOCTOR" ? `My ${ops?.contactLabelPlural || "Contacts"}` : ops?.contactLabelPlural || "Contacts", icon: Users });

  if (role === "DOCTOR" && ops) {
    base.push({ href: "/dashboard/calendar", label: "My Calendar", icon: CalendarDays });
  } else {
    base.push({ href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays });
  }

  if (ops?.kitchenEnabled && role !== "DOCTOR") {
    base.push({ href: "/dashboard/kitchen", label: "Kitchen", icon: ChefHat });
  }

  if (ops && (role === "OWNER" || role === "ADMIN")) {
    base.push({ href: "/dashboard/finance", label: "Financial Dashboard", icon: DollarSign });
  }

  if (ops?.claimsEnabled && (role === "OWNER" || role === "ADMIN" || role === "STAFF")) {
    base.push({ href: "/dashboard/claims", label: ops.claimsLabel, icon: FileHeart });
  }

  if (ops) {
    base.push({ href: "/dashboard/documents", label: ops.documentsLabel, icon: FolderOpen });
  }

  if (role === "OWNER" || role === "ADMIN") {
    base.push({ href: "/dashboard/settings", label: "Settings", icon: Settings, children: SETTINGS_CHILDREN });
  }

  return base;
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role, business } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const nav = buildNav(role, business.vertical);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-[var(--border,#e2e8f0)] bg-white transition-all duration-200 lg:static lg:translate-x-0",
          collapsed ? "w-[76px]" : "w-64",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center overflow-hidden">
            <BrandLogo collapsed={collapsed} />
          </Link>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        {!collapsed && (
          <div className="truncate px-4 pb-2 text-xs font-medium text-slate-400">{business.name}</div>
        )}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;
            const isExpanded = expanded === item.href;

            return (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-l-[var(--accent-primary)] bg-[var(--accent-light)] text-[var(--accent-text)]"
                        : "border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                  {hasChildren && !collapsed && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.href)}
                      className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
                    </button>
                  )}
                </div>
                {hasChildren && !collapsed && isExpanded && (
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-slate-100 pl-4">
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3">
          <a
            href="tel:000"
            className={cn(
              "flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500",
              collapsed && "justify-center"
            )}
            title="Emergency (AU 000)"
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Emergency Help</span>}
          </a>
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden items-center justify-center gap-2 border-t border-slate-100 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-900 lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </aside>
    </>
  );
}
