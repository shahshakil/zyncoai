"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Gift } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Select } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ToggleRow } from "../ui/toggle";
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from "../ui/table";
import { SquarePaymentMethodCard } from "./SquarePaymentMethodCard";
import { formatAUD as money } from "@/lib/money";

interface BillingPlan {
  key: string; name: string; priceCents: number; callAllowance: number | null; minuteAllowance: number | null;
  overageCentsPerMinute: number;
  minutesUsedThisMonth: number;
  minutesRemaining: number | null;
  pctMinutesUsed: number | null;
  nextBillingDate: string;
  setupFeeCents: number | null;
}
interface AvailablePlan extends BillingPlan {
  setupFeeCents: number; isCustom: boolean;
}
interface BillingAddOn {
  key: string; name: string; description: string; frequency: "MONTHLY" | "ONE_TIME"; priceCents: number;
  active?: boolean; purchased?: boolean; awaitingBillingConfirmation?: boolean;
}
interface BillingDiscount {
  id: string; type: "PERCENTAGE" | "FIXED_AMOUNT" | "CREDIT"; valuePercent: number | null; valueCents: number | null;
  reason: string; source: string; recurring: boolean; expiresAt: string | null;
}
interface BillingInvoice {
  id: string; invoiceNumber: string; periodStart: string; periodEnd: string; totalCents: number; status: string; issuedAt: string; dueDate: string;
  paidVia: "BANK_TRANSFER" | "SQUARE" | null; autoChargeError: string | null;
}
interface BillingData {
  plan: BillingPlan | null;
  availablePlans: AvailablePlan[];
  billingCycle: "MONTHLY" | "ANNUAL";
  annualPaidUntil: string | null;
  addOns: BillingAddOn[];
  discounts: BillingDiscount[];
  referral: { link: string; wasReferredBy: boolean; pendingCount: number; approvedCount: number; creditsEarnedCents: number };
  invoices: BillingInvoice[];
  square: {
    configured: boolean;
    clientConfig: { applicationId: string; locationId: string; environment: "sandbox" | "production" } | null;
    card: { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null } | null;
  };
}

function discountLabel(d: BillingDiscount): string {
  if (d.type === "PERCENTAGE") return `${d.reason} — ${d.valuePercent}% off${d.recurring ? "" : " (next invoice)"}`;
  if (d.type === "CREDIT") return `${d.reason} — ${money(d.valueCents || 0)} credit`;
  return `${d.reason} — ${money(d.valueCents || 0)} off${d.recurring ? "/mo" : " (next invoice)"}`;
}

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = { PAID: "success", ISSUED: "warning", VOID: "default" };

export function BillingTab() {
  const { data, isLoading, mutate } = useApi<BillingData>("/api/business/billing");
  const [changingPlan, setChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function savePlan() {
    if (!selectedPlan) return;
    setSavingPlan(true);
    try {
      await apiPost("/api/business/billing/plan", { planKey: selectedPlan }, "PATCH");
      toast.success("Plan updated");
      setChangingPlan(false);
      mutate();
    } catch (e) {
      if (e instanceof ApiError && e.status === 402) {
        // Server-side gate (billing.ts PATCH /plan) — shouldn't normally hit
        // this since the dialog shows the card form first, but covers the
        // race where a card was removed elsewhere while this dialog was open.
        toast.error("Add a payment method to activate this plan");
        mutate();
      } else {
        toast.error(e instanceof ApiError && e.message === "custom_plan_requires_contacting_support" ? "Contact support to switch to this plan" : "Could not change plan");
      }
    } finally {
      setSavingPlan(false);
    }
  }

  // Card just got saved while a plan change was pending — refresh billing
  // data then immediately retry activating the selected plan, so the user
  // never has to click "Confirm" twice.
  async function handleCardSavedDuringPlanChange() {
    await mutate();
    await savePlan();
  }

  async function toggleAddOn(key: string, active: boolean) {
    setBusyKey(key);
    try {
      await apiPost(`/api/business/billing/addons/${key}/toggle`, { active });
      mutate();
    } catch {
      toast.error("Could not update add-on");
    } finally {
      setBusyKey(null);
    }
  }

  async function purchaseAddOn(key: string, name: string) {
    setBusyKey(key);
    try {
      await apiPost(`/api/business/billing/addons/${key}/purchase`);
      toast.success(`${name} purchased — it'll appear on your next invoice`);
      mutate();
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 409 ? "Already purchased" : "Could not purchase add-on");
    } finally {
      setBusyKey(null);
    }
  }

  async function payNow(invoiceId: string) {
    setBusyKey(invoiceId);
    try {
      await apiPost(`/api/business/billing/invoices/${invoiceId}/pay-now`);
      toast.success("Payment successful");
      mutate();
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 402 ? "That charge didn't go through — check your card details" : "Could not process payment");
    } finally {
      setBusyKey(null);
    }
  }

  function copyReferralLink() {
    if (!data) return;
    navigator.clipboard.writeText(data.referral.link);
    toast.success("Referral link copied");
  }

  if (isLoading || !data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
        <CardContent>
          {data.plan ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{data.plan.name}</p>
                  <p className="text-sm text-slate-500">
                    {money(data.plan.priceCents)}/month
                    {data.plan.minuteAllowance != null && ` · ${data.plan.minuteAllowance} minutes included`}
                    {data.plan.callAllowance != null && ` · ${data.plan.callAllowance} calls included`}
                  </p>
                  {data.billingCycle === "ANNUAL" && (
                    <p className="mt-1 text-xs text-emerald-600">Annual plan{data.annualPaidUntil ? ` — paid until ${new Date(data.annualPaidUntil).toLocaleDateString("en-AU")}` : ""}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => { setSelectedPlan(data.plan?.key || ""); setChangingPlan(true); }}>Change plan</Button>
              </div>

              {data.plan.minuteAllowance != null && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{Math.round(data.plan.minutesUsedThisMonth)} of {data.plan.minuteAllowance} minutes used this month</span>
                    <span className="font-medium text-slate-800">{data.plan.minutesRemaining} remaining</span>
                  </div>
                  {data.plan.pctMinutesUsed != null && data.plan.pctMinutesUsed >= 80 && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      You have used {data.plan.pctMinutesUsed}% of your monthly minutes. Extra minutes will be charged at {money(data.plan.overageCentsPerMinute)}/min.
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500">
                <span>Next billing date: {new Date(data.plan.nextBillingDate).toLocaleDateString("en-AU")}</span>
                {data.plan.setupFeeCents ? (
                  <span className="font-medium text-amber-600">Setup fee {money(data.plan.setupFeeCents)} — unpaid, will appear on your next invoice</span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">No plan assigned yet.</p>
              <Button variant="outline" size="sm" onClick={() => setChangingPlan(true)}>Choose a plan</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SquarePaymentMethodCard configured={data.square.configured} clientConfig={data.square.clientConfig} card={data.square.card} onChanged={mutate} />

      <Card>
        <CardHeader><CardTitle>Add-ons</CardTitle></CardHeader>
        <CardContent className="divide-y divide-slate-100">
          {data.addOns.map((a) =>
            a.frequency === "MONTHLY" ? (
              <ToggleRow
                key={a.key}
                label={`${a.name} — ${money(a.priceCents)}/mo`}
                description={a.description + (a.awaitingBillingConfirmation ? " · Enabled, awaiting billing confirmation" : "")}
                checked={Boolean(a.active)}
                disabled={busyKey === a.key}
                onChange={(v) => toggleAddOn(a.key, v)}
              />
            ) : (
              <div key={a.key} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.name} — {money(a.priceCents)} once</p>
                  <p className="text-xs text-slate-500">{a.description}</p>
                </div>
                {a.purchased ? (
                  <Badge tone="success">purchased</Badge>
                ) : (
                  <Button variant="outline" size="sm" disabled={busyKey === a.key} onClick={() => purchaseAddOn(a.key, a.name)}>Buy</Button>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Discounts</CardTitle></CardHeader>
        <CardContent>
          {data.discounts.length === 0 ? (
            <p className="text-sm text-slate-400">No active discounts.</p>
          ) : (
            <ul className="space-y-2">
              {data.discounts.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="text-slate-700">{discountLabel(d)}</span>
                  {d.expiresAt && <span className="text-xs text-slate-400">expires {new Date(d.expiresAt).toLocaleDateString("en-AU")}</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Refer a business, earn $50</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input readOnly value={data.referral.link} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
            <Button variant="outline" size="sm" onClick={copyReferralLink}><Copy className="h-4 w-4" /></Button>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-slate-400" /><span className="text-slate-500">{data.referral.pendingCount} pending</span></div>
            <div className="text-slate-500">{data.referral.approvedCount} approved</div>
            <div className="font-medium text-emerald-600">{money(data.referral.creditsEarnedCents)} earned</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          {data.invoices.length === 0 ? (
            <EmptyState title="No invoices yet" description="Your first invoice will appear here once generated." />
          ) : (
            <Table>
              <Thead>
                <Tr><Th>Invoice</Th><Th>Period</Th><Th>Amount</Th><Th>Status</Th><Th></Th><Th></Th></Tr>
              </Thead>
              <Tbody>
                {data.invoices.map((inv) => (
                  <Tr key={inv.id}>
                    <Td>{inv.invoiceNumber}</Td>
                    <Td>{new Date(inv.periodStart).toLocaleDateString("en-AU")} – {new Date(inv.periodEnd).toLocaleDateString("en-AU")}</Td>
                    <Td>{money(inv.totalCents)}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[inv.status] || "default"}>{inv.status.toLowerCase()}</Badge>
                      {inv.autoChargeError && inv.status === "ISSUED" && <p className="mt-1 text-[11px] text-rose-500">Card payment failed — try again or pay by bank transfer</p>}
                    </Td>
                    <Td>
                      {inv.status === "ISSUED" && data.square.configured && (
                        <Button size="sm" disabled={busyKey === inv.id} onClick={() => payNow(inv.id)}>{busyKey === inv.id ? "…" : "Pay now"}</Button>
                      )}
                    </Td>
                    <Td>
                      <a href={`/api/business/billing/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </a>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={changingPlan} onOpenChange={setChangingPlan}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change plan</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
              <option value="" disabled>Select a plan…</option>
              {data.availablePlans.map((p) => (
                <option key={p.key} value={p.key} disabled={p.isCustom}>
                  {p.name} — {p.isCustom ? "contact support" : `${money(p.priceCents)}/mo`}
                </option>
              ))}
            </Select>
            {selectedPlan && data.availablePlans.find((p) => p.key === selectedPlan)?.setupFeeCents ? (
              <p className="text-xs text-amber-600">A one-time setup fee of {money(data.availablePlans.find((p) => p.key === selectedPlan)!.setupFeeCents)} applies the first time you switch to this plan.</p>
            ) : null}
            {selectedPlan && !data.square.card ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">To activate your plan, please add a payment method.</p>
                <SquarePaymentMethodCard
                  configured={data.square.configured}
                  clientConfig={data.square.clientConfig}
                  card={data.square.card}
                  onChanged={handleCardSavedDuringPlanChange}
                />
              </div>
            ) : (
              <Button className="w-full" disabled={!selectedPlan || savingPlan} onClick={savePlan}>{savingPlan ? "Saving…" : "Confirm plan change"}</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
