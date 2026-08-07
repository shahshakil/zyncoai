"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Shown when a Square auto-charge attempt has failed but the day-0/2/7
// automated retry pipeline (paymentRetryScheduler.ts) hasn't yet exhausted
// itself into a HOLD (HoldBanner's own trigger) — status is still ACTIVE
// through that whole window, so this is the only in-app signal of a
// payment problem until then. Amber, not red: service is fully unaffected,
// automated retries are already in flight, this is informational.
export function PastDueBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "ACTIVE" || !business.billingPastDue) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <div>
          <span className="font-semibold">Your last payment didn&apos;t go through.</span>
          <span className="block text-white/85">We&apos;ll retry automatically — Ella keeps answering calls in the meantime. Update your card to retry sooner.</span>
        </div>
      </div>
      <Link
        href="/dashboard/settings?tab=billing"
        className="shrink-0 rounded-md bg-white px-4 py-2 font-semibold text-amber-700 hover:bg-white/90"
      >
        Update Payment Method
      </Link>
    </div>
  );
}
