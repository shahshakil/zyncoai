"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Shown when a payment is overdue but the account hasn't yet reached HOLD
// (HoldBanner's own trigger) — status is still ACTIVE through that whole
// grace window, so this is the only in-app signal of a payment problem
// until then. Amber, not red: service is fully unaffected, this is
// informational. Two real payment paths land here, with different real
// causes and different fixes — billingPastDue itself is a single boolean
// (business/me.ts ORs both cases together), so the copy branches on
// whether a card is on file at all, not on which specific check tripped.
export function PastDueBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "ACTIVE" || !business.billingPastDue) return null;

  const isCardPayer = Boolean(business.squareCardId);

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <div>
          {isCardPayer ? (
            <>
              <span className="font-semibold">Your last payment didn&apos;t go through.</span>
              <span className="block text-white/85">We&apos;ll retry automatically — Ella keeps answering calls in the meantime. Update your card to retry sooner.</span>
            </>
          ) : (
            <>
              <span className="font-semibold">A bank transfer invoice is overdue.</span>
              <span className="block text-white/85">Ella keeps answering calls for now — arrange the transfer using the reference on your latest invoice to avoid an interruption.</span>
            </>
          )}
        </div>
      </div>
      <Link
        href="/dashboard/settings?tab=billing"
        className="shrink-0 rounded-md bg-white px-4 py-2 font-semibold text-amber-700 hover:bg-white/90"
      >
        {isCardPayer ? "Update Payment Method" : "View Invoice"}
      </Link>
    </div>
  );
}
