"use client";
import { useState } from "react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { AlertTriangle, Bell, Copy, Download, Gift, Package } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Select } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ToggleRow } from "../ui/toggle";
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from "../ui/table";
import { SquarePaymentMethodCard } from "../settings/SquarePaymentMethodCard";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
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
  reason: string; source: string; recurring: boolean; expiresAt: string | null; appliesToSetupFee: boolean;
}
interface BillingInvoice {
  id: string; invoiceNumber: string; planName: string; periodStart: string; periodEnd: string; totalCents: number; status: string; issuedAt: string; dueDate: string;
  paidVia: "BANK_TRANSFER" | "SQUARE" | "PAYPAL" | "BPAY" | null; autoChargeError: string | null;
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
  preferredPaymentMethod: "SQUARE" | "BANK_TRANSFER" | "PAYPAL" | "BPAY" | null;
  square: {
    configured: boolean;
    clientConfig: { applicationId: string; locationId: string; environment: "sandbox" | "production" } | null;
    card: { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null } | null;
  };
  bankTransfer: { bankName: string | null; bankAccountName: string | null; bankBsb: string | null; bankAccountNumber: string | null; configured: boolean };
  bpay: { billerCode: string | null; reference: string; configured: boolean };
  paypal: { configured: boolean; clientId: string | null; environment: "sandbox" | "production" | null; subscriptionActive: boolean; payerEmail: string | null };
}

function discountLabel(d: BillingDiscount): string {
  if (d.appliesToSetupFee) {
    if (d.type === "PERCENTAGE" && d.valuePercent === 100) return `${d.reason} — setup fee waiver (100%)`;
    if (d.type === "PERCENTAGE") return `${d.reason} — setup fee discount (${d.valuePercent}% off)`;
    return `${d.reason} — setup fee discount (${money(d.valueCents || 0)} off)`;
  }
  if (d.type === "PERCENTAGE") return `${d.reason} — ${d.valuePercent}% off${d.recurring ? ", applied automatically" : " (next invoice only)"}`;
  if (d.type === "CREDIT") return `${d.reason} — ${money(d.valueCents || 0)} credit`;
  return `${d.reason} — ${money(d.valueCents || 0)} off${d.recurring ? "/mo, applied automatically" : " (next invoice only)"}`;
}

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "default"> = { PAID: "success", ISSUED: "warning", VOID: "default" };

// Green 0-60%, yellow 60-80%, red 80-100% — a deliberately different
// threshold from platform-admin's UsageProgressBar (green<80/amber 80-100),
// per this page's own spec; not the same convention as the admin view.
function usageColorFor(pct: number): string {
  if (pct >= 80) return "#EF4444";
  if (pct >= 60) return "#F59E0B";
  return "#10B981";
}

function MinutesProgressBar({ used, total, pct }: { used: number; total: number; pct: number }) {
  const color = usageColorFor(pct);
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <span>{Math.round(used)} of {total} minutes used</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
    </div>
  );
}

export function BillingPageContent() {
  const { business } = useDashboard();
  const theme = getVerticalTheme(business.vertical);
  const { data, isLoading, mutate } = useApi<BillingData>("/api/business/billing");
  const [changingPlan, setChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
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
        toast.error("Add a payment method to activate this plan");
        mutate();
      } else {
        toast.error(e instanceof ApiError && e.message === "custom_plan_requires_contacting_support" ? "Contact support to switch to this plan" : "Could not change plan");
      }
    } finally {
      setSavingPlan(false);
    }
  }

  async function handleCardSavedDuringPlanChange() {
    await mutate();
    await savePlan();
  }

  async function cancelPlan() {
    setCancelling(true);
    try {
      await apiPost("/api/business/billing/cancel-plan");
      toast.success("Plan cancelled");
      setConfirmCancel(false);
      mutate();
    } catch {
      toast.error("Could not cancel your plan — contact support");
    } finally {
      setCancelling(false);
    }
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

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const overUsage = data.plan?.pctMinutesUsed != null && data.plan.pctMinutesUsed >= 80;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Billing &amp; Subscription</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your plan, payment method and invoices.</p>
      </div>

      {/* Section 1 — Plan overview */}
      <Card>
        <CardHeader><CardTitle>Plan Overview</CardTitle></CardHeader>
        <CardContent>
          {data.plan ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{data.plan.name}</p>
                  <p className="text-sm text-slate-500">
                    {money(data.plan.priceCents)}/month
                    {data.plan.callAllowance != null && ` · ${data.plan.callAllowance} calls included`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Next billing date: {new Date(data.plan.nextBillingDate).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
                  {data.billingCycle === "ANNUAL" && (
                    <p className="mt-1 text-xs text-emerald-600">Annual plan{data.annualPaidUntil ? ` — paid until ${new Date(data.annualPaidUntil).toLocaleDateString("en-AU")}` : ""}</p>
                  )}
                  {data.plan.setupFeeCents ? (
                    <p className="mt-1 text-xs font-medium text-amber-600">Setup fee {money(data.plan.setupFeeCents)} — unpaid, will appear on your next invoice</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <Button size="lg" className="h-11 min-h-[44px]" onClick={() => { setSelectedPlan(data.plan?.key || ""); setChangingPlan(true); }}>Upgrade Plan</Button>
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                    onClick={() => setConfirmCancel(true)}
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>

              {data.plan.minuteAllowance != null && (
                <MinutesProgressBar
                  used={data.plan.minutesUsedThisMonth}
                  total={data.plan.minuteAllowance}
                  pct={data.plan.pctMinutesUsed ?? 0}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">No plan assigned yet.</p>
              <Button size="lg" className="h-11 min-h-[44px]" onClick={() => setChangingPlan(true)}>Choose a plan</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2 — Usage alert banner */}
      {overUsage && data.plan && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm text-amber-800">
              You have used <span className="font-semibold">{data.plan.pctMinutesUsed}%</span> of your monthly minutes.
              Extra minutes charged at {money(data.plan.overageCentsPerMinute)}/min. Consider upgrading your plan.
            </p>
          </div>
          <Button size="lg" className="h-11 min-h-[44px] shrink-0" onClick={() => { setSelectedPlan(data.plan?.key || ""); setChangingPlan(true); }}>Upgrade Now</Button>
        </div>
      )}

      {/* Section 3 — Payment method */}
      <PaymentMethodSelector
        preferredPaymentMethod={data.preferredPaymentMethod}
        square={data.square}
        bankTransfer={data.bankTransfer}
        bpay={data.bpay}
        paypal={data.paypal}
        hasPlan={Boolean(data.plan)}
        onChanged={mutate}
      />

      {/* Section 4 — Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Enhance your plan</CardTitle>
          <p className="text-xs text-slate-500">Add features tailored for {theme.label} businesses.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.addOns.map((a) => (
            <div key={a.key} className="flex flex-col justify-between rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-2.5">
                {a.frequency === "MONTHLY" ? (
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                ) : (
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.name}</p>
                  <p className="text-xs font-semibold text-slate-600">{money(a.priceCents)}{a.frequency === "MONTHLY" ? "/month" : " once"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.description}
                    {a.awaitingBillingConfirmation ? " · Enabled, awaiting billing confirmation" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                {a.frequency === "MONTHLY" ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(a.active)}
                    disabled={busyKey === a.key}
                    onClick={() => toggleAddOn(a.key, !a.active)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${a.active ? "bg-[var(--accent,#4f46e5)]" : "bg-slate-200"} ${busyKey === a.key ? "opacity-50" : ""}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${a.active ? "left-5" : "left-0.5"}`} />
                  </button>
                ) : a.purchased ? (
                  <Badge tone="success">purchased</Badge>
                ) : (
                  <Button variant="outline" size="lg" className="h-11 min-h-[44px]" disabled={busyKey === a.key} onClick={() => purchaseAddOn(a.key, a.name)}>Buy Now</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 5 — Invoices */}
      <Card>
        <CardHeader><CardTitle>Invoice History</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {data.invoices.length === 0 ? (
            <EmptyState title="No invoices yet" description="Your first invoice will appear after your trial ends." />
          ) : (
            <Table>
              <Thead>
                <Tr><Th>Date</Th><Th>Description</Th><Th>Amount AUD</Th><Th>Status</Th><Th></Th><Th></Th></Tr>
              </Thead>
              <Tbody>
                {data.invoices.map((inv) => (
                  <Tr key={inv.id}>
                    <Td>{new Date(inv.issuedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</Td>
                    <Td>{inv.planName} — {new Date(inv.periodStart).toLocaleDateString("en-AU", { month: "long" })}</Td>
                    <Td>{money(inv.totalCents)}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[inv.status] || "default"}>{inv.status === "PAID" ? "✅ Paid" : inv.status.toLowerCase()}</Badge>
                      {inv.autoChargeError && inv.status === "ISSUED" && <p className="mt-1 text-[11px] text-rose-500">Card payment failed — try again or pay by bank transfer</p>}
                    </Td>
                    <Td>
                      {inv.status === "ISSUED" && data.square.configured && (
                        <Button size="sm" disabled={busyKey === inv.id} onClick={() => payNow(inv.id)}>{busyKey === inv.id ? "…" : "Pay now"}</Button>
                      )}
                    </Td>
                    <Td>
                      <a href={`/api/business/billing/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /> PDF</Button>
                      </a>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Section 6 — Referral program */}
      <Card>
        <CardHeader><CardTitle>Refer a business, earn {money(5000)}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input readOnly value={data.referral.link} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
            <Button variant="outline" size="lg" className="h-11 min-h-[44px] shrink-0" onClick={copyReferralLink}><Copy className="h-4 w-4" /> Copy</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-slate-400" /><span className="text-slate-500">{data.referral.pendingCount} pending referrals</span></div>
            <div className="text-slate-500">{data.referral.approvedCount} approved referrals</div>
            <div className="font-medium text-emerald-600">{money(data.referral.creditsEarnedCents)} total earned</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7 — Active discounts (only if any exist) */}
      {data.discounts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Active discounts on your account</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.discounts.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="text-slate-700">{discountLabel(d)}</span>
                  {d.expiresAt && <span className="text-xs text-slate-400">expires {new Date(d.expiresAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Dialog open={changingPlan} onOpenChange={setChangingPlan}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upgrade plan</DialogTitle></DialogHeader>
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
              <Button className="h-11 min-h-[44px] w-full" disabled={!selectedPlan || savingPlan} onClick={savePlan}>{savingPlan ? "Saving…" : "Confirm plan change"}</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel your plan?</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              This stops future invoices from being generated. Anything already issued still needs to be paid.
              You can choose a new plan at any time to reactivate billing.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" className="h-11 min-h-[44px]" disabled={cancelling} onClick={cancelPlan}>{cancelling ? "Cancelling…" : "Yes, cancel plan"}</Button>
              <Button variant="outline" className="h-11 min-h-[44px]" onClick={() => setConfirmCancel(false)}>Keep my plan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function trackBillingPageViewed() {
  posthog.capture("billing_page_viewed", {});
}
