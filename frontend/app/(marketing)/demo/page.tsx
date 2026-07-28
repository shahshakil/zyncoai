import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";

export const metadata: Metadata = {
  title: "Live Demo | ZyncoAI",
  description: "Call Charlotte, ZyncoAI's real AI receptionist, right now — or watch a scripted example call.",
};

const DEMO_NUMBER = "+61 2 5747 4612";

export default function DemoPage() {
  return (
    <div className="bg-[#030712] pt-16">
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">Talk to Charlotte right now</h1>
        <p className="mt-3 text-[#94a3b8]">This is a real AI — Charlotte will answer instantly, no waiting, no script reading on our end.</p>

        <a
          href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
          className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-emerald-600 px-8 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.35)] transition hover:opacity-90"
        >
          <Phone className="h-6 w-6" /> Call Charlotte now: {DEMO_NUMBER}
        </a>
        <p className="mt-4 text-xs text-[#94a3b8]">Standard call rates apply. Available 24/7.</p>
      </section>

      <LiveDemoSection />
      <FinalCtaSection />
    </div>
  );
}
