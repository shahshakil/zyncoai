import type { Metadata } from "next";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { CallEllaButton } from "@/components/marketing/receptionist/CallEllaButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getVoiceHealth } from "@/lib/marketing-api";

export const metadata: Metadata = {
  title: "Live Demo | ZyncoAI",
  description: "Hear Ella, ZyncoAI's real AI receptionist, handle a genuine booking call — generated with her actual production voice.",
  alternates: { canonical: "/demo", languages: { "en-AU": "/demo", en: "/demo" } },
};

export default async function DemoPage() {
  const { healthy } = await getVoiceHealth();

  return (
    <div className="bg-[#f8fafc] pt-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Live Demo", href: "/demo" }]} />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">{healthy ? "Talk to Ella right now" : "Hear Ella handle a real call"}</h1>
        <p className="mt-3 text-[#475569]">
          {healthy
            ? "This is a real AI — Ella will answer instantly, no waiting, no script reading on our end."
            : "Our live demo line is temporarily offline. In the meantime, this is Ella's actual production voice handling a genuine booking flow — not a mockup."}
        </p>

        <CallEllaButton healthy={healthy} />
        {healthy && <p className="mt-4 text-xs text-[#94a3b8]">Standard call rates apply. Available 24/7.</p>}
      </section>

      <LiveDemoSection voiceHealthy={healthy} />
      <FinalCtaSection />
    </div>
  );
}
