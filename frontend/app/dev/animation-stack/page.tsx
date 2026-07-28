import AnimationShell from "@/components/marketing/animation/shared/AnimationShell";
import BrainOrb from "@/components/marketing/animation/three/BrainOrb";
import WorkflowMotion from "@/components/marketing/animation/motion/WorkflowMotion";
import LoopPanel from "@/components/marketing/animation/lottie/LoopPanel";

export default function AnimationStackPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-7xl space-y-10">
        <AnimationShell
          eyebrow="Three.js"
          title="3D Brain / Orb ready"
          description="This confirms WebGL / React Three Fiber is installed and working."
        >
          <BrainOrb />
        </AnimationShell>

        <AnimationShell
          eyebrow="Framer Motion"
          title="Workflow motion ready"
          description="This confirms UI animation blocks and line motion are ready."
          className="p-6 md:p-8"
        >
          <WorkflowMotion />
        </AnimationShell>

        <AnimationShell
          eyebrow="Lottie / Loop panels"
          title="Animation loop section ready"
          description="This is where your video-style animation panels will go."
          className="p-6 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <LoopPanel
              title="AI Brain Orchestration"
              desc="Ready for lottie or exported JSON animation."
            />
            <LoopPanel
              title="Dynamic Workflow Engine"
              desc="Ready for dashboard motion loop."
            />
            <LoopPanel
              title="Storyboard Simulation"
              desc="Ready for sequence-based motion content."
            />
          </div>
        </AnimationShell>
      </div>
    </main>
  );
}
