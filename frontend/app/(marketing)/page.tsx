import { HeroSection } from "@/components/marketing/receptionist/HeroSection";
import { VerticalsDiagramSection } from "@/components/marketing/receptionist/VerticalsDiagramSection";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { HowItWorksSection } from "@/components/marketing/receptionist/HowItWorksSection";
import { RoiSection } from "@/components/marketing/receptionist/RoiSection";
import { FeaturesSection } from "@/components/marketing/receptionist/FeaturesSection";
import { PlatformControlsSection } from "@/components/marketing/receptionist/PlatformControlsSection";
import { TrustControlSection } from "@/components/marketing/receptionist/TrustControlSection";
import { WhyZyncoSection } from "@/components/marketing/receptionist/WhyZyncoSection";
import { EverythingYouNeedSection } from "@/components/marketing/receptionist/EverythingYouNeedSection";
import { SecuritySection } from "@/components/marketing/receptionist/SecuritySection";
import { IndustriesSection } from "@/components/marketing/receptionist/IndustriesSection";
import { ProductDemoSection } from "@/components/marketing/receptionist/ProductDemoSection";
import { PricingSection } from "@/components/marketing/receptionist/PricingSection";
import { AddOnsSection } from "@/components/marketing/receptionist/AddOnsSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { FaqSection } from "@/components/marketing/receptionist/FaqSection";
import { HomepageFaqJsonLd } from "@/components/seo/HomepageFaqJsonLd";

const TITLE = "ZyncoAI — AI Receptionist for Australian Businesses | 24/7 Call Answering";
const DESCRIPTION =
  "ZyncoAI answers every call 24/7, books appointments automatically, and never misses a customer. AI receptionist for medical clinics, restaurants, mechanics and more. From AUD $149/month.";
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
  },
};

export default function Page() {
  return (
    <div className="bg-[#f8fafc]">
      <HomepageFaqJsonLd />
      <HeroSection />
      <VerticalsDiagramSection />
      <LiveDemoSection />
      <HowItWorksSection />
      <RoiSection />
      <FeaturesSection />
      <PlatformControlsSection />
      <TrustControlSection />
      <WhyZyncoSection />
      <EverythingYouNeedSection />
      <SecuritySection />
      <IndustriesSection />
      <ProductDemoSection />
      <PricingSection />
      <AddOnsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
