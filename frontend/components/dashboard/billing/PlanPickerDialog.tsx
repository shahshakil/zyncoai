"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, CreditCard, Landmark } from "lucide-react";
import { apiPost, ApiError } from "@/lib/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { SquareCardForm } from "../settings/SquarePaymentMethodCard";
import { BankTransferPanel, CopyField, type BankTransferInfo, type PayPalInfo } from "./PaymentMethodSelector";
import { PayPalSmartButton } from "./PayPalSmartButton";
import { PayPalBrandIcon } from "./CardBrandIcon";
import { formatAUD as money } from "@/lib/money";

interface Plan {
  key: string; name: string; priceCents: number; callAllowance: number | null; minuteAllowance: number | null;
  setupFeeCents: number; overageCentsPerMinute: number; isCustom: boolean;
}
interface SquareInfo {
  configured: boolean;
  clientConfig: { applicationId: string; locationId: string; environment: "sandbox" | "production" } | null;
  card: { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null } | null;
}
interface BillingContact { name: string | null; email: string | null }
type PayMethod = "SQUARE" | "BANK_TRANSFER" | "PAYPAL";
// What a PATCH /plan call returns once an invoice exists for it — shared
// shape whether that invoice ended up PAID instantly (card, or a $0
// already-paid-this-period switch) or ISSUED-and-pending (bank transfer,
// PayPal) — see business/billing.ts's PATCH /plan for the source of truth.
interface PlanChangeResult { ok: boolean; pending?: boolean; planKey?: string; invoice?: { id: string; invoiceNumber: string; totalCents: number } }

type Step = "pick" | "checkout";

// Same math as renderInvoiceHtml.ts / invoiceGenerator.ts — every displayed
// price is GST-inclusive; GST is backed out via /11, never added on top.
function gstBreakdown(totalCents: number) {
  const gstCents = Math.round(totalCents / 11);
  const exGstCents = totalCents - gstCents;
  return { gstCents, exGstCents };
}

export function PlanPickerDialog({
  open, onClose, plans, currentPlanKey, hasExistingPlan, square, billingContact, bankTransfer, paypal, onSaved,
}: {
  open: boolean;
  onClose: () => void;
  plans: Plan[];
  currentPlanKey: string | null;
  hasExistingPlan: boolean;
  square: SquareInfo;
  billingContact?: BillingContact | null;
  bankTransfer: BankTransferInfo;
  paypal: PayPalInfo;
  onSaved: () => void;
}) {
  const [step, setStep] = useState<Step>("pick");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Pending-payment invoices created mid-checkout (Bank Transfer / PayPal
  // both issue a real invoice before anything activates) — held here so
  // their details/button can render inside the still-open dialog instead of
  // closing immediately on a bare toast.
  const [bankInvoice, setBankInvoice] = useState<{ id: string; invoiceNumber: string; totalCents: number } | null>(null);
  const [payingByPayPal, setPayingByPayPal] = useState(false);
  const [paypalInvoice, setPaypalInvoice] = useState<{ id: string; invoiceNumber: string; totalCents: number } | null>(null);

  const selectable = plans.filter((p) => !p.isCustom);
  const mostPopularKey = selectable.length > 1 ? selectable[1].key : null;
  const selected = plans.find((p) => p.key === selectedKey) || null;

  function close() {
    setStep("pick");
    setSelectedKey(null);
    setBankInvoice(null);
    setPaypalInvoice(null);
    onClose();
  }

  function pick(key: string) {
    setSelectedKey(key);
    setBankInvoice(null);
    setPaypalInvoice(null);
    setStep("checkout");
  }

  // CARD is the only path that both charges AND activates synchronously, so
  // it's still the one case where "success" always means "close now."
  async function confirm() {
    if (!selected) return;
    setSaving(true);
    try {
      const result = await apiPost<PlanChangeResult>("/api/business/billing/plan", { planKey: selected.key, paymentMethod: "SQUARE" }, "PATCH");
      toast.success(result.pending ? "Invoice issued — your plan activates once payment is confirmed" : "Plan activated");
      close();
      onSaved();
    } catch (e) {
      if (e instanceof ApiError && e.message === "charge_failed") {
        toast.error("That card was declined — try a different card, or pay by bank transfer instead");
      } else if (e instanceof ApiError && e.status === 402) {
        toast.error("Add a payment method to activate this plan");
        onSaved();
      } else {
        toast.error(e instanceof ApiError && e.message === "custom_plan_requires_contacting_support" ? "Contact support to switch to this plan" : "Could not change plan");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCardSaved() {
    onSaved();
    await confirm();
  }

  // BANK_TRANSFER and PAYPAL both issue a real invoice that ISN'T paid yet
  // (unless this exact billing period was already paid for — see
  // CheckoutSummary's "no extra charge now" case — in which case the
  // backend activates it instantly just like Card does, and this closes the
  // same way confirm() does). The pending case stays open and shows what
  // the buyer needs: our bank details + the real reference for Bank
  // Transfer, or the live gold button for PayPal.
  async function confirmBankTransfer() {
    if (!selected) return;
    setSaving(true);
    try {
      const result = await apiPost<PlanChangeResult>("/api/business/billing/plan", { planKey: selected.key, paymentMethod: "BANK_TRANSFER" }, "PATCH");
      if (result.pending && result.invoice) {
        setBankInvoice(result.invoice);
        onSaved();
      } else {
        toast.success("Plan activated");
        close();
        onSaved();
      }
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 402 ? "Add a payment method to activate this plan" : "Could not issue invoice — please try again");
    } finally {
      setSaving(false);
    }
  }

  async function confirmPayPal() {
    if (!selected) return;
    setPayingByPayPal(true);
    try {
      const result = await apiPost<PlanChangeResult>("/api/business/billing/plan", { planKey: selected.key, paymentMethod: "PAYPAL" }, "PATCH");
      if (result.pending && result.invoice) {
        setPaypalInvoice(result.invoice);
        onSaved();
      } else {
        toast.success("Plan activated");
        close();
        onSaved();
      }
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 402 ? "Add a payment method to activate this plan" : "Could not issue invoice — please try again");
    } finally {
      setPayingByPayPal(false);
    }
  }

  function handlePayPalCaptured() {
    toast.success("Plan activated with PayPal");
    close();
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent className={step === "pick" ? "max-w-3xl" : "max-w-md"}>
        {step === "pick" ? (
          <>
            <DialogHeader><DialogTitle>{hasExistingPlan ? "Change your plan" : "Choose a plan"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectable.map((p) => {
                const isCurrent = p.key === currentPlanKey;
                const isPopular = p.key === mostPopularKey && !isCurrent;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => !isCurrent && pick(p.key)}
                    disabled={isCurrent}
                    className={`relative flex flex-col rounded-2xl border p-5 pt-6 text-left transition ${
                      isCurrent ? "cursor-default border-[var(--accent,#4f46e5)] bg-[var(--accent-soft,#EEF2FF)]" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent,#4f46e5)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Most popular
                      </span>
                    )}
                    {isCurrent && <Badge tone="success" className="absolute -top-2.5 right-4">Current plan</Badge>}
                    <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {money(p.priceCents)}
                      <span className="text-sm font-normal text-slate-400">/mo</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {p.minuteAllowance != null ? `${p.minuteAllowance} minutes included` : p.callAllowance != null ? `${p.callAllowance} calls included` : "Usage included"}
                      </li>
                      {p.minuteAllowance != null && p.overageCentsPerMinute > 0 && (
                        <li className="flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {money(p.overageCentsPerMinute)}/min after that
                        </li>
                      )}
                      {p.setupFeeCents > 0 && (
                        <li className="flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {money(p.setupFeeCents)} one-time setup (first time only)
                        </li>
                      )}
                    </ul>
                    {!isCurrent && <span className="mt-4 text-xs font-semibold text-[var(--accent,#4f46e5)]">Select →</span>}
                  </button>
                );
              })}
            </div>
          </>
        ) : selected ? (
          <CheckoutSummary
            plan={selected}
            hasExistingPlan={hasExistingPlan}
            square={square}
            billingContact={billingContact}
            bankTransfer={bankTransfer}
            paypal={paypal}
            saving={saving}
            payingByPayPal={payingByPayPal}
            bankInvoice={bankInvoice}
            paypalInvoice={paypalInvoice}
            onBack={() => setStep("pick")}
            onConfirm={confirm}
            onConfirmBankTransfer={confirmBankTransfer}
            onConfirmPayPal={confirmPayPal}
            onPayPalCaptured={handlePayPalCaptured}
            onCardSaved={handleCardSaved}
            onDoneWithBankDetails={() => { close(); onSaved(); }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutSummary({
  plan, hasExistingPlan, square, billingContact, bankTransfer, paypal, saving, payingByPayPal, bankInvoice, paypalInvoice,
  onBack, onConfirm, onConfirmBankTransfer, onConfirmPayPal, onPayPalCaptured, onCardSaved, onDoneWithBankDetails,
}: {
  plan: Plan;
  hasExistingPlan: boolean;
  square: SquareInfo;
  billingContact?: BillingContact | null;
  bankTransfer: BankTransferInfo;
  paypal: PayPalInfo;
  saving: boolean;
  payingByPayPal: boolean;
  bankInvoice: { id: string; invoiceNumber: string; totalCents: number } | null;
  paypalInvoice: { id: string; invoiceNumber: string; totalCents: number } | null;
  onBack: () => void;
  onConfirm: () => void;
  onConfirmBankTransfer: () => void;
  onConfirmPayPal: () => void;
  onPayPalCaptured: () => void;
  onCardSaved: () => void;
  onDoneWithBankDetails: () => void;
}) {
  const totalTodayCents = plan.priceCents + plan.setupFeeCents; // first-ever activation only
  const { gstCents, exGstCents } = gstBreakdown(plan.priceCents);
  // A pending Bank Transfer or PayPal invoice already issued mid-checkout —
  // the payment-method tabs step aside for its own confirmation view rather
  // than staying interactive underneath it (switching methods once a real
  // invoice already exists is exactly what PATCH /plan's own
  // pendingActivationInvoiceId-void handles on the NEXT pick, not something
  // this dialog needs to re-offer mid-flow).
  const [method, setMethod] = useState<PayMethod>("SQUARE");

  return (
    <>
      <DialogHeader><DialogTitle>Confirm your plan</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
            <p className="text-sm font-semibold text-slate-900">{money(plan.priceCents)}/mo</p>
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex justify-between"><span>Subtotal (ex. GST)</span><span>{money(exGstCents)}</span></div>
            <div className="flex justify-between"><span>GST (10%)</span><span>{money(gstCents)}</span></div>
            {plan.setupFeeCents > 0 && (
              <div className="flex justify-between"><span>One-time setup fee</span><span>{money(plan.setupFeeCents)}</span></div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          {hasExistingPlan ? (
            <>
              <div className="flex justify-between font-semibold text-slate-900"><span>Total today</span><span>{money(0)}</span></div>
              <p className="mt-1 text-xs text-slate-500">
                Your new plan takes effect immediately. Since you&apos;ve already paid for this billing period, there&apos;s no extra charge now — the new price starts next cycle ({money(plan.priceCents)}/mo).
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between font-semibold text-slate-900"><span>Total today</span><span>{money(totalTodayCents)}</span></div>
              <p className="mt-1 text-xs text-slate-500">Then {money(plan.priceCents)}/month, billed on the 1st.</p>
            </>
          )}
        </div>

        {bankInvoice ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
              Invoice <span className="font-semibold">{bankInvoice.invoiceNumber}</span> issued for {money(bankInvoice.totalCents)}. Your plan activates when your payment is received and confirmed.
            </div>
            <BankTransferPanel info={bankTransfer} />
            <CopyField label="Payment reference" value={bankInvoice.invoiceNumber} />
            <Button className="h-11 min-h-[44px] w-full" onClick={onDoneWithBankDetails}>Done</Button>
          </div>
        ) : paypalInvoice ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PayPalBrandIcon className="h-6 w-9 shrink-0" />
              <p className="text-sm text-slate-500">
                Invoice <span className="font-medium text-slate-700">{paypalInvoice.invoiceNumber}</span> ({money(paypalInvoice.totalCents)}) — pay below to activate instantly.
              </p>
            </div>
            <PayPalSmartButton clientId={paypal.clientId!} invoiceId={paypalInvoice.id} onPaid={onPayPalCaptured} />
          </div>
        ) : (
          <div className="space-y-3">
            <Tabs value={method} onValueChange={(v) => setMethod(v as PayMethod)}>
              <TabsList>
                <TabsTrigger value="SQUARE" className="gap-1.5">
                  <CreditCard className="h-4 w-4" /> Card <Badge tone="success" className="ml-0.5 text-[9px]">Recommended</Badge>
                </TabsTrigger>
                <TabsTrigger value="BANK_TRANSFER" disabled={!bankTransfer.configured} className="gap-1.5 disabled:cursor-not-allowed disabled:opacity-50">
                  <Landmark className="h-4 w-4" /> Bank Transfer
                </TabsTrigger>
                <TabsTrigger value="PAYPAL" disabled={!paypal.configured} className="gap-1.5 disabled:cursor-not-allowed disabled:opacity-50">
                  <PayPalBrandIcon className="h-4 w-6 rounded-sm" /> PayPal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="SQUARE" className="space-y-3 pt-1">
                {square.card ? (
                  <p className="text-xs text-slate-500">
                    Charged automatically to {square.card.brand} ending in {square.card.last4} — activates instantly.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-slate-500">Charges the moment you add a card — activates instantly. This card also auto-renews the plan every month.</p>
                    <SquareCardForm configured={square.configured} clientConfig={square.clientConfig} card={square.card} billingContact={billingContact} onChanged={onCardSaved} />
                  </>
                )}
                {square.card && (
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="h-11 min-h-[44px]" onClick={onBack}>Back</Button>
                    <Button className="h-11 min-h-[44px] flex-1" disabled={saving} onClick={onConfirm}>{saving ? "Confirming…" : "Confirm"}</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="BANK_TRANSFER" className="space-y-3 pt-1">
                {bankTransfer.configured ? (
                  <>
                    <p className="text-xs text-slate-500">
                      We&apos;ll issue an invoice with our bank details and a payment reference — no card needed. Your plan activates when your payment is received and confirmed (usually 1–2 business days).
                    </p>
                    <Button className="h-11 min-h-[44px] w-full" disabled={saving} onClick={onConfirmBankTransfer}>
                      {saving ? "Issuing invoice…" : "Pay by bank transfer"}
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Bank transfer is temporarily unavailable.</p>
                )}
              </TabsContent>

              <TabsContent value="PAYPAL" className="space-y-3 pt-1">
                {paypal.configured ? (
                  <>
                    <p className="text-xs text-slate-500">
                      We&apos;ll issue an invoice payable via PayPal&apos;s gold button — no card needed. Your plan activates the moment PayPal confirms your payment.
                    </p>
                    <Button className="h-11 min-h-[44px] w-full" disabled={payingByPayPal} onClick={onConfirmPayPal}>
                      {payingByPayPal ? "Issuing invoice…" : "Continue with PayPal"}
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">PayPal isn&apos;t set up on this account yet.</p>
                )}
              </TabsContent>
            </Tabs>

            {!(method === "SQUARE" && square.card) && (
              <Button variant="outline" className="h-11 min-h-[44px] w-full" onClick={onBack}>Back</Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
