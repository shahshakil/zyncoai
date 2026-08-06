import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/receptionist/PricingSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SITEWIDE_CHEAPEST_PLAN_PRICE } from "@/components/marketing/receptionist/data";

// Derived from real per-industry pricing (see data.ts's INDUSTRY_PRICING),
// not a separate literal — this exact page now has an industry selector
// that surfaces the plan behind this number, so the claim can't drift out
// of sync with what's actually shown again (2026-08-05 fix).
const TITLE = `ZyncoAI Pricing — AI Receptionist Plans from AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}/month`;
const DESCRIPTION = `Simple transparent pricing for ZyncoAI AI receptionist, priced by industry — from AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}/month. 7-day free trial. No contracts.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zyncoai.com/pricing",
    siteName: "ZyncoAI",
    locale: "en_AU",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "/pricing", languages: { "en-AU": "/pricing", en: "/pricing" } },
};

export default function PricingPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing" }]} />
      <PricingSection />
      <FinalCtaSection />
    </div>
  );
}
