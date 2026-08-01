import type { Metadata } from "next";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { CallEllaButton } from "@/components/marketing/receptionist/CallEllaButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Live Demo | ZyncoAI",
  description: "Call Ella, ZyncoAI's real AI receptionist, right now — or watch a scripted example call.",
  alternates: { canonical: "/demo", languages: { "en-AU": "/demo", en: "/demo" } },
};

export default function DemoPage() {
  return (
    <div className="bg-[#f8fafc] pt-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Live Demo", href: "/demo" }]} />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Talk to Ella right now</h1>
        <p className="mt-3 text-[#475569]">This is a real AI — Ella will answer instantly, no waiting, no script reading on our end.</p>

        <CallEllaButton />
        <p className="mt-4 text-xs text-[#94a3b8]">Standard call rates apply. Available 24/7.</p>
      </section>

      <LiveDemoSection />
      <FinalCtaSection />
    </div>
  );
}
