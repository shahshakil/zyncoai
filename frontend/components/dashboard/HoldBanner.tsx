"use client";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Shown only for status === "HOLD" — either Square auto-charge retries
// exhausted (paymentRetryScheduler.ts) or a bank-transfer invoice going 14+
// days unpaid (paymentReminders.ts, unified onto the same HOLD terminal
// state as the card path). Deliberately a banner, not a full-page block
// like SuspendedAccountGate: HOLD keeps the whole dashboard usable so the
// owner can see what happened and fix it; only calling is actually blocked
// (twilioInbound.ts). Reactivation path differs by payer: a card payer
// fixing their card triggers Square's smart-retry automatically; a
// transfer payer's reactivation happens when an admin marks their invoice
// paid (admin/invoices.ts) — both flip HOLD -> ACTIVE the same way.
export function HoldBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "HOLD") return null;

  const isCardPayer = Boolean(business.squareCardId);

  return (
    <div className="flex items-center justify-between gap-3 bg-red-600 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <AlertOctagon className="h-5 w-5 shrink-0" />
        <div>
          {isCardPayer ? (
            <>
              <span className="font-semibold">Account on hold — update payment to restore calling.</span>
              <span className="block text-white/85">Ella is not answering calls until payment is resolved.</span>
            </>
          ) : (
            <>
              <span className="font-semibold">Account on hold — bank transfer overdue.</span>
              <span className="block text-white/85">Ella is not answering calls. Arrange the transfer using the reference on your latest invoice — we&apos;ll reactivate calling automatically once it&apos;s received and confirmed.</span>
            </>
          )}
        </div>
      </div>
      <Link
        href="/dashboard/settings?tab=billing"
        className="shrink-0 rounded-md bg-white px-4 py-2 font-semibold text-red-700 hover:bg-white/90"
      >
        {isCardPayer ? "Update Payment Method" : "View Invoice"}
      </Link>
    </div>
  );
}
