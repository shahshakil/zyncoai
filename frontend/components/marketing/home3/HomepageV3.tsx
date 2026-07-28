import Hero3D from "./sections/Hero3D";
import LiveMetrics from "./sections/LiveMetrics";
import WorkflowStoryboard from "./sections/WorkflowStoryboard";
import ConnectorsOrbit from "./sections/ConnectorsOrbit";
import CoreFeatures from "./sections/CoreFeatures";
import AgentOpsSection from "./sections/AgentOpsSection";
import WorkflowOpsSection from "./sections/WorkflowOpsSection";
import UseCasesSection from "./sections/UseCasesSection";
import TemplatesGallery from "./sections/TemplatesGallery";
import EnterpriseSecurity from "./sections/EnterpriseSecurity";
import AIBrainSection from "./sections/AIBrainSection";
import CustomerProof from "./sections/CustomerProof";
import PricingPreview from "./sections/PricingPreview";
import FinalCTA from "./sections/FinalCTA";

function SectionDivider() {
  return <div className="mx-auto h-px w-full max-w-7xl bg-zinc-200/80" />;
}

export default function HomepageV3() {
  return (
    <main className="min-h-screen bg-[#f7f3ee] text-zinc-950">
      <Hero3D />
      <LiveMetrics />
      <WorkflowStoryboard />
      <ConnectorsOrbit />
      <CoreFeatures />
      <AgentOpsSection />
      <WorkflowOpsSection />
      <UseCasesSection />
      <TemplatesGallery />
      <EnterpriseSecurity />
      <AIBrainSection />
      <CustomerProof />
      <PricingPreview />
      <FinalCTA />
    </main>
  );
}
