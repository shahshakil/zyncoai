"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiPost } from "@/lib/useApi";

declare global {
  interface Window {
    paypal?: any;
  }
}
// intent=capture (not subscription), no vault — this SDK instance only ever
// drives a one-off Orders v2 "pay this invoice now" button, never a stored
// billing agreement. Shared by every place a real, already-issued invoice
// needs to become payable via PayPal's gold button — the Payment method tab
// (PaymentMethodSelector.tsx) and plan checkout (PlanPickerDialog.tsx) both
// render this against their own invoice id; createOrder/onApprove call
// billing.ts's create-order/capture-order routes, which compute the amount
// and invoice reference server-side from `invoiceId` alone.
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

// A CSP block, an ad-blocker, or a network that refuses paypal.com all fail
// the same way from here: loadPayPalOrdersSdk's script tag never fires
// onload or onerror, so the button silently never appears. blocked flips on
// either an explicit load failure OR a load that's still hanging after
// PAYPAL_LOAD_TIMEOUT_MS — the only way this is never just quietly empty.
const PAYPAL_LOAD_TIMEOUT_MS = 6000;

export function PayPalSmartButton({ clientId, invoiceId, onPaid }: { clientId: string; invoiceId: string; onPaid: () => void }) {
  const [rendering, setRendering] = useState(false);
  const [paying, setPaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setRendering(true);
    setBlocked(false);
    const timeoutId = setTimeout(() => {
      if (!cancelled) setBlocked(true);
    }, PAYPAL_LOAD_TIMEOUT_MS);
    (async () => {
      try {
        await loadPayPalOrdersSdk(clientId);
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
                const { orderId } = await apiPost<{ orderId: string }>(`/api/business/billing/invoices/${invoiceId}/paypal/create-order`);
                return orderId;
              } catch (err) {
                console.error("[PayPalSmartButton] createOrder failed:", err);
                throw new Error("paypal_order_create_failed");
              }
            },
            onApprove: async (data: any) => {
              setPaying(true);
              try {
                await apiPost(`/api/business/billing/invoices/${invoiceId}/paypal/capture-order`, { orderId: data.orderID });
                onPaid();
              } catch (err) {
                console.error("[PayPalSmartButton] capture failed:", err);
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
              console.error("[PayPalSmartButton] Buttons error:", err);
              toast.error("PayPal checkout failed — please try again");
            },
          })
          .render(containerRef.current);
        clearTimeout(timeoutId);
      } catch (err) {
        console.error("[PayPalSmartButton] setup failed:", err);
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
  }, [clientId, invoiceId]);

  if (blocked) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
        Your browser or network is blocking PayPal — please pay by card or bank transfer instead.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <div ref={containerRef} className="max-w-xs" />
      {(rendering || paying) && <p className="text-xs text-slate-500">{paying ? "Confirming payment…" : "Loading PayPal…"}</p>}
    </div>
  );
}
