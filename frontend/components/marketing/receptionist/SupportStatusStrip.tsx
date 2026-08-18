import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StatusComponent } from "@/lib/marketing-api";

// Compact summary strip for the /support hub — reuses the exact same
// getStatusLive() data the full /resources/status page renders (see that
// page + lib/marketing-api.ts for how it's sourced), just condensed into a
// single row instead of the full history/incidents breakdown. No new status
// logic lives here.
const DOT_STYLE: Record<StatusComponent["status"], string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export function SupportStatusStrip({ components, checkedAt, liveDataAvailable }: { components: StatusComponent[]; checkedAt: string; liveDataAvailable: boolean }) {
  const allUp = components.every((c) => c.status === "up");
  const checkedLabel = new Date(checkedAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short", timeZone: "Australia/Sydney" });

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {components.map((c) => (
            <span key={c.component} className="flex items-center gap-1.5 text-xs font-medium text-[#475569]">
              <span className={`h-2 w-2 rounded-full ${DOT_STYLE[c.status]}`} aria-hidden="true" />
              {c.label}
            </span>
          ))}
        </div>
        <Link href="/resources/status" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6366f1] hover:text-[#4f46e5]">
          Full status page <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <p className="mt-2.5 text-xs text-[#94a3b8]">
        {liveDataAvailable ? `${allUp ? "All systems operational" : "Some systems degraded"} — checked ${checkedLabel}` : "Live status temporarily unavailable — showing last known state"}
      </p>
    </div>
  );
}
