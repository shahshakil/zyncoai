"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Landmark, Wallet, Copy, Check, CheckCircle2 } from "lucide-react";
import { apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { SquareCardForm } from "../settings/SquarePaymentMethodCard";
import { BrandLogo } from "@/components/layout/BrandLogo";

type Method = "SQUARE" | "BANK_TRANSFER" | "PAYPAL";

interface SquareClientConfig { applicationId: string; locationId: string; environment: "sandbox" | "production" }
interface SavedCard { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null }
interface BankTransferInfo { bankName: string | null; bankAccountName: string | null; bankBsb: string | null; bankAccountNumber: string | null; payId: string | null; configured: boolean }
interface PayPalInfo { configured: boolean; clientId: string | null; environment: "sandbox" | "production" | null; subscriptionActive: boolean; payerEmail: string | null }

// Click-to-copy field with its own transient checkmark state (not just a
// toast) — used for every Bank Transfer detail so copying is confirmed
// right where the user's eyes already are.
function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-slate-300">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className={`truncate text-sm font-semibold text-slate-900 ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function BankTransferPanel({ info }: { info: BankTransferInfo }) {
  if (!info.configured) {
    return <p className="text-sm text-slate-500">Bank transfer is temporarily unavailable.</p>;
  }
  return (
    <div className="space-y-2.5">
      <CopyField label="Account name" value={info.bankAccountName || "—"} mono={false} />
      <div className="grid grid-cols-2 gap-2.5">
        <CopyField label="BSB" value={info.bankBsb || "—"} />
        <CopyField label="Account number" value={info.bankAccountNumber || "—"} />
      </div>
      {info.payId && <CopyField label="PayID" value={info.payId} />}
      <p className="pt-1 text-xs text-slate-500">
        {info.bankName ? `${info.bankName} · ` : ""}Reference each payment with your invoice number (shown on every invoice) so it&apos;s matched automatically.
      </p>
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
      {rendering && <p className="text-xs text-slate-500">Loading PayPal…</p>}
    </div>
  );
}

export function PaymentMethodSelector({
  preferredPaymentMethod,
  square,
  bankTransfer,
  paypal,
  hasPlan,
  nextBillingDate,
  onChanged,
}: {
  preferredPaymentMethod: Method | null;
  square: { configured: boolean; clientConfig: SquareClientConfig | null; card: SavedCard | null };
  bankTransfer: BankTransferInfo;
  paypal: PayPalInfo;
  hasPlan: boolean;
  nextBillingDate?: string | null;
  onChanged: () => void;
}) {
  // A method that isn't actually configured yet can never be a real
  // preference — PayPal falls back to Card and shows as a quiet, disabled
  // tab until it has real production credentials. BPAY has been removed
  // entirely (see PaymentMethodSelector's git history) — it was never going
  // to ship, so a "Soon" tile for it was a false promise.
  const availability: Record<Method, boolean> = { SQUARE: true, BANK_TRANSFER: true, PAYPAL: paypal.configured };
  const initialSelected = preferredPaymentMethod && availability[preferredPaymentMethod] ? preferredPaymentMethod : "SQUARE";
  const [selected, setSelected] = useState<Method>(initialSelected);

  async function choose(value: string) {
    const method = value as Method;
    if (!availability[method]) return;
    setSelected(method);
    try {
      await apiPost("/api/business/billing/payment-method-preference", { method }, "PUT");
    } catch {
      toast.error("Could not save your payment method preference");
    }
  }

  return (
    <Card>
      {/* Quiet brand presence heading the payment area, Zapier-checkout
          style — the existing sidebar wordmark (BrandLogo), untouched,
          just scaled down for a section header rather than nav real estate. */}
      <div className="scale-[0.82] origin-left px-5 pt-4">
        <BrandLogo />
      </div>
      <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selected} onValueChange={choose}>
          <TabsList>
            <TabsTrigger value="SQUARE" className="gap-1.5"><CreditCard className="h-4 w-4" /> Card</TabsTrigger>
            <TabsTrigger value="BANK_TRANSFER" className="gap-1.5"><Landmark className="h-4 w-4" /> Bank Transfer</TabsTrigger>
            <TabsTrigger value="PAYPAL" disabled={!paypal.configured} className="gap-1.5 disabled:cursor-not-allowed disabled:opacity-50">
              <Wallet className="h-4 w-4" /> PayPal{!paypal.configured && <span className="text-slate-400">&middot; Soon</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="SQUARE">
            <SquareCardForm configured={square.configured} clientConfig={square.clientConfig} card={square.card} nextBillingDate={nextBillingDate} onChanged={onChanged} />
          </TabsContent>
          <TabsContent value="BANK_TRANSFER">
            <BankTransferPanel info={bankTransfer} />
          </TabsContent>
          <TabsContent value="PAYPAL">
            <PayPalPanel info={paypal} hasPlan={hasPlan} onChanged={onChanged} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
