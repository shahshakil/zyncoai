"use client";
import { useState } from "react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { AlertTriangle, Bell, Calendar, Copy, Download, Gift, Package } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ToggleRow } from "../ui/toggle";
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from "../ui/table";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PlanPickerDialog } from "./PlanPickerDialog";
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
  // Real catalog entry, no working feature behind it yet — never rendered
  // as purchasable (see addOnCatalog.ts's header comment on this flag).
  comingSoon?: boolean;
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
  cancelEffectiveAt: string | null;
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
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function cancelPlan() {
    setCancelling(true);
    try {
      await apiPost("/api/business/billing/cancel-plan");
      toast.success("Cancellation scheduled — your plan stays active until the end of this period");
      setConfirmCancel(false);
      mutate();
    } catch {
      toast.error("Could not cancel your plan — contact support");
    } finally {
      setCancelling(false);
    }
  }

  async function undoCancel() {
    setCancelling(true);
    try {
      await apiPost("/api/business/billing/cancel-plan/undo");
      toast.success("Cancellation undone — your plan will continue as normal");
      mutate();
    } catch {
      toast.error("Could not undo cancellation — contact support");
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{data.plan.name}</p>
                  <p className="text-sm text-slate-500">
                    {money(data.plan.priceCents)}/month
                    {data.plan.callAllowance != null && ` · ${data.plan.callAllowance} calls included`}
                  </p>
                  {data.billingCycle === "ANNUAL" && (
                    <p className="mt-1 text-xs text-emerald-600">Annual plan{data.annualPaidUntil ? ` — paid until ${new Date(data.annualPaidUntil).toLocaleDateString("en-AU")}` : ""}</p>
                  )}
                  {data.plan.setupFeeCents ? (
                    <p className="mt-1 text-xs font-medium text-amber-600">Setup fee {money(data.plan.setupFeeCents)} — unpaid, will appear on your next invoice</p>
                  ) : null}
                </div>

                {/* Always-visible next-billing stat, Zapier-style — was a
                    buried small-text line before, now the second most
                    prominent thing on the page after the plan name. */}
                {!data.cancelEffectiveAt && (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:shrink-0">
                    <Calendar className="h-5 w-5 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Next billing</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(data.plan.nextBillingDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} · {money(data.plan.priceCents)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <Button size="lg" className="h-11 min-h-[44px]" onClick={() => setChangingPlan(true)}>Upgrade Plan</Button>
                  {!data.cancelEffectiveAt && (
                    <button
                      type="button"
                      className="text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                      onClick={() => setConfirmCancel(true)}
                    >
                      Cancel Plan
                    </button>
                  )}
                </div>
              </div>

              {data.cancelEffectiveAt && (
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">
                    Your plan ends on <span className="font-semibold text-slate-900">{new Date(data.cancelEffectiveAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span> — no refund for the current period, but Ella keeps answering calls until then.
                  </p>
                  <Button variant="outline" size="lg" className="h-11 min-h-[44px] shrink-0" disabled={cancelling} onClick={undoCancel}>{cancelling ? "…" : "Undo cancellation"}</Button>
                </div>
              )}

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

      {/* Section 2 — Usage alert banner. Informational only, not its own
          "Upgrade" CTA — the Plan Overview card above is the single upgrade
          entry point; a second identical button here read as a duplicate. */}
      {overUsage && data.plan && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            You have used <span className="font-semibold">{data.plan.pctMinutesUsed}%</span> of your monthly minutes.
            Extra minutes charged at {money(data.plan.overageCentsPerMinute)}/min. Use the Upgrade Plan button above if you&apos;d like more included minutes.
          </p>
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
          {data.addOns.filter((a) => !a.comingSoon).map((a) => (
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

      <PlanPickerDialog
        open={changingPlan}
        onClose={() => setChangingPlan(false)}
        plans={data.availablePlans}
        currentPlanKey={data.plan?.key ?? null}
        hasExistingPlan={Boolean(data.plan)}
        square={data.square}
        onSaved={mutate}
      />

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel your plan?</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Your plan stays active through the end of your current billing period — Ella keeps answering calls and you won&apos;t be charged again after that.
              We don&apos;t offer partial refunds for the current period. You can undo this at any time before then.
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
