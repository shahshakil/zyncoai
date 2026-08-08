"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Landmark } from "lucide-react";
import { apiPost, ApiError } from "@/lib/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SquareCardForm } from "../settings/SquarePaymentMethodCard";
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
interface BankTransferInfo {
  configured: boolean;
}

type Step = "pick" | "checkout";

// Same math as renderInvoiceHtml.ts / invoiceGenerator.ts — every displayed
// price is GST-inclusive; GST is backed out via /11, never added on top.
function gstBreakdown(totalCents: number) {
  const gstCents = Math.round(totalCents / 11);
  const exGstCents = totalCents - gstCents;
  return { gstCents, exGstCents };
}

export function PlanPickerDialog({
  open, onClose, plans, currentPlanKey, hasExistingPlan, square, bankTransfer, onSaved,
}: {
  open: boolean;
  onClose: () => void;
  plans: Plan[];
  currentPlanKey: string | null;
  hasExistingPlan: boolean;
  square: SquareInfo;
  bankTransfer: BankTransferInfo;
  onSaved: () => void;
}) {
  const [step, setStep] = useState<Step>("pick");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectable = plans.filter((p) => !p.isCustom);
  const mostPopularKey = selectable.length > 1 ? selectable[1].key : null;
  const selected = plans.find((p) => p.key === selectedKey) || null;

  function close() {
    setStep("pick");
    setSelectedKey(null);
    onClose();
  }

  function pick(key: string) {
    setSelectedKey(key);
    setStep("checkout");
  }

  async function confirm(paymentMethod?: "BANK_TRANSFER") {
    if (!selected) return;
    setSaving(true);
    try {
      const result = await apiPost<{ ok: boolean; pending?: boolean }>(
        "/api/business/billing/plan",
        { planKey: selected.key, ...(paymentMethod ? { paymentMethod } : {}) },
        "PATCH"
      );
      // Payment-first: a card charge activates instantly, but a
      // bank-transfer pick never does — the plan only goes live once an
      // admin confirms the transfer arrived (result.pending distinguishes
      // the two; both are 200s, this isn't an error path).
      toast.success(result.pending ? "Invoice issued — your plan activates once we receive your transfer" : "Plan activated");
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
            bankTransfer={bankTransfer}
            saving={saving}
            onBack={() => setStep("pick")}
            onConfirm={() => confirm()}
            onConfirmBankTransfer={() => confirm("BANK_TRANSFER")}
            onCardSaved={handleCardSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutSummary({
  plan, hasExistingPlan, square, bankTransfer, saving, onBack, onConfirm, onConfirmBankTransfer, onCardSaved,
}: {
  plan: Plan;
  hasExistingPlan: boolean;
  square: SquareInfo;
  bankTransfer: BankTransferInfo;
  saving: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onConfirmBankTransfer: () => void;
  onCardSaved: () => void;
}) {
  const totalTodayCents = plan.priceCents + plan.setupFeeCents; // first-ever activation only
  const { gstCents, exGstCents } = gstBreakdown(plan.priceCents);

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

        {square.card ? (
          <p className="text-xs text-slate-500">
            Payment method: {square.card.brand} ending in {square.card.last4} — charged automatically.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Choose how to pay:</p>
            <SquareCardForm configured={square.configured} clientConfig={square.clientConfig} card={square.card} onChanged={onCardSaved} />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" /> or <div className="h-px flex-1 bg-slate-200" />
            </div>
            <button
              type="button"
              onClick={onConfirmBankTransfer}
              disabled={saving || !bankTransfer.configured}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Landmark className="h-4 w-4 shrink-0 text-slate-400" />
              <span>
                <span className="font-medium text-slate-900">Pay by bank transfer</span>
                {bankTransfer.configured ? (
                  <span className="block text-xs text-slate-400">We&apos;ll issue an invoice with our bank details and a payment reference — no card needed. Your plan activates as soon as we confirm the transfer.</span>
                ) : (
                  <span className="block text-xs text-slate-400">Temporarily unavailable.</span>
                )}
              </span>
            </button>
          </div>
        )}

        {square.card && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="h-11 min-h-[44px]" onClick={onBack}>Back</Button>
            <Button className="h-11 min-h-[44px] flex-1" disabled={saving} onClick={onConfirm}>{saving ? "Confirming…" : "Confirm"}</Button>
          </div>
        )}
        {!square.card && (
          <Button variant="outline" className="h-11 min-h-[44px] w-full" onClick={onBack}>Back</Button>
        )}
      </div>
    </>
  );
}
