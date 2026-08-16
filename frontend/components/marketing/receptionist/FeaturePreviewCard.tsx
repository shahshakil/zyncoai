"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/dashboard/ui/card";

// Shared honest-preview primitive for /features sections that don't already
// have a dedicated scripted scene (ExampleCallScene, LiveDashboardScene).
// Same visual language as those (Card from components/dashboard/ui — the
// REAL dashboard's own primitive, not a redrawn lookalike) and the same
// disclosure convention: every instance is stamped "Sample data" in its
// footer, matching LiveDashboardScene's "Simulated preview — sample data"
// precedent. Content passed in per-feature must be real (a real capability,
// a real field name, a real integration) — this component only provides
// the honest presentation shell, it doesn't itself vouch for the content.
export interface PreviewRow {
  label: string;
  value: string;
  tone?: "default" | "positive" | "muted";
}

const TONE_CLASS: Record<NonNullable<PreviewRow["tone"]>, string> = {
  default: "text-[#0f172a]",
  positive: "text-emerald-600",
  muted: "text-[#94a3b8]",
};

export function FeaturePreviewCard({
  icon: Icon,
  title,
  rows,
  footnote,
}: {
  icon: LucideIcon;
  title: string;
  rows: PreviewRow[];
  footnote?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="overflow-hidden !rounded-3xl">
        <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
          <Icon className="h-4 w-4 text-[#6366f1]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#475569]">{title}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-[#64748b]">{row.label}</span>
              <span className={`text-sm font-semibold ${TONE_CLASS[row.tone || "default"]}`}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-5 py-2.5 text-right text-[11px] italic text-[#94a3b8]">
          {footnote || "Sample data"}
        </div>
      </Card>
    </motion.div>
  );
}
