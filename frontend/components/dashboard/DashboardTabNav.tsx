"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { useApi } from "@/lib/useApi";

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
  const { role } = useDashboard();
  const showAiOps = role !== "DOCTOR";
  const showClinical = true; // STAFF sees it minus billing (server-enforced); DOCTOR sees it scoped to triage only

  const { data: live } = useApi<{ ok: boolean; calls: unknown[] }>(showAiOps ? "/api/business/ai-operations/live" : null, { refreshInterval: 15000 });
  const { data: triage } = useApi<{ ok: boolean; unreviewedCount: number }>(showClinical ? "/api/business/clinical/triage" : null, { refreshInterval: 30000 });

  const tabs: Tab[] = [{ href: "/dashboard", label: "Overview" }];
  if (showAiOps) tabs.push({ href: "/dashboard/ai-operations", label: "AI Voice Operations", badge: live?.calls?.length || undefined });
  if (showClinical) tabs.push({ href: "/dashboard/clinical", label: "Clinical & Billing", badge: triage?.unreviewedCount || undefined });

  return (
    <div className="no-print flex items-center gap-1 border-b border-slate-200">
      {tabs.map((t) => {
        const active = t.href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm transition ${
              active ? "border-b-2 border-[#2563eb] font-bold text-[#2563eb]" : "border-b-2 border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            {t.label}
            {!!t.badge && (
              <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#dc2626] px-1 text-[10px] font-semibold text-white">
                {t.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
