"use client";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Shown for status === "TRIAL_ENDED" (trial or legacy grace period lapsed
// with no plan ever chosen — trialExpiryScheduler.ts) — deliberately a
// banner, not a full-page block: the dashboard stays fully usable so the
// owner can choose a plan; only calling is blocked (twilioInbound.ts).
// Suppressed while a plan choice is already pending payment
// (PendingActivationBanner covers that case instead — no "choose a plan"
// CTA makes sense once one's already been chosen).
export function TrialEndedBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "TRIAL_ENDED" || business.pendingPlanKey) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-red-600 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <AlertOctagon className="h-5 w-5 shrink-0" />
        <div>
          <span className="font-semibold">Your trial has ended — choose a plan to restore calling.</span>
          <span className="block text-white/85">Ella has stopped answering new calls. Your data and dashboard access are unaffected — choosing a plan reactivates calling right away.</span>
        </div>
      </div>
      <Link href="/dashboard/billing" className="shrink-0 rounded-md bg-white px-4 py-2 font-semibold text-red-700 hover:bg-white/90">
        Choose a Plan
      </Link>
    </div>
  );
}
