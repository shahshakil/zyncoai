import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY_SIZES, INDUSTRY_PRICING } from "@/components/marketing/receptionist/data";
import { SolutionTemplate, type SolutionContent } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return COMPANY_SIZES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const size = COMPANY_SIZES.find((s) => s.slug === params.slug);
  if (!size) return {};
  return {
    title: `${size.name} | ZyncoAI`,
    description: size.tagline,
    alternates: { canonical: `/solutions/size/${size.slug}`, languages: { "en-AU": `/solutions/size/${size.slug}`, en: `/solutions/size/${size.slug}` } },
  };
}

// 2026-08-18 — elite pass for Solo Practitioner only (per-slug, not
// sitewide: the other 4 company-size pages weren't part of this rebuild and
// keep their existing generic template output below). Real content only —
// see the matching comment in the use-case [slug] page.tsx for the same
// pattern and reasoning.
// Cheapest real plan group sitewide (Salon & Retail, $99/mo) — used as the
// ROI calculator's example set since this page isn't scoped to one industry.
const SALON_PLANS = INDUSTRY_PRICING.find((g) => g.slug === "salon")!.plans;

const RICH_CONTENT: Record<string, Partial<SolutionContent>> = {
  solo: {
    greeting: "Hi, this is Ella — how can I help you today?",
    callerLine: "Hi, is now an ok time? I can call back if you're with someone.",
    descriptor: "you",
    features: [
      "Answers while you're with a client, mid-job, or after hours — you don't have to stop what you're doing",
      "Books directly into your real calendar, so you don't have to call back to check availability",
      "Set up in minutes — no IT team required",
      "One flat monthly fee, no per-seat pricing — no receptionist salary or superannuation to budget for",
    ],
    overview:
      "When you're a one-person operation, the phone doesn't stop ringing just because you're busy. Every call you can't take right away is either a missed booking or an interruption to whatever you're actually doing. Ella answers for you — while you're with a client, on a job, or off the clock — and only brings you in when something actually needs your attention.",
    painPoints: [
      { problem: "The phone rings while you're with a client — you can't exactly ask them to hold.", solution: "Ella answers instead of you, so you can stay focused on the person actually in front of you." },
      {
        problem: "A missed call during a job usually doesn't get a callback until you're free, and by then some callers have already gone elsewhere.",
        solution: "Ella answers immediately and books or notes what the caller needs, so nothing depends on you finding a free moment.",
      },
      {
        problem: "Being the only person answering the phone means either you're on call every evening, or calls go unanswered outside work hours.",
        solution: "Ella works 24/7 without you needing to be reachable outside your own hours.",
      },
    ],
    painPointsHeadingLabel: "your",
    showAllIndustriesStrip: true,
    roiPlans: SALON_PLANS,
    roiPlanExampleLabel: "Salon & Retail",
    roiDisclaimer:
      "As a solo practitioner your real starting price depends on your industry — from $99/month (Salon & Retail) up to $349-$399/month for more regulated industries like Legal or Banking. This example uses our lowest-cost plan group; see full pricing for your industry's real numbers.",
    integrationsVertical: "OTHER",
    integrationsSectionLabel: "your business",
    faqs: [
      {
        question: "Is Ella really worth it if it's just me, or is this built for bigger teams?",
        answer:
          "It's the same product either way — one flat monthly fee, no per-seat pricing. As a solo practitioner you get Ella and the full dashboard from day one, without needing an IT team or a bigger staff to make it worthwhile.",
      },
      {
        question: "What's the cheapest plan I could actually get on?",
        answer:
          "It depends on your industry — plans start from $99/month (Salon & Retail) up to $349-$399/month for more heavily regulated industries like Legal or Banking. Every plan gets the exact same full ZyncoAI platform; they only differ on how many call minutes are included.",
      },
      {
        question: "Do I have to be available if Ella can't handle something?",
        answer:
          "Only when it actually needs you — Ella escalates anything it can't resolve straight to your team, which as a solo practitioner is you. Genuine emergencies are told to hang up and dial Triple Zero (000) directly.",
      },
      {
        question: "How quickly can we get set up?",
        answer:
          "Sign up, complete the short setup wizard, and click Activate — that queues a real Australian phone number for your business. Number purchase is usually immediate; on the rare occasion it needs a manual step on our side, we're notified automatically and follow up directly rather than leaving you waiting.",
      },
    ],
  },
};

export default function CompanySizePage({ params }: { params: { slug: string } }) {
  const size = COMPANY_SIZES.find((s) => s.slug === params.slug);
  if (!size) return notFound();
  const rich = RICH_CONTENT[size.slug];

  return (
    <SolutionTemplate
      content={{
        eyebrow: "For · " + size.name,
        name: size.name,
        tagline: size.tagline,
        greeting: "Hi, this is Ella — how can I help you today?",
        callerLine: size.description,
        features: [
          `Scaled to fit a ${size.name.toLowerCase()}`,
          "Set up in minutes, no IT team required",
          "Grows with you — no re-platforming later",
          "One flat monthly fee, no per-seat pricing",
        ],
        crumbs: [
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: size.name, href: `/solutions/size/${size.slug}` },
        ],
        ...rich,
      }}
    />
  );
}
