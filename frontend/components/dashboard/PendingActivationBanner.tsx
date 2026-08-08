"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Clock3 } from "lucide-react";
import { apiPost } from "@/lib/useApi";
import { formatAUD as money } from "@/lib/money";
import { DashboardBusiness } from "./BusinessContext";

// Shown whenever a plan choice is awaiting a bank transfer
// (Business.pendingPlanKey/pendingActivationInvoiceId, set by PATCH /plan's
// bank-transfer path) — independent of business.status, since this applies
// equally to an already-ACTIVE business's pending upgrade and a
// TRIAL_ENDED business's pending first activation (calls stay paused for
// the latter until payment is confirmed; TrialEndedBanner is suppressed
// while this is showing so the two don't stack). The plan does NOT
// activate until an admin marks the linked invoice paid
// (admin/invoices.ts) — this is informational + a way to back out, not a
// payment form.
export function PendingActivationBanner({ business }: { business: DashboardBusiness }) {
  const [cancelling, setCancelling] = useState(false);
  if (!business.pendingPlanKey || !business.pendingActivation) return null;

  const { invoiceNumber, totalCents, planName } = business.pendingActivation;
  const callsPaused = business.status === "TRIAL_ENDED";
  const currentPlanLabel = business.complimentaryPlan ? "complimentary plan" : "current plan";

  async function cancelPending() {
    setCancelling(true);
    try {
      await apiPost("/api/business/billing/cancel-pending-plan");
      toast.success("Pending plan cancelled");
      window.location.reload();
    } catch {
      toast.error("Could not cancel — contact support");
      setCancelling(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <Clock3 className="h-5 w-5 shrink-0" />
        <div>
          <span className="font-semibold">
            Awaiting your bank transfer for the {planName} plan — {money(totalCents)}, ref {invoiceNumber}.
          </span>
          <span className="block text-white/85">
            {callsPaused
              ? `Calls stay paused until we receive it — you'll switch to ${planName} the moment we confirm payment.`
              : `Your ${currentPlanLabel} stays active in the meantime — it switches to ${planName} the moment we confirm payment.`}
          </span>
        </div>
      </div>
      <button
        type="button"
        disabled={cancelling}
        onClick={cancelPending}
        className="shrink-0 rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25 disabled:opacity-50"
      >
        {cancelling ? "…" : "Cancel"}
      </button>
    </div>
  );
}
