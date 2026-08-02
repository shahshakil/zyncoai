"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Landmark, Wallet, Receipt, Copy, CheckCircle2 } from "lucide-react";
import { apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { SquareCardForm } from "../settings/SquarePaymentMethodCard";

type Method = "SQUARE" | "BANK_TRANSFER" | "PAYPAL" | "BPAY";

interface SquareClientConfig { applicationId: string; locationId: string; environment: "sandbox" | "production" }
interface SavedCard { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null }
interface BankTransferInfo { bankName: string | null; bankAccountName: string | null; bankBsb: string | null; bankAccountNumber: string | null; configured: boolean }
interface BpayInfo { billerCode: string | null; reference: string; configured: boolean }
interface PayPalInfo { configured: boolean; clientId: string | null; environment: "sandbox" | "production" | null; subscriptionActive: boolean; payerEmail: string | null }

const METHODS: { key: Method; label: string; icon: typeof CreditCard }[] = [
  { key: "SQUARE", label: "Credit / Debit Card", icon: CreditCard },
  { key: "BANK_TRANSFER", label: "Bank Transfer", icon: Landmark },
  { key: "PAYPAL", label: "PayPal", icon: Wallet },
  { key: "BPAY", label: "BPAY", icon: Receipt },
];

function copyToClipboard(value: string, label: string) {
  navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
}

function BankTransferPanel({ info }: { info: BankTransferInfo }) {
  if (!info.configured) {
    return <p className="text-sm text-slate-500">Bank transfer details aren&apos;t set up on this account yet — contact support.</p>;
  }
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
        <div>
          <p className="text-xs text-slate-400">Account name</p>
          <p className="font-medium text-slate-900">{info.bankAccountName}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs text-slate-400">BSB</p>
          <div className="flex items-center justify-between"><p className="font-medium text-slate-900">{info.bankBsb}</p><button onClick={() => copyToClipboard(info.bankBsb || "", "BSB")}><Copy className="h-3.5 w-3.5 text-slate-400" /></button></div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs text-slate-400">Account number</p>
          <div className="flex items-center justify-between"><p className="font-medium text-slate-900">{info.bankAccountNumber}</p><button onClick={() => copyToClipboard(info.bankAccountNumber || "", "Account number")}><Copy className="h-3.5 w-3.5 text-slate-400" /></button></div>
        </div>
      </div>
      <p className="text-xs text-slate-500">{info.bankName} · Reference each payment with your invoice number (shown on every invoice) so it&apos;s matched automatically.</p>
    </div>
  );
}

function BpayPanel({ info }: { info: BpayInfo }) {
  if (!info.configured) {
    return <p className="text-sm text-slate-500">BPAY isn&apos;t set up on this account yet — contact support.</p>;
  }
  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs text-slate-400">Biller code</p>
          <div className="flex items-center justify-between"><p className="font-medium text-slate-900">{info.billerCode}</p><button onClick={() => copyToClipboard(info.billerCode || "", "Biller code")}><Copy className="h-3.5 w-3.5 text-slate-400" /></button></div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs text-slate-400">Reference</p>
          <div className="flex items-center justify-between"><p className="font-medium text-slate-900">{info.reference}</p><button onClick={() => copyToClipboard(info.reference, "Reference")}><Copy className="h-3.5 w-3.5 text-slate-400" /></button></div>
        </div>
      </div>
      <p className="text-xs text-slate-500">Pay via internet banking — search &quot;BPAY&quot; in your bank&apos;s app, then enter the biller code and reference above. This reference stays the same every month.</p>
    </div>
  );
}

declare global {
  interface Window {
    paypal?: any;
  }
}
const paypalSdkPromises = new Map<string, Promise<void>>();
function loadPayPalSdk(clientId: string): Promise<void> {
  const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&currency=AUD`;
  if (paypalSdkPromises.has(src)) return paypalSdkPromises.get(src)!;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("paypal_sdk_load_failed"));
    document.head.appendChild(script);
  });
  paypalSdkPromises.set(src, promise);
  return promise;
}

function PayPalPanel({ info, hasPlan, onChanged }: { info: PayPalInfo; hasPlan: boolean; onChanged: () => void }) {
  const [cancelling, setCancelling] = useState(false);
  const [rendering, setRendering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function cancel() {
    setCancelling(true);
    try {
      await apiPost("/api/business/billing/paypal/cancel");
      toast.success("PayPal billing cancelled");
      onChanged();
    } catch {
      toast.error("Could not cancel PayPal billing");
    } finally {
      setCancelling(false);
    }
  }

  useEffect(() => {
    if (!info.configured || info.subscriptionActive || !hasPlan || !info.clientId) return;
    let cancelled = false;
    setRendering(true);
    (async () => {
      try {
        const { planId } = await apiPost<{ planId: string }>("/api/business/billing/paypal/plan");
        await loadPayPalSdk(info.clientId!);
        if (cancelled || !window.paypal || !containerRef.current) return;
        containerRef.current.innerHTML = "";
        window.paypal
          .Buttons({
            style: { shape: "pill", color: "gold", layout: "horizontal", label: "subscribe" },
            createSubscription: (_data: any, actions: any) => actions.subscription.create({ plan_id: planId }),
            onApprove: async (data: any) => {
              try {
                await apiPost("/api/business/billing/paypal/subscription-approved", { subscriptionId: data.subscriptionID });
                toast.success("PayPal connected — billed automatically each month");
                onChanged();
              } catch {
                toast.error("PayPal approved the subscription, but we couldn't confirm it — contact support");
              }
            },
            onError: (err: any) => {
              console.error("[PayPalPanel] Buttons error:", err);
              toast.error("PayPal checkout failed — please try again");
            },
          })
          .render(containerRef.current);
      } catch (err) {
        console.error("[PayPalPanel] setup failed:", err);
        toast.error("Could not load PayPal — please try again");
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [info.configured, info.subscriptionActive, info.clientId, hasPlan]);

  if (!info.configured) {
    return <p className="text-sm text-slate-500">PayPal isn&apos;t set up on this account yet.</p>;
  }
  if (info.subscriptionActive) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">Connected{info.payerEmail ? ` — ${info.payerEmail}` : ""}</p>
            <p className="text-xs text-slate-500">Charged automatically each billing period via PayPal.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" disabled={cancelling} onClick={cancel}>{cancelling ? "…" : "Disconnect"}</Button>
      </div>
    );
  }
  if (!hasPlan) {
    return <p className="text-sm text-slate-500">Choose a plan first, then come back here to subscribe via PayPal.</p>;
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500">Subscribe with PayPal for automatic recurring billing each month.</p>
      <div ref={containerRef} className="max-w-xs" />
      {rendering && <p className="text-xs text-slate-400">Loading PayPal…</p>}
    </div>
  );
}

export function PaymentMethodSelector({
  preferredPaymentMethod,
  square,
  bankTransfer,
  bpay,
  paypal,
  hasPlan,
  onChanged,
}: {
  preferredPaymentMethod: Method | null;
  square: { configured: boolean; clientConfig: SquareClientConfig | null; card: SavedCard | null };
  bankTransfer: BankTransferInfo;
  bpay: BpayInfo;
  paypal: PayPalInfo;
  hasPlan: boolean;
  onChanged: () => void;
}) {
  const [selected, setSelected] = useState<Method>(preferredPaymentMethod || "SQUARE");

  async function choose(method: Method) {
    setSelected(method);
    try {
      await apiPost("/api/business/billing/payment-method-preference", { method }, "PUT");
    } catch {
      toast.error("Could not save your payment method preference");
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = selected === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => choose(m.key)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition ${
                  active ? "border-[var(--accent,#4f46e5)] bg-[var(--accent-soft,#EEF2FF)] text-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-[var(--accent,#4f46e5)]" : "border-slate-300"}`}>
                  {active && <span className="h-2 w-2 rounded-full bg-[var(--accent,#4f46e5)]" />}
                </span>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 pt-4">
          {selected === "SQUARE" && <SquareCardForm configured={square.configured} clientConfig={square.clientConfig} card={square.card} onChanged={onChanged} />}
          {selected === "BANK_TRANSFER" && <BankTransferPanel info={bankTransfer} />}
          {selected === "PAYPAL" && <PayPalPanel info={paypal} hasPlan={hasPlan} onChanged={onChanged} />}
          {selected === "BPAY" && <BpayPanel info={bpay} />}
        </div>
      </CardContent>
    </Card>
  );
}
