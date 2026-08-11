import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/receptionist/FaqSection";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getVoiceHealth } from "@/lib/marketing-api";

const TITLE = "Frequently Asked Questions — ZyncoAI AI Receptionist";
const DESCRIPTION =
  "Answers to common questions about ZyncoAI's AI phone receptionist — pricing, call forwarding, appointment booking, data privacy, setup time and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zyncoai.com/faq",
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
  alternates: { canonical: "/faq", languages: { "en-AU": "/faq", en: "/faq" } },
};

export default async function FaqPage() {
  const { healthy } = await getVoiceHealth();
  return (
    <div className="bg-[#f8fafc] pt-8">
      <FaqJsonLd />
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
      <FaqSection eyebrow="FAQ" title="Frequently asked questions" headingLevel="h1" voiceHealthy={healthy} />
      <FinalCtaSection />
    </div>
  );
}
