import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "vip" | "purple";

const toneClasses: Record<Tone, string> = {
  default: "bg-slate-100 text-slate-600 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-cyan-50 text-cyan-700 border-cyan-200",
  vip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

const CALL_OUTCOME_TONE: Record<string, Tone> = {
  booked: "success",
  callback_requested: "warning",
  faq_answered: "info",
  guardrail_redirect: "danger",
};

export function OutcomeBadge({ outcome }: { outcome?: string | null }) {
  if (!outcome) return <Badge tone="default">—</Badge>;
  return <Badge tone={CALL_OUTCOME_TONE[outcome] || "default"}>{outcome.replace(/_/g, " ")}</Badge>;
}

const STATUS_TONE: Record<string, Tone> = {
  RINGING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  FAILED: "danger",
  NO_ANSWER: "default",
  CONFIRMED: "success",
  REQUESTED: "warning",
  RESCHEDULED: "info",
  CANCELLED: "danger",
  NO_SHOW: "danger",
  ACTIVE: "success",
  SUSPENDED: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] || "default"}>{status.replace(/_/g, " ").toLowerCase()}</Badge>;
}

const TAG_TONE: Record<string, Tone> = {
  vip: "vip",
  new: "info",
  regular: "success",
  "no-show": "danger",
  flagged: "warning",
};

export function TagBadge({ tag }: { tag: string }) {
  return <Badge tone={TAG_TONE[tag] || "purple"}>{tag}</Badge>;
}
