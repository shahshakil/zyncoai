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

export const metadata = {
  title: "ZyncoAI — AI Receptionist That Answers Every Call",
  description:
    "ZyncoAI is an AI receptionist that answers calls, books appointments, and handles enquiries 24/7 for medical, dental, legal, restaurant, and trade businesses.",
  alternates: {
    canonical: "https://zyncoai.com",
  },
};

export default function Page() {
  return (
    <div className="bg-[#f8fafc]">
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
      <FinalCtaSection />
    </div>
  );
}
