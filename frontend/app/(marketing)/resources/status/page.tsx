import { Mail, AlertTriangle } from "lucide-react";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";
import { LiveStatusIndicators } from "@/components/marketing/receptionist/LiveStatusIndicators";
import { UptimeHistoryBars } from "@/components/marketing/receptionist/UptimeHistoryBars";
import { getStatusLive, getStatusHistory, getStatusIncidents, type StatusComponent } from "@/lib/marketing-api";

export const metadata = {
  title: "System Status",
  description: "Live, per-component status of ZyncoAI's platform — API, database, Redis, voice, and billing webhooks.",
  alternates: { canonical: "/resources/status" },
};

// Without this, Next statically prerenders the page once at build time and
// serves that frozen snapshot to every visitor until the next deploy — the
// opposite of what a status page claiming to be "live" can honestly do.
// Forcing dynamic rendering means every request re-renders server-side;
// the underlying fetches still cache for 30s each (see apiGet in
// marketing-api.ts), so this doesn't hammer the API on every hit.
export const dynamic = "force-dynamic";

// 2026-08-17 rebuild — every real check here is described in full in
// components/marketing/receptionist/LiveStatusIndicators.tsx and
// backend/src/lib/statusChecks.ts. This page renders nothing it can't
// source from a real endpoint: no fabricated uptime percentage, no
// backfilled history, no SLA claim (our Terms don't offer one).
const FALLBACK_COMPONENTS: StatusComponent[] = [
  { component: "api", label: "API", status: "down", detail: "unreachable" },
  { component: "database", label: "Database", status: "down", detail: "unreachable" },
  { component: "redis", label: "Redis", status: "down", detail: "unreachable" },
  { component: "voice", label: "Voice platform", status: "down", detail: "unreachable" },
  { component: "billing_webhooks", label: "Billing webhooks", status: "down", detail: "unreachable" },
];

function formatDateRange(startedAt: string, resolvedAt: string | null): string {
  const start = new Date(startedAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short", timeZone: "Australia/Sydney" });
  if (!resolvedAt) return `Started ${start} — ongoing`;
  const end = new Date(resolvedAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short", timeZone: "Australia/Sydney" });
  return `${start} → ${end}`;
}

const COMPONENT_LABEL: Record<string, string> = {
  api: "API",
  database: "Database",
  redis: "Redis",
  voice: "Voice platform",
  billing_webhooks: "Billing webhooks",
};

export default async function StatusPage() {
  const [live, history, incidents] = await Promise.all([getStatusLive(), getStatusHistory(), getStatusIncidents()]);

  const components = live?.components?.length ? live.components : FALLBACK_COMPONENTS;
  const checkedAt = live?.checkedAt || new Date().toISOString();
  const liveDataAvailable = Boolean(live?.ok);

  return (
    <ResourcePageShell eyebrow="Resources" title="System Status" description="Real, per-component status — checked live and recorded every 5 minutes, starting from when this page shipped.">
      <ResourceSection title="Live status">
        {!liveDataAvailable && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Live status data is temporarily unavailable — showing the last known state rather than guessing.
          </div>
        )}
        <LiveStatusIndicators initialComponents={components} initialCheckedAt={checkedAt} />
      </ResourceSection>

      <ResourceSection title="90-day uptime history">
        <p className="text-xs text-[#94a3b8]">
          Tracking began 2026-08-17, recorded every 5 minutes. Days before that show as grey &quot;no data&quot; — we don&apos;t backfill or assume a day was healthy
          just because we weren&apos;t watching yet.
        </p>
        <div className="mt-4 space-y-5">
          {history?.history?.length
            ? history.history.map((h) => <UptimeHistoryBars key={h.component} label={COMPONENT_LABEL[h.component] || h.component} days={h.days} />)
            : <p className="text-sm text-[#94a3b8]">History data is temporarily unavailable.</p>}
        </div>
      </ResourceSection>

      <ResourceSection title="Incident history">
        {incidents?.incidents?.length ? (
          <div className="space-y-4">
            {incidents.incidents.map((inc) => (
              <div key={inc.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${inc.resolvedAt ? "bg-slate-100 text-[#475569]" : "bg-red-50 text-red-700"}`}>
                    {inc.resolvedAt ? "Resolved" : "Ongoing"}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">{COMPONENT_LABEL[inc.component] || inc.component}</span>
                </div>
                <p className="mt-2 font-medium text-[#0f172a]">{inc.title}</p>
                <p className="mt-1 text-xs text-[#94a3b8]">{formatDateRange(inc.startedAt, inc.resolvedAt)}</p>
                {inc.note && <p className="mt-2 text-sm text-[#475569]">{inc.note}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#475569]">No incidents logged.</p>
        )}
      </ResourceSection>

      <ResourceSection title="No SLA, and we won't pretend otherwise">
        <p>
          ZyncoAI doesn&apos;t currently offer a formal uptime SLA — our Terms don&apos;t promise one, and we&apos;d rather this page tell you what&apos;s actually
          true than what sounds reassuring. What you see above is the real, unedited signal: live checks, honest history, and every incident we know about.
        </p>
      </ResourceSection>

      <ResourceSection title="Subscribe to updates">
        <p>We don&apos;t yet have automated status-update emails. For now, email us and we&apos;ll add you to the list directly.</p>
        <a href="mailto:support@zyncoai.com?subject=Status%20updates" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6366f1] hover:underline">
          <Mail className="h-4 w-4" /> support@zyncoai.com
        </a>
      </ResourceSection>
    </ResourcePageShell>
  );
}
