"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Landmark, Copy, Check } from "lucide-react";
import { apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { SquareCardForm } from "../settings/SquarePaymentMethodCard";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { PayPalBrandIcon } from "./CardBrandIcon";
import { formatAUD as money } from "@/lib/money";

type Method = "SQUARE" | "BANK_TRANSFER" | "PAYPAL";

interface SquareClientConfig { applicationId: string; locationId: string; environment: "sandbox" | "production" }
interface SavedCard { brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null }
interface BillingContact { name: string | null; email: string | null }
interface BankTransferInfo { bankName: string | null; bankAccountName: string | null; bankBsb: string | null; bankAccountNumber: string | null; payId: string | null; configured: boolean }
interface PayPalInfo { configured: boolean; clientId: string | null; environment: "sandbox" | "production" | null; subscriptionActive: boolean; payerEmail: string | null }
// The one invoice PayPal can pay right now — the oldest still-ISSUED
// invoice, same "at most one under normal operation" invariant
// paypalWebhook.ts's subscription handler already relies on.
interface OutstandingInvoice { id: string; invoiceNumber: string; totalCents: number }

// Click-to-copy field with its own transient checkmark state (not just a
// toast) — used for every Bank Transfer detail so copying is confirmed
// right where the user's eyes already are.
function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(`[CopyField] clipboard write failed for ${label}:`, err);
      toast.error(`Couldn't copy ${label} — select and copy it manually`);
    }
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
// intent=capture (not subscription), no vault — this SDK instance only ever
// drives a one-off Orders v2 "pay this invoice now" button, never a stored
// billing agreement.
const paypalSdkPromises = new Map<string, Promise<void>>();
function loadPayPalOrdersSdk(clientId: string): Promise<void> {
  const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=AUD&intent=capture`;
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

// PayPal here is a manual, per-invoice payment option — like Bank Transfer,
// not an auto-charge default (that's the Card tab's job). Buttons render
// PayPal's own official gold "pay" button; createOrder/onApprove call
// billing.ts's create-order/capture-order routes, which compute the amount
// and invoice reference server-side from `invoice.id` — the amount shown
// here is display-only, never sent to the backend.
// A CSP block, an ad-blocker, or a network that refuses paypal.com all fail
// the same way from here: loadPayPalOrdersSdk's script tag never fires
// onload or onerror, so the button silently never appears. blocked flips on
// either an explicit load failure OR a load that's still hanging after
// PAYPAL_LOAD_TIMEOUT_MS — the only way this panel is never just quietly
// empty.
const PAYPAL_LOAD_TIMEOUT_MS = 6000;

function PayPalPanel({ info, invoice, onChanged }: { info: PayPalInfo; invoice: OutstandingInvoice | null; onChanged: () => void }) {
  const [rendering, setRendering] = useState(false);
  const [paying, setPaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!info.configured || !invoice || !info.clientId) return;
    let cancelled = false;
    setRendering(true);
    setBlocked(false);
    const timeoutId = setTimeout(() => {
      if (!cancelled) setBlocked(true);
    }, PAYPAL_LOAD_TIMEOUT_MS);
    (async () => {
      try {
        await loadPayPalOrdersSdk(info.clientId!);
        if (cancelled || !window.paypal || !containerRef.current) return;
        containerRef.current.innerHTML = "";
        window.paypal
          .Buttons({
            style: { shape: "pill", color: "gold", layout: "horizontal", label: "pay" },
            createOrder: async () => {
              // Explicit try/catch (rather than letting apiPost's rejection
              // propagate on its own) guarantees onError below is what
              // actually fires — never a raw ApiError reaching the SDK's
              // own uncaught-rejection handling.
              try {
                const { orderId } = await apiPost<{ orderId: string }>(`/api/business/billing/invoices/${invoice.id}/paypal/create-order`);
                return orderId;
              } catch (err) {
                console.error("[PayPalPanel] createOrder failed:", err);
                throw new Error("paypal_order_create_failed");
              }
            },
            onApprove: async (data: any) => {
              setPaying(true);
              try {
                await apiPost(`/api/business/billing/invoices/${invoice.id}/paypal/capture-order`, { orderId: data.orderID });
                toast.success("Invoice paid with PayPal");
                onChanged();
              } catch (err) {
                console.error("[PayPalPanel] capture failed:", err);
                toast.error("PayPal approved the payment, but we couldn't confirm it — contact support");
              } finally {
                setPaying(false);
              }
            },
            // Buyer closed the popup or clicked "Cancel and return" before
            // approving — a normal, non-error outcome. No charge was ever
            // attempted (that only happens in onApprove), so this is purely
            // informational, never styled as a failure.
            onCancel: () => {
              toast("Payment cancelled — no charge was made");
            },
            onError: (err: any) => {
              console.error("[PayPalPanel] Buttons error:", err);
              toast.error("PayPal checkout failed — please try again");
            },
          })
          .render(containerRef.current);
        clearTimeout(timeoutId);
      } catch (err) {
        console.error("[PayPalPanel] setup failed:", err);
        if (!cancelled) setBlocked(true);
        clearTimeout(timeoutId);
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [info.configured, info.clientId, invoice?.id]);

  if (!info.configured) {
    return <p className="text-sm text-slate-500">PayPal isn&apos;t set up on this account yet.</p>;
  }
  // No invoice to attach a real order to right now — per the hard rule
  // above (PayPalPanel's header comment), a clickable button never renders
  // without one. This branded "accepted here" state replaces what used to
  // be bare text, and swaps back to the live button automatically the
  // moment `invoice` (sourced from the same billing payload as everything
  // else on this page) is next non-null — no reload involved, just React
  // re-rendering off a changed prop.
  if (!invoice) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#0070E0]/15 bg-gradient-to-b from-[#0070E0]/[0.06] to-transparent px-6 py-8 text-center">
        <div className="flex h-14 w-24 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <PayPalBrandIcon className="h-8 w-14" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">PayPal is accepted on this account</p>
          <p className="max-w-xs text-sm text-slate-500">The payment button appears automatically when an invoice is due.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <PayPalBrandIcon className="h-6 w-9 shrink-0" />
        <p className="text-sm text-slate-500">
          Pay invoice <span className="font-medium text-slate-700">{invoice.invoiceNumber}</span> ({money(invoice.totalCents)}) with PayPal — a manual, one-time payment. Your card on file remains the recommended automatic method.
        </p>
      </div>
      {blocked ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          Your browser or network is blocking PayPal — please pay by card or bank transfer instead.
        </p>
      ) : (
        <>
          <div ref={containerRef} className="max-w-xs" />
          {(rendering || paying) && <p className="text-xs text-slate-500">{paying ? "Confirming payment…" : "Loading PayPal…"}</p>}
        </>
      )}
    </div>
  );
}

export function PaymentMethodSelector({
  preferredPaymentMethod,
  square,
  billingContact,
  bankTransfer,
  paypal,
  outstandingInvoice,
  nextBillingDate,
  onChanged,
}: {
  preferredPaymentMethod: Method | null;
  square: { configured: boolean; clientConfig: SquareClientConfig | null; card: SavedCard | null };
  billingContact?: BillingContact | null;
  bankTransfer: BankTransferInfo;
  paypal: PayPalInfo;
  outstandingInvoice: OutstandingInvoice | null;
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
              <PayPalBrandIcon className="h-4 w-6 rounded-sm" /> PayPal{!paypal.configured && <span className="text-slate-400">&middot; Soon</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="SQUARE">
            <SquareCardForm configured={square.configured} clientConfig={square.clientConfig} card={square.card} billingContact={billingContact} nextBillingDate={nextBillingDate} onChanged={onChanged} />
          </TabsContent>
          <TabsContent value="BANK_TRANSFER">
            <BankTransferPanel info={bankTransfer} />
          </TabsContent>
          <TabsContent value="PAYPAL">
            <PayPalPanel info={paypal} invoice={outstandingInvoice} onChanged={onChanged} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
