"use client";
import { CalendarDays, CreditCard, Users, FileSpreadsheet, Clock } from "lucide-react";
import { getIntegrationsCatalog, type IntegrationKind } from "@/lib/integrationsCatalog";
import { MEDICAL_PMS_PROVIDERS } from "./data";

// Honest three-tier classification — no "live/needs-account/roadmap" enum
// existed anywhere in the codebase before this (confirmed by a dedicated
// research pass, 2026-08-15); this is built from the real underlying signal
// instead of invented: getIntegrationsCatalog()'s IntegrationKind (real
// working sync vs. coming_soon-with-a-researched-reason) plus
// IntegrationsTab.tsx's hasDirectSync flag for the medical/dental PMS
// vendors, which live in a separate system from the general catalog. "Needs
// account" isn't used as a label here — practically every real integration
// requires the customer's own account with that vendor, so it wouldn't
// distinguish anything; the real, useful distinction this product actually
// has is live automatic sync vs. manual/CSV vs. not built yet.
type Tier = "live" | "manual" | "roadmap";
interface Row {
  name: string;
  description: string;
  tier: Tier;
  detail?: string;
}

const KIND_ICON: Record<IntegrationKind, typeof CalendarDays> = {
  google_calendar: CalendarDays,
  microsoft_calendar: CalendarDays,
  square: CreditCard,
  website_scrape: FileSpreadsheet,
  coming_soon: Clock,
};

const TIER_LABEL: Record<Tier, { label: string; badgeClass: string }> = {
  live: { label: "Live sync", badgeClass: "bg-emerald-50 text-emerald-700" },
  manual: { label: "CSV / manual import", badgeClass: "bg-amber-50 text-amber-700" },
  roadmap: { label: "Roadmap", badgeClass: "bg-slate-100 text-slate-500" },
};

function buildRows(vertical: string): Row[] {
  const catalog = getIntegrationsCatalog(vertical);
  const rows: Row[] = catalog.map((c) => ({
    name: c.name,
    description: c.description,
    tier: c.kind === "coming_soon" ? "roadmap" : "live",
    detail: c.kind === "coming_soon" ? c.comingSoonReason : undefined,
  }));

  // Medical/Dental PMS staff-sync vendors live in a separate system
  // (IntegrationsTab.tsx) from the general catalog above, which only lists
  // Google Calendar for these two verticals — added here so the page isn't
  // silently missing the richest real integration story the product has.
  if (vertical === "MEDICAL" || vertical === "DENTAL") {
    for (const p of MEDICAL_PMS_PROVIDERS) {
      rows.push({
        name: p.name,
        description: p.hasDirectSync ? "Staff/practitioner sync — automatic." : "No live sync — connect via CSV import instead.",
        tier: p.hasDirectSync ? "live" : "manual",
      });
    }
  }
  return rows;
}

export function VerticalIntegrationsSection({ industryName, vertical }: { industryName: string; vertical: string }) {
  const rows = buildRows(vertical);
  const tiers: Tier[] = ["live", "manual", "roadmap"];

  return (
    <section id="integrations" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">Works with the tools {industryName.toLowerCase()} businesses already use</h2>
        <p className="mt-3 text-[#475569]">Classified honestly — live sync, manual/CSV import, or genuinely not built yet.</p>
      </div>
      <div className="mx-auto mt-10 max-w-4xl space-y-8 px-6">
        {tiers.map((tier) => {
          const tierRows = rows.filter((r) => r.tier === tier);
          if (!tierRows.length) return null;
          return (
            <div key={tier}>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TIER_LABEL[tier].badgeClass}`}>{TIER_LABEL[tier].label}</span>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tierRows.map((r) => {
                  const Icon = tier === "manual" ? FileSpreadsheet : tier === "roadmap" ? Clock : r.name.toLowerCase().includes("calendar") ? CalendarDays : r.name.toLowerCase().includes("square") ? CreditCard : Users;
                  return (
                    <div key={r.name} className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#6366f1]" />
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{r.name}</p>
                        <p className="mt-0.5 text-xs text-[#475569]">{r.detail || r.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
