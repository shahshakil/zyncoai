// Server-rendered, no client JS — 90 thin bars per component, exactly the
// familiar statuspage.io shape. Grey "no data" bars are load-bearing, not
// decorative: tracking only started 2026-08-17 (statusHistoryScheduler.ts),
// so every day before a component's first real StatusCheckSnapshot row
// renders grey, never a guessed/backfilled green.
import type { StatusHistoryDay } from "@/lib/marketing-api";

const BAR_COLOR: Record<StatusHistoryDay["status"], string> = {
  up: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-red-400",
  no_data: "bg-slate-200",
};

function summarize(days: StatusHistoryDay[]): string {
  const withData = days.filter((d) => d.status !== "no_data");
  if (withData.length === 0) return "No data yet";
  if (withData.length === 1) return "Tracking started today";
  const avg = withData.reduce((sum, d) => sum + (d.upPct ?? 0), 0) / withData.length;
  return `${avg.toFixed(1)}% uptime over the last ${withData.length} day${withData.length === 1 ? "" : "s"} tracked`;
}

export function UptimeHistoryBars({ label, days }: { label: string; days: StatusHistoryDay[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-[#0f172a]">{label}</p>
        <p className="text-xs text-[#94a3b8]">{summarize(days)}</p>
      </div>
      <div className="mt-2 flex gap-[2px]" role="img" aria-label={`${label} 90-day status history`}>
        {days.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.status === "no_data" ? "no data" : d.status === "up" ? "operational" : d.status}${d.upPct !== undefined ? ` (${d.upPct}%)` : ""}`}
            className={`h-6 flex-1 rounded-[2px] ${BAR_COLOR[d.status]}`}
          />
        ))}
      </div>
    </div>
  );
}
