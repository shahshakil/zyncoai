"use client";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { DashboardBusiness } from "./BusinessContext";

// Shown only for status === "HOLD" — Square auto-charge retries exhausted
// (paymentRetryScheduler.ts). Deliberately a banner, not a full-page block
// like SuspendedAccountGate: HOLD keeps the whole dashboard usable so the
// owner can see what happened and fix their card; only calling is actually
// blocked (twilioInbound.ts).
export function HoldBanner({ business }: { business: DashboardBusiness }) {
  if (business.status !== "HOLD") return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-red-600 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <AlertOctagon className="h-5 w-5 shrink-0" />
        <div>
          <span className="font-semibold">Account on hold — update payment to restore calling.</span>
          <span className="block text-white/85">Ella is not answering calls until payment is resolved.</span>
        </div>
      </div>
      <Link
        href="/dashboard/settings?tab=billing"
        className="shrink-0 rounded-md bg-white px-4 py-2 font-semibold text-red-700 hover:bg-white/90"
      >
        Update Payment Method
      </Link>
    </div>
  );
}
