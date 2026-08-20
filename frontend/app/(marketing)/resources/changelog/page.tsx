import type { Metadata } from "next";
import { ResourcePageShell } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Version history — what's new, fixed, and improved in ZyncoAI.",
  alternates: { canonical: "/resources/changelog" },
};

const ENTRIES = [
  {
    date: "July 2026",
    tag: "New",
    title: "AI Voice Operations & Clinical and Billing dashboard tabs",
    items: ["Live call centre with real-time transcripts and one-click human transfer", "Triage queue for emergency-flagged calls", "Patient status pipeline (Booked → Arrived → In Consultation → Checked Out)"],
  },
  {
    date: "July 2026",
    tag: "New",
    title: "Owner Financial Command Centre",
    items: ["Revenue by payer type, doctor, and service", "Staff pay and operating cost tracking", "Monthly and annual trend reporting"],
  },
  {
    date: "July 2026",
    tag: "New",
    title: "Clinic document storage and insurance claims tracking",
    items: ["Upload and store referrals, reports, and consent forms", "Track claim status from lodged through to paid"],
  },
  {
    date: "June 2026",
    tag: "Improved",
    title: "Staff auto-sync",
    items: ["One-click sync from Cliniko, Nookal, Google Workspace, and Microsoft 365"],
  },
  {
    date: "June 2026",
    tag: "Fixed",
    title: "Call routing reliability",
    items: ["Resolved an edge case where after-hours calls could be misrouted during a carrier forwarding reset"],
  },
];

const TAG_COLOR: Record<string, string> = { New: "#6366f1", Improved: "#10b981", Fixed: "#f59e0b" };

export default function ChangelogPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="Changelog" description="What's new, fixed, and improved — in the order it shipped.">
      <div className="space-y-6">
        {ENTRIES.map((e) => (
          <div key={e.title} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ background: TAG_COLOR[e.tag] }}>{e.tag}</span>
              <span className="text-xs text-[#94a3b8]">{e.date}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-[#0f172a]">{e.title}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#475569]">
              {e.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </ResourcePageShell>
  );
}
