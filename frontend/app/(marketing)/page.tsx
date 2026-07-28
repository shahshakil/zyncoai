import { HeroSection } from "@/components/marketing/receptionist/HeroSection";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { WorkflowSection } from "@/components/marketing/receptionist/WorkflowSection";
import { RoiSection } from "@/components/marketing/receptionist/RoiSection";
import { FeaturesSection } from "@/components/marketing/receptionist/FeaturesSection";
import { IndustriesSection } from "@/components/marketing/receptionist/IndustriesSection";
import { ProductDemoSection } from "@/components/marketing/receptionist/ProductDemoSection";
import { PricingSection } from "@/components/marketing/receptionist/PricingSection";
import { AddOnsSection } from "@/components/marketing/receptionist/AddOnsSection";
import { TestimonialsSection } from "@/components/marketing/receptionist/TestimonialsSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";

export default function Page() {
  return (
    <div className="bg-[#030712]">
      <HeroSection />
      <LiveDemoSection />
      <WorkflowSection />
      <RoiSection />
      <FeaturesSection />
      <IndustriesSection />
      <ProductDemoSection />
      <PricingSection />
      <AddOnsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
