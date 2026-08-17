"use client";
// 2026-08-17 — the only client-side island on /resources/status: polls the
// real /status/live endpoint (statusChecks.ts on the backend — the exact
// same DB/Redis/Twilio checks statusHistoryScheduler.ts records every 5
// minutes) so the page shows a genuinely current reading, not just
// whatever was true when the page was server-rendered. Everything else on
// the page (90-day bars, incident log) is plain server-rendered HTML —
// keeping the client bundle to just this one small polling component is
// what "mobile-fast" means in practice here, not a slogan.
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { API_BASE, type StatusComponent } from "@/lib/marketing-api";

const POLL_MS = 30_000;

const STATUS_STYLE: Record<StatusComponent["status"], { pill: string; icon: React.ReactNode; label: string }> = {
  up: { pill: "bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Operational" },
  degraded: { pill: "bg-amber-50 text-amber-700", icon: <AlertTriangle className="h-3.5 w-3.5" />, label: "Degraded" },
  down: { pill: "bg-red-50 text-red-700", icon: <XCircle className="h-3.5 w-3.5" />, label: "Down" },
};

const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  api: "The dashboard and booking API responding to requests.",
  database: "The primary database — bookings, calls, billing all read and write here.",
  redis: "Session, queue, and caching layer behind the API and voice platform.",
  voice: "Whether inbound calls can currently reach Ella — checked directly against Twilio's own account status, plus at least one voice worker being online.",
  billing_webhooks: "Square's payment webhook endpoint — configuration and its database dependency.",
};

function formatAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)}m ago`;
}

export function LiveStatusIndicators({ initialComponents, initialCheckedAt }: { initialComponents: StatusComponent[]; initialCheckedAt: string }) {
  const [components, setComponents] = useState<StatusComponent[]>(initialComponents);
  const [checkedAt, setCheckedAt] = useState<string>(initialCheckedAt);
  const [refreshing, setRefreshing] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      setRefreshing(true);
      try {
        const res = await fetch(`${API_BASE}/status/live`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.components) {
          setComponents(data.components);
          setCheckedAt(data.checkedAt);
        }
      } catch {
        // Network hiccup — keep showing the last real reading rather than
        // clearing it to a blank/error state over one missed poll.
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    }

    const interval = setInterval(poll, POLL_MS);
    // Re-render every 5s just to keep the "checked Xs ago" caption honest
    // between polls, without re-fetching.
    const tick = setInterval(() => forceTick((t) => t + 1), 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(tick);
    };
  }, []);

  const allUp = components.every((c) => c.status === "up");

  return (
    <div>
      <div className={`flex items-center justify-between rounded-xl border p-4 ${allUp ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center gap-2">
          {allUp ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
          <p className={`text-sm font-semibold ${allUp ? "text-emerald-800" : "text-red-800"}`}>
            {allUp ? "All systems operational" : "Some systems are experiencing issues"}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
          {refreshing && <Loader2 className="h-3 w-3 animate-spin" />}
          Checked {formatAgo(checkedAt)}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {components.map((c) => {
          const style = STATUS_STYLE[c.status] || STATUS_STYLE.down;
          return (
            <div key={c.component} className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="min-w-0">
                <p className="font-medium text-[#0f172a]">{c.label}</p>
                <p className="mt-1 text-xs text-[#94a3b8]">{COMPONENT_DESCRIPTIONS[c.component] || ""}</p>
              </div>
              <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.pill}`}>
                {style.icon}
                {style.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-[#94a3b8]">
        Checked live on this page every 30 seconds, straight from the same checks that write the uptime history below — not a cached or hand-set status.
      </p>
    </div>
  );
}
