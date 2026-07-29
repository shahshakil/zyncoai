import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/receptionist/PricingSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";

export const metadata: Metadata = {
  title: "Pricing | ZyncoAI",
  description: "Simple, transparent AI receptionist pricing for Australian practices. 7-day free trial on every plan.",
};

export default function PricingPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <PricingSection />
      <FinalCtaSection />
    </div>
  );
}
