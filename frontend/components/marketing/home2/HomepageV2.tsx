import MarketingNavbar from "@/components/navigation/MarketingNavbar";
import PremiumHero from "./sections/PremiumHero";
import OrbHeroSection from "./sections/OrbHeroSection";
import WorkflowNodeCanvas from "./sections/WorkflowNodeCanvas";
import AdvancedWorkflowCanvas from "./sections/AdvancedWorkflowCanvas";
import PremiumProductSurface from "./sections/PremiumProductSurface";
import ConnectorsCloud from "./sections/ConnectorsCloud";
import GlassDashboardSimulation from "./sections/GlassDashboardSimulation";
import PremiumVideoGrid from "./sections/PremiumVideoGrid";
import TemplatesGallery from "./sections/TemplatesGallery";
import EnterpriseSecurityStrip from "./sections/EnterpriseSecurityStrip";
import ZeroTrustEnterpriseStrip from "./sections/ZeroTrustEnterpriseStrip";
import CustomerProof from "./sections/CustomerProof";
import PricingPreview from "./sections/PricingPreview";
import FinalCta from "./sections/FinalCta";
import Footer from "@/components/marketing/Footer";

export default function HomepageV2() {
  return (
    <main className="bg-[#070710] text-zinc-950">
      <MarketingNavbar />
      <PremiumHero />
      <OrbHeroSection />

      <section id="workflow-animation" className="bg-[#070710] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Workflow animation
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Node-canvas execution surfaces that feel closer to Flowise and n8n.
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">
              These sections visually explain planning, routing, tool use, memory, branching,
              decisions, outcomes, and enterprise execution logic.
            </p>
          </div>

          <div className="mt-12">
            <WorkflowNodeCanvas />
          </div>

          <div className="mt-12">
            <AdvancedWorkflowCanvas />
          </div>
        </div>
      </section>

      <PremiumVideoGrid />
      <PremiumProductSurface />
      <ConnectorsCloud />
      <GlassDashboardSimulation />
      <TemplatesGallery />
      <EnterpriseSecurityStrip />
      <ZeroTrustEnterpriseStrip />
      <CustomerProof />
      <PricingPreview />
      <FinalCta />
      <Footer />
    </main>
  );
}
