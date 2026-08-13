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

export function CardBrandIcon({ brand, className }: { brand: CardBrand; className?: string }) {
  const cls = className || "h-6 w-9";
  switch (brand) {
    case "visa":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#1A1F71" />
          <text x="18" y="16.5" textAnchor="middle" fontSize="10" fontStyle="italic" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#16181C" />
          <circle cx="15" cy="12" r="7" fill="#EB001B" />
          <circle cx="21" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#2E77BC" />
          <text x="18" y="16" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            AMEX
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#F5F5F5" stroke="#E2E8F0" />
          <text x="18" y="15.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#FF6000" fontFamily="Arial, sans-serif">
            DISCOVER
          </text>
        </svg>
      );
    case "jcb":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#0B4EA2" />
          <text x="18" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            JCB
          </text>
        </svg>
      );
    case "unionpay":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-hidden="true">
          <rect width="36" height="24" rx="4" fill="#E21836" />
          <text x="18" y="16" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            UnionPay
          </text>
        </svg>
      );
    default:
      return <CreditCard className={cls.includes("h-") ? cls : `${cls} h-6 w-9`} strokeWidth={1.5} />;
  }
}
