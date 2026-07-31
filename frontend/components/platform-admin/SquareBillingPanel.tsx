"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, RefreshCw, Trash2 } from "lucide-react";
import { apiPost } from "@/lib/useApi";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { formatCents } from "./format";

interface RecentInvoice {
  id: string; invoiceNumber: string; totalCents: number; status: "ISSUED" | "PAID" | "VOID";
  paidVia: "BANK_TRANSFER" | "SQUARE" | null; autoChargeFailedAt: string | null; autoChargeError: string | null; issuedAt: string;
}

export function SquareBillingPanel({
  businessId,
  card,
  recentInvoices,
  onChanged,
}: {
  businessId: string;
  card: { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null } | null;
  recentInvoices: RecentInvoice[];
  onChanged: () => void;
}) {
  const [removing, setRemoving] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  async function removeCard() {
    setRemoving(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/square-billing/remove-card`);
      toast.success("Card removed");
      onChanged();
    } catch {
      toast.error("Could not remove card");
    } finally {
      setRemoving(false);
    }
  }

  async function retryCharge(invoiceId: string) {
    setRetryingId(invoiceId);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/square-billing/retry-charge`, { invoiceId });
      toast.success("Charge succeeded");
      onChanged();
    } catch {
      toast.error("Charge failed — same reason as before, most likely");
    } finally {
      setRetryingId(null);
    }
  }

  const failedInvoices = recentInvoices.filter((i) => i.status === "ISSUED" && i.autoChargeFailedAt);

  return (
    <div className="rounded-xl border border-[#E5E7EB] p-3">
      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        <CreditCard className="h-3.5 w-3.5" /> Square Billing
      </h3>
      <div className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2">
        <div>
          <p className="text-xs font-medium text-[#6B7280]">Card on file</p>
          <p className="text-sm text-[#1F2937]">{card ? `${card.brand} •••• ${card.last4} (${card.expMonth}/${card.expYear})` : "None"}</p>
        </div>
        {card && (
          <Button size="sm" variant="outline" disabled={removing} onClick={removeCard}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {failedInvoices.length > 0 && (
        <div className="mt-2 space-y-2">
          {failedInvoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-lg bg-[#FEF2F2] px-3 py-2">
              <div>
                <p className="text-xs font-medium text-[#B91C1C]">{inv.invoiceNumber} — {formatCents(inv.totalCents)} unpaid</p>
                <p className="text-[11px] text-[#B91C1C]">{inv.autoChargeError || "auto-charge failed"}</p>
              </div>
              {card && (
                <Button size="sm" variant="outline" disabled={retryingId === inv.id} onClick={() => retryCharge(inv.id)}>
                  <RefreshCw className={`h-3.5 w-3.5 ${retryingId === inv.id ? "animate-spin" : ""}`} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {recentInvoices.length > 0 && (
        <div className="mt-2 space-y-1">
          {recentInvoices.slice(0, 5).map((inv) => (
            <div key={inv.id} className="flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">{inv.invoiceNumber}</span>
              <span className="flex items-center gap-2">
                <span className="text-[#1F2937]">{formatCents(inv.totalCents)}</span>
                <Badge tone={inv.status === "PAID" ? "success" : inv.status === "VOID" ? "default" : "warning"}>
                  {inv.status === "PAID" && inv.paidVia === "SQUARE" ? "paid (card)" : inv.status.toLowerCase()}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
