"use client";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Only shown for a business still on its free trial and never converted to
// a paid plan — trialEndsAt gets set at signup (7 days) and manualPlan
// stays null until the owner activates a plan (billing.ts's PATCH /plan).
// Once manualPlan is set, this business is no longer "on trial" in any
// meaningful sense even if trialEndsAt technically hasn't passed yet.
export function TrialBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "ACTIVE" || business.manualPlan || !business.trialEndsAt) return null;

  const trialEndsAt = new Date(business.trialEndsAt);
  const msLeft = trialEndsAt.getTime() - Date.now();
  if (msLeft <= 0) return null; // expired — DashboardGate's suspended-account gate takes over instead

  const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));

  if (daysLeft <= 1) {
    return (
      <div className="flex items-center justify-between gap-3 bg-rose-600 px-4 py-2.5 text-sm text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">Your trial expires tomorrow — add a card now to avoid interruption.</span>
        </div>
        <Link href="/dashboard/settings?tab=billing" className="shrink-0 rounded-md bg-white/15 px-3 py-1 font-medium hover:bg-white/25">
          Add payment method
        </Link>
      </div>
    );
  }

  if (daysLeft <= 3) {
    return (
      <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-2.5 text-sm text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">Trial ends in {daysLeft} day{daysLeft === 1 ? "" : "s"} — add a card to keep Ella answering calls.</span>
        </div>
        <Link href="/dashboard/settings?tab=billing" className="shrink-0 rounded-md bg-white/15 px-3 py-1 font-medium hover:bg-white/25">
          Add payment method
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-emerald-600 px-4 py-2 text-sm text-white">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{daysLeft} days remaining in your free trial</span>
      </div>
      <Link href="/dashboard/settings?tab=billing" className="shrink-0 text-white/80 underline-offset-2 hover:text-white hover:underline">
        Add card early
      </Link>
    </div>
  );
}
