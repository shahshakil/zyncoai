"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import PricingHero from "@/components/sections/pricing/PricingHero";
import PricingCards from "@/components/sections/pricing/PricingCards";
import PricingMarquee from "@/components/sections/pricing/PricingMarquee";
import PricingComparison from "@/components/sections/pricing/PricingComparison";
import PricingFAQCategories from "@/components/sections/pricing/PricingFAQCategories";
import Footer from "@/components/sections/Footer";

// If you created the concierge component, keep this import.
// If you haven't created it yet, comment it out.
import PricingConcierge from "@/components/chat/PricingConcierge";

export default function PricingPage() {
  useEffect(() => {
    posthog.capture("pricing_viewed", {});
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--text))]">
      {/* Concierge overlay (after 60 seconds) */}
      <PricingConcierge />

      <PricingHero />
      <PricingCards />
      <PricingMarquee />
      <PricingComparison />
      <PricingFAQCategories />
      <Footer />
    </main>
  );
}
