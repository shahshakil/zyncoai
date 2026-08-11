import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { LiveDemoSection } from "@/components/marketing/receptionist/LiveDemoSection";
import { PersonalizedDemoForm } from "@/components/marketing/receptionist/PersonalizedDemoForm";
import { FinalCtaSection } from "@/components/marketing/receptionist/FinalCtaSection";
import { DEMO_NUMBER } from "@/components/marketing/receptionist/LiveDemoSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getVoiceHealth } from "@/lib/marketing-api";

export const metadata: Metadata = {
  title: "Hear Ella Answer Your Business | ZyncoAI",
  description: "Type your business name and hear Ella — ZyncoAI's real AI receptionist — answer as if she already worked there, generated live with her actual production voice.",
  alternates: { canonical: "/demo", languages: { "en-AU": "/demo", en: "/demo" } },
};

export default async function DemoPage() {
  const { healthy } = await getVoiceHealth();

  return (
    <div className="bg-[#f8fafc] pt-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Live Demo", href: "/demo" }]} />

      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Hear Ella answer YOUR business.</h1>
        <p className="mt-3 text-[#475569]">
          Type your business name below — Ella will answer as if she already worked there, generated live with her actual production voice. No sign-up, no telephony needed.
        </p>
        {healthy && (
          <a
            href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]"
          >
            <Phone className="h-4 w-4" /> Or call Ella right now: {DEMO_NUMBER}
          </a>
        )}
      </section>

      <section className="px-6 pb-20">
        <PersonalizedDemoForm />
      </section>

      <div className="border-t border-[#e2e8f0]">
        <LiveDemoSection voiceHealthy={healthy} />
      </div>

      <FinalCtaSection />
    </div>
  );
}
