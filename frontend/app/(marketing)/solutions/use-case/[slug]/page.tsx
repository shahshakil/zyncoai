import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USE_CASES, INDUSTRY_PRICING } from "@/components/marketing/receptionist/data";
import { SolutionTemplate, type SolutionContent } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const useCase = USE_CASES.find((u) => u.slug === params.slug);
  if (!useCase) return {};
  const title = `${useCase.name} | ZyncoAI`;
  return {
    title,
    description: useCase.tagline,
    alternates: { canonical: `/solutions/use-case/${useCase.slug}`, languages: { "en-AU": `/solutions/use-case/${useCase.slug}`, en: `/solutions/use-case/${useCase.slug}` } },
  };
}

// 2026-08-18 — elite pass for this one use case (per-slug, not sitewide: the
// other 7 use-case pages weren't part of this rebuild and keep their
// existing generic template output below). Real content only: pain points
// map to features already listed, FAQs are grounded in verified product
// facts (call-forwarding setup, 000 escalation, real onboarding steps —
// see data.ts/verifiedHelpContent.ts), and the ROI/integrations blocks
// reuse the exact components the 10 vertical pages use, with an honest
// disclaimer that Salon & Retail (our real cheapest plan group) is shown as
// the example since this page isn't scoped to one industry.
// Cheapest real plan group sitewide (Salon & Retail, $99/mo) — used as the
// ROI calculator's example set since this page isn't scoped to one industry.
const SALON_PLANS = INDUSTRY_PRICING.find((g) => g.slug === "salon")!.plans;

const RICH_CONTENT: Record<string, Partial<SolutionContent>> = {
  "inbound-answering": {
    greeting: "Hi, this is Ella — how can I help you today?",
    callerLine: "Hi, I'm calling about your opening hours — are you around this afternoon?",
    descriptor: "your business",
    features: [
      "Every call is answered on the first ring — no queue, no voicemail, no missed calls",
      "Books directly into your real calendar while the caller's still on the line",
      "Works for every call type — new customers, existing clients, suppliers, anyone who calls your number",
      "Escalates anything it can't handle straight to your team",
    ],
    overview:
      "Most businesses lose calls three ways: the phone rings out, it goes to voicemail no one checks in time, or it's answered late because someone's mid-task. Ella removes all three — every call to your number is answered immediately, ready to book an appointment or take a message on the spot.",
    painPoints: [
      { problem: "A ringing phone means someone has to stop what they're doing to pick it up.", solution: "Ella answers instantly, every time — no one on your team has to drop what they're doing." },
      { problem: "Voicemail gets left and then sits there until someone has time to listen and call back.", solution: "Ella talks to the caller directly and books or notes what they need on the spot — nothing waits in an inbox." },
      { problem: "During busy periods, calls overlap and some get missed entirely.", solution: "Ella can answer every call at once — there's no queue and no busy signal." },
    ],
    painPointsHeadingLabel: "your",
    showAllIndustriesStrip: true,
    roiPlans: SALON_PLANS,
    roiPlanExampleLabel: "Salon & Retail",
    roiDisclaimer: "This example uses our lowest-cost plan group (Salon & Retail) — pricing varies by industry, see full pricing for your industry's real numbers.",
    integrationsVertical: "OTHER",
    integrationsSectionLabel: "your business",
    faqs: [
      {
        question: "Do I need a new phone number for customers to call?",
        answer:
          "No — you keep your existing business number and forward calls from it to Ella. The exact forwarding setup (a dial code that depends on your line type) is in Settings → Integrations, with a \"Test my setup\" button to confirm it's working.",
      },
      {
        question: "What happens if Ella can't help a caller?",
        answer: "Ella escalates anything it can't resolve straight to your team — genuine emergencies are told to hang up and dial Triple Zero (000) directly.",
      },
      {
        question: "Does Ella answer calls outside business hours too?",
        answer: "Yes — Ella can be configured to answer 24/7, or only during the hours you set, depending on how you want your business to run.",
      },
      {
        question: "How quickly can we get set up?",
        answer:
          "Sign up, complete the short setup wizard, and click Activate — that queues a real Australian phone number for your business. Number purchase is usually immediate; on the rare occasion it needs a manual step on our side, we're notified automatically and follow up directly rather than leaving you waiting.",
      },
    ],
  },
};

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const useCase = USE_CASES.find((u) => u.slug === params.slug);
  if (!useCase) return notFound();
  const rich = RICH_CONTENT[useCase.slug];

  return (
    <SolutionTemplate
      content={{
        eyebrow: "Use case · " + useCase.name,
        name: useCase.name,
        tagline: useCase.tagline,
        greeting: "Hi, this is Ella — how can I help you today?",
        callerLine: useCase.description,
        features: [
          `Purpose-built for ${useCase.name.toLowerCase()}`,
          // was "Answers in under 1 second, every time" — see
          // SolutionTemplate.tsx's audit comment for why that's unverified.
          "No rings, no hold music — Ella just answers",
          "Books directly into your real calendar",
          "Escalates anything it can't handle straight to your team",
        ],
        crumbs: [
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: useCase.name, href: `/solutions/use-case/${useCase.slug}` },
        ],
        ...rich,
      }}
    />
  );
}
