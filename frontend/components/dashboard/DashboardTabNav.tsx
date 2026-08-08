"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { useApi } from "@/lib/useApi";
import { getVerticalOps } from "@/lib/verticalOps";

interface Tab {
  href: string;
  label: string;
  badge?: number;
}

// Sits below the page title on all three dashboard-home pages — not a
// Sidebar entry (the sidebar itself is explicitly unchanged). Route-based
// rather than client-state tabs so each tab is a real, linkable
// /dashboard(/ai-operations|/clinical) page.
export function DashboardTabNav() {
  const pathname = usePathname();
  const { role, business } = useDashboard();
  const showAiOps = role !== "DOCTOR";
  // Driven by lib/verticalOps.ts's clinicalEnabled flag (MEDICAL/DENTAL
  // only) — matches backend/src/lib/rbac.ts's requireClinicVertical.
  // STAFF sees it minus billing (server-enforced); DOCTOR sees it scoped
  // to triage only. Hiding this link is necessary but not sufficient on
  // its own — see VerticalGate.tsx for why /dashboard/clinical also needs
  // its own route-level guard against direct navigation.
  const showClinical = !!getVerticalOps(business.vertical)?.clinicalEnabled;

  const { data: live } = useApi<{ ok: boolean; calls: unknown[] }>(showAiOps ? "/api/business/ai-operations/live" : null, { refreshInterval: 15000 });
  const { data: triage } = useApi<{ ok: boolean; unreviewedCount: number }>(showClinical ? "/api/business/clinical/triage" : null, { refreshInterval: 30000 });
  const { data: waitlist } = useApi<{ ok: boolean; entries: { status: string }[] }>(showClinical ? "/api/business/waitlist" : null, { refreshInterval: 30000 });

  const tabs: Tab[] = [{ href: "/dashboard", label: "Overview" }];
  if (showAiOps) tabs.push({ href: "/dashboard/ai-operations", label: "AI Voice Operations", badge: live?.calls?.length || undefined });
  if (showClinical) tabs.push({ href: "/dashboard/clinical", label: "Clinical & Billing", badge: triage?.unreviewedCount || undefined });
  if (showClinical) {
    tabs.push({
      href: "/dashboard/waitlist",
      label: "Waitlist",
      badge: waitlist?.entries?.filter((e) => e.status === "WAITING").length || undefined,
    });
  }

  return (
    <div className="no-print flex items-center gap-1 border-b border-slate-200">
      {tabs.map((t) => {
        const active = t.href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm transition ${
              active ? "border-b-2 border-indigo-500 font-semibold text-slate-900" : "border-b-2 border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
            {!!t.badge && (
              <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                {t.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
