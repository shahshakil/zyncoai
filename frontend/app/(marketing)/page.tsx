import dynamic from "next/dynamic";
import { HeroSection } from "@/components/marketing/receptionist/HeroSection";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { SectionViewObserver } from "@/components/marketing/receptionist/SectionViewObserver";
import { SITEWIDE_CHEAPEST_PLAN_PRICE } from "@/components/marketing/receptionist/data";
import { getVoiceHealth } from "@/lib/marketing-api";

// 2026-08-10 perf fix — everything below the hero used to be one eager
// import per section, so Next bundled all 16 sections' client JS (plus
// framer-motion, plus each section's own hooks/state) into a single
// monolithic script that had to be parsed and evaluated before the page
// was interactive — confirmed via Lighthouse's mainthread-work-breakdown
// audit as the real driver of mobile Total Blocking Time (~1.3s), separate
// from the LCP fix already applied to HeroSection.tsx. next/dynamic splits
// each section into its own chunk instead. ssr: true is kept on every one
// — this only changes how the JS is *bundled*, not whether the HTML is
// server-rendered, so there's no content flash, no SEO impact, and no
// visual change to any section (including the untouched Elite ones).
const VerticalsDiagramSection = dynamic(() => import("@/components/marketing/receptionist/VerticalsDiagramSection").then((m) => m.VerticalsDiagramSection), { ssr: true });
const LiveDemoSection = dynamic(() => import("@/components/marketing/receptionist/LiveDemoSection").then((m) => m.LiveDemoSection), { ssr: true });
const HowItWorksSection = dynamic(() => import("@/components/marketing/receptionist/HowItWorksSection").then((m) => m.HowItWorksSection), { ssr: true });
const RoiSection = dynamic(() => import("@/components/marketing/receptionist/RoiSection").then((m) => m.RoiSection), { ssr: true });
const FeaturesSection = dynamic(() => import("@/components/marketing/receptionist/FeaturesSection").then((m) => m.FeaturesSection), { ssr: true });
const TrustControlSection = dynamic(() => import("@/components/marketing/receptionist/TrustControlSection").then((m) => m.TrustControlSection), { ssr: true });
const EverythingYouNeedSection = dynamic(() => import("@/components/marketing/receptionist/EverythingYouNeedSection").then((m) => m.EverythingYouNeedSection), { ssr: true });
const IndustriesSection = dynamic(() => import("@/components/marketing/receptionist/IndustriesSection").then((m) => m.IndustriesSection), { ssr: true });
const ProductDemoSection = dynamic(() => import("@/components/marketing/receptionist/ProductDemoSection").then((m) => m.ProductDemoSection), { ssr: true });
const PricingSection = dynamic(() => import("@/components/marketing/receptionist/PricingSection").then((m) => m.PricingSection), { ssr: true });
const FinalCtaSection = dynamic(() => import("@/components/marketing/receptionist/FinalCtaSection").then((m) => m.FinalCtaSection), { ssr: true });
const FaqSection = dynamic(() => import("@/components/marketing/receptionist/FaqSection").then((m) => m.FaqSection), { ssr: true });

const TITLE = "ZyncoAI — AI Receptionist for Australian Businesses | 24/7 Call Answering";
const DESCRIPTION = `ZyncoAI answers every call 24/7, books appointments automatically, and never misses a customer. AI receptionist for medical clinics, restaurants, mechanics and more. From AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}/month.`;
const SHORT_DESCRIPTION = "Ella answers every call 24/7 and books appointments automatically.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["AI receptionist Australia", "AI phone answering", "automatic booking", "ZyncoAI", "medical receptionist AI"],
  openGraph: {
    title: "ZyncoAI — AI Receptionist for Australian Businesses",
    description: SHORT_DESCRIPTION,
    url: "https://zyncoai.com",
    siteName: "ZyncoAI",
    locale: "en_AU",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZyncoAI — AI Receptionist for Australian Businesses",
    description: SHORT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://zyncoai.com",
    languages: {
      "en-AU": "https://zyncoai.com",
      en: "https://zyncoai.com",
    },
  },
};

export default async function Page() {
  const { healthy: voiceHealthy } = await getVoiceHealth();

  return (
    <div className="bg-[#f8fafc]">
      <FaqJsonLd />
      <SectionViewObserver />
      <HeroSection />
      <VerticalsDiagramSection />
      <LiveDemoSection voiceHealthy={voiceHealthy} />
      <HowItWorksSection />
      <RoiSection />
      <FeaturesSection />
      <TrustControlSection />
      <EverythingYouNeedSection />
      <IndustriesSection />
      <ProductDemoSection />
      <PricingSection />
      <FaqSection voiceHealthy={voiceHealthy} />
      <FinalCtaSection />
    </div>
  );
}
