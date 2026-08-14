"use client";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select } from "./ui/input";
import { SquarePaymentMethodCard } from "./settings/SquarePaymentMethodCard";
import { formatAUD as money } from "@/lib/money";

interface AvailablePlan { key: string; name: string; priceCents: number; isCustom: boolean }
interface BillingData {
  square: { configured: boolean; clientConfig: { applicationId: string; locationId: string; environment: "sandbox" | "production" } | null; card: { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null } | null };
  billingContact: { name: string | null; email: string | null };
  availablePlans: AvailablePlan[];
}

// Rendered by DashboardGate INSTEAD of the normal dashboard whenever
// business.status === "SUSPENDED" — today the only automated path there is
// trialExpiryScheduler.ts (trial lapsed with no plan ever chosen), so this
// is deliberately framed as a trial-reactivation screen rather than a
// generic "suspended" message. No way to skip: DashboardGate simply never
// renders `children` while this is showing.
export function SuspendedAccountGate() {
  const { data, mutate } = useApi<BillingData>("/api/business/billing");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [activating, setActivating] = useState(false);

  async function activate() {
    if (!selectedPlan) return;
    setActivating(true);
    try {
      await apiPost("/api/business/billing/plan", { planKey: selectedPlan }, "PATCH");
      toast.success("Plan activated — welcome back!");
      // Simplest reliable way to get DashboardGate to re-run its status
      // check from scratch and unblock into the real dashboard.
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof ApiError && e.message === "card_required" ? "Add a payment method first" : "Could not activate — please try again");
    } finally {
      setActivating(false);
    }
  }

  const hasCard = Boolean(data?.square.card);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="text-sm font-semibold text-rose-900">Your trial has ended</p>
            <p className="mt-1 text-sm text-rose-700">Add a payment method to reactivate — Ella isn&apos;t answering calls until then.</p>
          </div>
        </div>

        {!data ? (
          <Card><CardContent className="p-6 text-sm text-slate-400">Loading…</CardContent></Card>
        ) : (
          <>
            <SquarePaymentMethodCard
              configured={data.square.configured}
              clientConfig={data.square.clientConfig}
              card={data.square.card}
              billingContact={data.billingContact}
              onChanged={mutate}
            />
            {hasCard && (
              <Card>
                <CardHeader><CardTitle>Choose a plan to reactivate</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                    <option value="" disabled>Select a plan…</option>
                    {data.availablePlans.map((p) => (
                      <option key={p.key} value={p.key} disabled={p.isCustom}>
                        {p.name} — {p.isCustom ? "contact support" : `${money(p.priceCents)}/mo`}
                      </option>
                    ))}
                  </Select>
                  <Button className="w-full" disabled={!selectedPlan || activating} onClick={activate}>
                    {activating ? "Activating…" : "Activate plan"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
