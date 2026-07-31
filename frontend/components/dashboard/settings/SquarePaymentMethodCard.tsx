"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Trash2 } from "lucide-react";
import { apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface SquareClientConfig {
  applicationId: string;
  locationId: string;
  environment: "sandbox" | "production";
}
interface SavedCard {
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
}

declare global {
  interface Window {
    Square?: { payments: (appId: string, locationId: string) => Promise<any> };
  }
}

const sdkLoadPromises = new Map<string, Promise<void>>();

// The Square Web Payments SDK is a script tag, not an npm package — same
// integration model as Google Maps' JS SDK elsewhere in this codebase.
// Cached by environment so switching tabs/remounting never injects the
// script twice.
function loadSquareSdk(environment: "sandbox" | "production"): Promise<void> {
  const src = environment === "production" ? "https://web.squarecdn.com/v1/square.js" : "https://sandbox.web.squarecdn.com/v1/square.js";
  if (sdkLoadPromises.has(src)) return sdkLoadPromises.get(src)!;

  const promise = new Promise<void>((resolve, reject) => {
    if (window.Square) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("square_sdk_load_failed"));
    document.head.appendChild(script);
  });
  sdkLoadPromises.set(src, promise);
  return promise;
}

export function SquarePaymentMethodCard({
  configured,
  clientConfig,
  card,
  onChanged,
}: {
  configured: boolean;
  clientConfig: SquareClientConfig | null;
  card: SavedCard | null;
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!adding || !clientConfig) return;
    let cancelled = false;

    (async () => {
      try {
        await loadSquareSdk(clientConfig.environment);
        if (cancelled || !window.Square) return;
        const payments = await window.Square.payments(clientConfig.applicationId, clientConfig.locationId);
        const cardInput = await payments.card();
        if (cancelled) return;
        await cardInput.attach(containerRef.current);
        cardInstanceRef.current = cardInput;
        setSdkReady(true);
      } catch (err) {
        // Previously swallowed entirely — a CSP block, a bad applicationId/
        // locationId, and a plain network failure all produced the exact
        // same generic toast with zero way to tell them apart. Logging the
        // real error is what actually let us find the CSP root cause.
        console.error("[SquarePaymentMethodCard] card form failed to load:", err);
        toast.error("Could not load the card form — please try again");
        setAdding(false);
      }
    })();

    return () => {
      cancelled = true;
      cardInstanceRef.current?.destroy?.();
      cardInstanceRef.current = null;
      setSdkReady(false);
    };
  }, [adding, clientConfig]);

  async function submitCard() {
    if (!cardInstanceRef.current) return;
    setSaving(true);
    try {
      // intent: "STORE" — saving a card on file, not charging one right
      // now (the first real charge happens on the next generated invoice,
      // or via "Pay now" on an existing one).
      const tokenResult = await cardInstanceRef.current.tokenize({ intent: "STORE" });
      if (tokenResult.status !== "OK") {
        toast.error("Card details look invalid — please check and try again");
        return;
      }
      const res = await apiPost<{ card: SavedCard }>("/api/business/billing/payment-method", { sourceId: tokenResult.token });
      toast.success(`Card ending in ${res.card.last4} saved`);
      setAdding(false);
      onChanged();
    } catch (e) {
      console.error("[SquarePaymentMethodCard] card save failed:", e);
      toast.error(e instanceof ApiError ? "Could not save that card" : "Something went wrong saving your card");
    } finally {
      setSaving(false);
    }
  }

  async function removeCard() {
    setRemoving(true);
    try {
      await apiPost("/api/business/billing/payment-method", undefined, "DELETE");
      toast.success("Payment method removed");
      onChanged();
    } catch {
      toast.error("Could not remove payment method");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
      <CardContent>
        {!configured ? (
          <p className="text-sm text-slate-400">Card payments aren&apos;t set up on this account yet — invoices are payable by bank transfer in the meantime.</p>
        ) : card ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">{card.brand} •••• {card.last4}</p>
                <p className="text-xs text-slate-500">Expires {card.expMonth}/{card.expYear} · charged automatically each billing period</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" disabled={removing} onClick={removeCard}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ) : adding ? (
          <div className="space-y-3">
            <div ref={containerRef} className="rounded-lg border border-slate-200 p-3" />
            <div className="flex gap-2">
              <Button size="sm" disabled={!sdkReady || saving} onClick={submitCard}>{saving ? "Saving…" : "Save card"}</Button>
              <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">No payment method on file — invoices are payable by bank transfer, or add a card to have them charged automatically.</p>
            <Button variant="outline" size="sm" onClick={() => setAdding(true)}>Add payment method</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
