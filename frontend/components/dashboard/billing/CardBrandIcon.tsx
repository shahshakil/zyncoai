import { CreditCard } from "lucide-react";

// Square's Web Payments SDK card element is a cross-origin hosted iframe
// (see SquarePaymentMethodCard.tsx) — it can tell us the detected brand via
// its cardBrandChanged event, but never gives us a logo asset. These are
// small inline marks (not photographic brand logos) so there's no network
// fetch and no Lighthouse image-loading cost; a generic card glyph covers
// anything unrecognized.
export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "jcb" | "unionpay" | "unknown";

// Square's cardBrandChanged event value casing/naming isn't pinned down in
// public docs — matched by substring, case-insensitively, so this keeps
// working regardless of exactly how Square spells it.
export function normalizeCardBrand(raw: string | null | undefined): CardBrand {
  const v = (raw || "").toLowerCase();
  if (!v || v === "unknown" || v === "other_brand") return "unknown";
  if (v.includes("visa")) return "visa";
  if (v.includes("master")) return "mastercard";
  if (v.includes("amex") || v.includes("american")) return "amex";
  if (v.includes("discover")) return "discover";
  if (v.includes("jcb")) return "jcb";
  if (v.includes("union")) return "unionpay";
  return "unknown";
}

// Verified against Square's own AU pricing page ("You can accept every
// major card – Visa, Mastercard, American Express, and eftpos – all for
// the same rate") and our production Square location's capabilities —
// Discover/JCB/UnionPay are NOT accepted on this AU account, so they get a
// brand mark (in case Square's SDK ever reports one) but never appear in
// ACCEPTED_BRANDS / the badge row. eftpos itself has no distinct
// internationally-recognized mark and isn't a brand Square's SDK reports
// separately from Visa/Mastercard debit, so it's not a badge candidate.
export const ACCEPTED_BRANDS: CardBrand[] = ["visa", "mastercard", "amex"];

export function CardBrandIcon({ brand, className }: { brand: CardBrand; className?: string }) {
  const cls = className || "h-6 w-9";
  switch (brand) {
    case "visa":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="Visa">
          <rect width="36" height="24" rx="4" fill="#1A1F71" />
          <text x="18" y="16.5" textAnchor="middle" fontSize="11" fontStyle="italic" fontWeight="800" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="0.2">
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="Mastercard">
          <rect width="36" height="24" rx="4" fill="#fff" />
          <circle cx="15" cy="12" r="7" fill="#EB001B" />
          <circle cx="21" cy="12" r="7" fill="#F79E1B" />
          <path d="M18 6.6a7 7 0 010 10.8 7 7 0 010-10.8z" fill="#FF5F00" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="American Express">
          <rect width="36" height="24" rx="4" fill="#006FCF" />
          <text x="18" y="15.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif" letterSpacing="0.3">
            AMEX
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="Discover">
          <rect width="36" height="24" rx="4" fill="#F5F5F5" stroke="#E2E8F0" />
          <text x="18" y="15.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#FF6000" fontFamily="Arial, sans-serif">
            DISCOVER
          </text>
        </svg>
      );
    case "jcb":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="JCB">
          <rect width="36" height="24" rx="4" fill="#0B4EA2" />
          <text x="18" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            JCB
          </text>
        </svg>
      );
    case "unionpay":
      return (
        <svg viewBox="0 0 36 24" className={cls} role="img" aria-label="UnionPay">
          <rect width="36" height="24" rx="4" fill="#E21836" />
          <text x="18" y="16" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            UnionPay
          </text>
        </svg>
      );
    default:
      return <CreditCard className={cls.includes("h-") ? cls : `${cls} h-6 w-9`} strokeWidth={1.5} aria-hidden="true" />;
  }
}

// PayPal's own two-tone wordmark colors (dark "Pay" navy, bright "Pal"
// blue) — not a CardBrand (PayPal isn't a card number Square's SDK ever
// detects), so kept as its own small mark rather than folded into the
// CardBrand union above.
export function PayPalBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className || "h-6 w-9"} role="img" aria-label="PayPal">
      <rect width="36" height="24" rx="4" fill="#fff" />
      <text x="18" y="15.5" textAnchor="middle" fontSize="8.5" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="-0.2">
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#0070E0">Pal</tspan>
      </text>
    </svg>
  );
}

const BRAND_LABELS: Record<CardBrand, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "American Express",
  discover: "Discover", jcb: "JCB", unionpay: "UnionPay", unknown: "Card",
};

// The "we accept these cards" reassurance row — every badge sits in its own
// white card so brands whose real mark has no background (Mastercard) and
// brands whose real mark IS a colour box (Visa/Amex) still read as one
// consistent row, Zapier-checkout style.
export function AcceptedBrandsRow({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className || ""}`}
      role="img"
      aria-label={`We accept ${ACCEPTED_BRANDS.map((b) => BRAND_LABELS[b]).join(", ")}`}
    >
      {ACCEPTED_BRANDS.map((b) => (
        <span key={b} className="flex h-7 w-11 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <CardBrandIcon brand={b} className="h-6 w-9" />
        </span>
      ))}
    </div>
  );
}
