import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/receptionist/PricingSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const TITLE = "ZyncoAI Pricing — AI Receptionist Plans from AUD $149/month";
const DESCRIPTION =
  "Simple transparent pricing for ZyncoAI AI receptionist. Restaurant from $149/month, Medical from $399/month. 7-day free trial. No contracts.";

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
