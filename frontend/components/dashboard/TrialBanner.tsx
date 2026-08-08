"use client";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Only shown for a business still on its free trial (or the one-time
// pre-existing-business grace period — legacyBillingGraceGranted, see
// Business's schema comment) and never converted to a paid plan —
// trialEndsAt gets set at signup (PlatformSettings.trialDays) and
// manualPlan stays null until the owner activates a plan (billing.ts's
// PATCH /plan). Once manualPlan is set, this business is no longer "on
// trial" in any meaningful sense even if trialEndsAt technically hasn't
// passed yet.
export function TrialBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "ACTIVE" || business.manualPlan || !business.trialEndsAt) return null;

  const trialEndsAt = new Date(business.trialEndsAt);
  const msLeft = trialEndsAt.getTime() - Date.now();
  if (msLeft <= 0) return null; // expired — TrialEndedBanner takes over instead

  const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
  const isGrace = Boolean(business.legacyBillingGraceGranted);

  if (daysLeft <= 1) {
    return (
      <div className="flex items-center justify-between gap-3 bg-rose-600 px-4 py-2.5 text-sm text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            {isGrace ? "Calls pause tomorrow — choose a plan now to avoid interruption." : "Your trial expires tomorrow — choose a plan now to avoid interruption."}
          </span>
        </div>
        <Link href="/dashboard/billing" className="shrink-0 rounded-md bg-white/15 px-3 py-1 font-medium hover:bg-white/25">
          Choose a plan
        </Link>
      </div>
    );
  }

  if (daysLeft <= 3) {
    return (
      <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-2.5 text-sm text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            {isGrace
              ? `Calls pause in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — choose a plan to keep Ella answering.`
              : `Trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — choose a plan to keep Ella answering.`}
          </span>
        </div>
        <Link href="/dashboard/billing" className="shrink-0 rounded-md bg-white/15 px-3 py-1 font-medium hover:bg-white/25">
          Choose a plan
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-emerald-600 px-4 py-2 text-sm text-white">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{isGrace ? `Your account needs a plan — ${daysLeft} days until calls pause` : `${daysLeft} days remaining in your free trial`}</span>
      </div>
      <Link href="/dashboard/billing" className="shrink-0 text-white/80 underline-offset-2 hover:text-white hover:underline">
        Choose a plan early
      </Link>
    </div>
  );
}
