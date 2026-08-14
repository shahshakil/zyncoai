"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2, AlertCircle, Trash2, Pencil } from "lucide-react";
import { apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CardBrandIcon, AcceptedBrandsRow, normalizeCardBrand, type CardBrand } from "../billing/CardBrandIcon";
import { friendlySquareError } from "../billing/squareErrors";

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
interface BillingContact {
  name: string | null;
  email: string | null;
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

// Square's card element is a fully-hosted, cross-origin iframe — it never
// inherits this page's CSS custom properties (that's a real cross-origin
// boundary, not a styling oversight), so colors here are literal values
// matching var(--accent,#4f46e5) — the same indigo every dashboard form
// input already falls back to (see ui/input.tsx) — rather than the CSS var
// itself, which the iframe can't see. Selector/property set is exactly
// what Square's CardClassSelectors reference documents; anything else is
// silently ignored by the SDK.
const SQUARE_CARD_STYLE = {
  ".input-container": { borderRadius: "10px", borderColor: "#E2E8F0", borderWidth: "1.5px" },
  ".input-container.is-focus": { borderColor: "#4f46e5" },
  ".input-container.is-error": { borderColor: "#fb7185" },
  "input": { fontSize: "15px", fontFamily: "inherit", color: "#0f172a" },
  "input::placeholder": { color: "#94a3b8" },
  ".message-text": { color: "#e11d48" },
  ".message-icon": { color: "#e11d48" },
};

export function SquarePaymentMethodCard(props: { configured: boolean; clientConfig: SquareClientConfig | null; card: SavedCard | null; billingContact?: BillingContact | null; nextBillingDate?: string | null; onChanged: () => void }) {
  return (
    <Card>
      <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
      <CardContent>
        <SquareCardForm {...props} />
      </CardContent>
    </Card>
  );
}

function fmtDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

// Bare card-add/view/remove UI with no Card/CardHeader wrapper of its own —
// used both by SquarePaymentMethodCard above (standalone, e.g. during plan
// change) and directly by PaymentMethodSelector.tsx (already inside its own
// "Payment method" card, one per selected method).
export function SquareCardForm({
  configured,
  clientConfig,
  card,
  billingContact,
  nextBillingDate,
  onChanged,
}: {
  configured: boolean;
  clientConfig: SquareClientConfig | null;
  card: SavedCard | null;
  billingContact?: BillingContact | null;
  nextBillingDate?: string | null;
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [detectedBrand, setDetectedBrand] = useState<CardBrand>("unknown");
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
        const cardInput = await payments.card({ style: SQUARE_CARD_STYLE });
        if (cancelled) return;
        await cardInput.attach(containerRef.current);
        cardInstanceRef.current = cardInput;

        // Real-time brand detection as the user types — cardBrandChanged is
        // a documented Square event; wrapped defensively since its exact
        // payload shape isn't pinned down in public docs beyond
        // event.detail.cardBrand, and a styling nicety should never be able
        // to break card entry if Square changes it.
        try {
          cardInput.addEventListener("cardBrandChanged", (event: any) => {
            setDetectedBrand(normalizeCardBrand(event?.detail?.cardBrand ?? event?.cardBrand));
          });
          cardInput.addEventListener("errorClassRemoved", () => setFieldError(null));
        } catch (listenerErr) {
          console.error("[SquareCardForm] event listener setup failed (non-fatal):", listenerErr);
        }

        setSdkReady(true);
      } catch (err) {
        // Previously swallowed entirely — a CSP block, a bad applicationId/
        // locationId, and a plain network failure all produced the exact
        // same generic toast with zero way to tell them apart. Logging the
        // real error is what actually let us find the CSP root cause.
        console.error("[SquareCardForm] card form failed to load:", err);
        toast.error("Could not load the card form — please try again");
        setAdding(false);
      }
    })();

    return () => {
      cancelled = true;
      cardInstanceRef.current?.destroy?.();
      cardInstanceRef.current = null;
      setSdkReady(false);
      setDetectedBrand("unknown");
      setFieldError(null);
    };
  }, [adding, clientConfig]);

  async function submitCard() {
    if (!cardInstanceRef.current) return;
    setSaving(true);
    setFieldError(null);
    try {
      // intent: "STORE" — saving a card on file, not charging one right
      // now (the first real charge happens on the next generated invoice,
      // or via "Pay now" on an existing one). Square's SDK validates this
      // client-side: passing intent without a billingContact throws
      // "verificationDetails.billingContact is required" before any
      // network request is made — invisible to the backend's error
      // sanitization since the backend is never reached. givenName is the
      // only field Square actually requires; everything else just
      // improves buyer-verification success rates.
      const [givenName, ...familyNameParts] = (billingContact?.name || "Customer").trim().split(/\s+/);
      const familyName = familyNameParts.join(" ");
      const tokenResult = await cardInstanceRef.current.tokenize({
        intent: "STORE",
        customerInitiated: true,
        sellerKeyedIn: false,
        billingContact: {
          givenName: givenName || "Customer",
          ...(familyName ? { familyName } : {}),
          ...(billingContact?.email ? { email: billingContact.email } : {}),
        },
      });
      if (tokenResult.status !== "OK") {
        const message = friendlySquareError(tokenResult.errors?.[0]);
        setFieldError(message);
        toast.error(message);
        return;
      }
      const res = await apiPost<{ card: SavedCard }>("/api/business/billing/payment-method", { sourceId: tokenResult.token });
      toast.success(`Card ending in ${res.card.last4} saved`);
      setJustSaved(true);
      onChanged();
      setTimeout(() => {
        setAdding(false);
        setJustSaved(false);
      }, 700);
    } catch (e) {
      console.error("[SquareCardForm] card save failed:", e);
      const message = e instanceof ApiError ? "Could not save that card" : "Something went wrong saving your card";
      setFieldError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function removeCard() {
    setRemoving(true);
    try {
      await apiPost("/api/business/billing/payment-method", undefined, "DELETE");
      toast.success("Payment method removed");
      setConfirmRemove(false);
      onChanged();
    } catch {
      toast.error("Could not remove payment method");
    } finally {
      setRemoving(false);
    }
  }

  if (!configured) {
    return <p className="text-sm text-slate-500">Card payments aren&apos;t set up on this account yet — invoices are payable by bank transfer in the meantime.</p>;
  }

  if (card && !adding) {
    const nextCharge = fmtDate(nextBillingDate);
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <CardBrandIcon brand={normalizeCardBrand(card.brand)} className="h-10 w-14 shrink-0 rounded-md shadow-sm" />
          <div className="min-w-0 flex-1">
            {/* Never truncated — the masked digits are the one thing this
                chip must always show, even on a narrow screen. */}
            <p className="text-sm font-semibold text-slate-900">
              {card.brand} &bull;&bull;&bull;&bull; {card.last4}
            </p>
            <p className="text-xs text-slate-500">Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}</p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)} aria-label="Update card">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(true)} aria-label="Remove card">
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {nextCharge
            ? <>Your card ending &bull;&bull;&bull;&bull; {card.last4} will be charged automatically on {nextCharge} — nothing to do.</>
            : <>Your card ending &bull;&bull;&bull;&bull; {card.last4} will be charged automatically each billing period — nothing to do.</>}
        </p>

        <Dialog open={confirmRemove} onOpenChange={setConfirmRemove}>
          <DialogContent>
            <DialogHeader><DialogTitle>Remove this card?</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Future invoices won&apos;t be auto-charged — you&apos;ll need to pay by bank transfer or add a new card before your next billing date.
              </p>
              <div className="flex gap-2">
                <Button variant="danger" className="h-11 min-h-[44px]" disabled={removing} onClick={removeCard}>{removing ? "Removing…" : "Yes, remove card"}</Button>
                <Button variant="outline" className="h-11 min-h-[44px]" onClick={() => setConfirmRemove(false)}>Keep card</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (adding) {
    return (
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label className="mb-0">Card details</Label>
            {detectedBrand !== "unknown" && <CardBrandIcon brand={detectedBrand} className="h-5 w-8 rounded" />}
          </div>
          <div ref={containerRef} className="min-h-[56px] rounded-[10px] border border-slate-200 p-3.5 transition-colors" />
          {fieldError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldError}
            </p>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Secured by Square &middot; PCI DSS compliant — card details never touch our servers
        </p>

        <div className="flex gap-2">
          <Button variant="primary" size="lg" disabled={!sdkReady || saving || justSaved} onClick={submitCard} className="min-w-[188px]">
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : justSaved ? (
              <><CheckCircle2 className="h-4 w-4" /> Saved</>
            ) : (
              "Add payment method"
            )}
          </Button>
          <Button size="lg" variant="outline" disabled={saving || justSaved} onClick={() => setAdding(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">No payment method on file — invoices are payable by bank transfer, or add a card to have them charged automatically.</p>
        <Button variant="primary" size="lg" onClick={() => setAdding(true)} className="w-full shrink-0 sm:w-auto">Add payment method</Button>
      </div>
      <AcceptedBrandsRow />
    </div>
  );
}
