"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { PricingSection } from "./PricingSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { INDUSTRIES, INDUSTRY_PRICING, INDUSTRY_PRICING_SLUG_MAP, INDUSTRY_VERTICAL_MAP, REAL_DIFFERENTIATORS, type IndustryFaq, type PricingPlan } from "./data";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { SolutionSubNav, type SubNavItem } from "./SolutionSubNav";
import { PainPointsSection } from "./PainPointsSection";
import { RoleUseCasesSection } from "./RoleUseCasesSection";
import { InteractiveRoiCalculator } from "./InteractiveRoiCalculator";
import { OnboardingRoadmapSection } from "./OnboardingRoadmapSection";
import { VerticalIntegrationsSection } from "./VerticalIntegrationsSection";
import { CaseStudiesSection } from "./CaseStudiesSection";
import { LiveDashboardScene } from "./LiveDashboardScene";
import { ExampleCallScene } from "./ExampleCallScene";

export interface SolutionContent {
  eyebrow: string;
  name: string;
  tagline: string;
  greeting: string;
  callerLine: string;
  features: string[];
  // Optional — only the /solutions/[industry] pages have real overview/FAQ
  // content today; /solutions/use-case/[slug] and /solutions/size/[slug]
  // reuse this same template without them.
  overview?: string;
  faqs?: IndustryFaq[];
  crumbs: Crumb[];
  // Only set on real industry pages — drives the "other industries"
  // cross-links, AND (2026-08-15) the richer per-vertical content blocks
  // below, which look themselves up from INDUSTRIES/INDUSTRY_VERTICAL_MAP
  // rather than needing every page.tsx to thread new props through.
  currentIndustrySlug?: string;
  // 2026-08-18 — use-case/size elite pass. A cross-industry page's `name`
  // ("Inbound Call Answering", "Solo Practitioner") doesn't read naturally
  // in the template's generic "for {name}" sentences the way an industry
  // name does. Optional override, substituted only in those two spots;
  // industry pages never set this so their existing copy is untouched.
  descriptor?: string;
  // The same PainPoints/ROI/Integrations blocks the vertical pages get,
  // for a page that isn't scoped to one industry (no `currentIndustrySlug`)
  // — real content the page.tsx author supplies directly instead of it
  // being looked up from INDUSTRIES. Ignored (industry data wins) on real
  // industry pages.
  painPoints?: { problem: string; solution: string }[];
  painPointsHeadingLabel?: string;
  roiPlans?: PricingPlan[];
  roiPlanExampleLabel?: string;
  roiDisclaimer?: string;
  integrationsVertical?: string;
  integrationsSectionLabel?: string;
  // Renders a "built for every industry we support" link strip — for pages
  // whose concept spans every vertical rather than being tied to one.
  showAllIndustriesStrip?: boolean;
}

export function SolutionTemplate({ content }: { content: SolutionContent }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const otherIndustries = content.currentIndustrySlug
    ? INDUSTRIES.filter((i) => i.slug !== content.currentIndustrySlug).slice(0, 4)
    : [];

  // The actual bug this page used to have: PricingSection/FinalCtaSection
  // below always showed Medical & Dental's $399 (or the sitewide-cheapest
  // $99) regardless of which vertical page this was — /solutions/mechanic
  // and /solutions/salon both silently showed the wrong tier. Resolve this
  // page's own vertical through INDUSTRY_PRICING_SLUG_MAP so each
  // /solutions/<vertical> page opens on and quotes its own real entry
  // price. Undefined (falls back to each component's own default) for the
  // use-case/size template pages, which don't have a single vertical.
  const pricingSlug = content.currentIndustrySlug ? INDUSTRY_PRICING_SLUG_MAP[content.currentIndustrySlug] : undefined;
  const industryPricingGroup = pricingSlug ? INDUSTRY_PRICING.find((g) => g.slug === pricingSlug) : undefined;
  const entryPrice = industryPricingGroup?.plans[0]?.priceMonthly;

  // 2026-08-15 richer-vertical-page pass — the full industry record (real
  // pain points, roles) and its real Vertical-enum key (for the
  // integrations catalog), both looked up the same way pricingSlug is
  // above: derived here, not threaded through every page.tsx.
  const industry = content.currentIndustrySlug ? INDUSTRIES.find((i) => i.slug === content.currentIndustrySlug) : undefined;
  const vertical = content.currentIndustrySlug ? INDUSTRY_VERTICAL_MAP[content.currentIndustrySlug] : undefined;

  // Cross-industry pages (use-case/size) supply this content directly since
  // there's no single INDUSTRIES entry to look it up from — industry pages
  // always win when both are somehow present.
  const descriptor = content.descriptor ?? content.name.toLowerCase();
  const painPoints = industry ? industry.painPoints : content.painPoints;
  const roiPlans = industryPricingGroup ? industryPricingGroup.plans : content.roiPlans;
  const integrationsVertical = vertical ?? content.integrationsVertical;

  const subNavItems: SubNavItem[] = industry
    ? [
        { id: "pain-points", label: "Pain points" },
        { id: "use-cases", label: "Use cases" },
        { id: "roi-calculator", label: "ROI" },
        { id: "integrations", label: "Integrations" },
        { id: "analytics-preview", label: "See it live" },
        { id: "onboarding", label: "Onboarding" },
        { id: "faq", label: "FAQ" },
      ]
    : [];

  useEffect(() => {
    posthog.capture("industry_page_viewed", { industry: content.name });
  }, [content.name]);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={content.crumbs} />
      <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden pb-16 pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6366f1]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[8%] top-24 hidden h-64 w-64 rounded-full bg-[#06b6d4]/10 blur-[100px] sm:block" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] shadow-sm"
          >
            {content.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-[clamp(2rem,1.4rem+3vw,3rem)] font-bold leading-tight text-[#0f172a]"
          >
            {content.tagline}
          </motion.h1>
          {/* 2026-08-13: was "in under 1 second" — audited against real
              production data (Call.pddMs/ttfbMs, the fields built to
              measure exactly this, were 0% populated across all 257 real
              calls; see HowItWorksSection.tsx's CallVisual for the full
              finding). No real distribution exists yet to back a stopwatch
              claim, so this states what's true by design instead. The
              backend write path is now wired (server.py's
              record_call_timing -> POST /api/internal/voice/call-timing
              -> recordCallTiming, src/lib/voice/callTiming.ts) — every
              real call from here on records pddMs/ttfbMs. Once Twilio is
              reactivated and ~50+ real calls exist, pull the real p90:
              if genuinely sub-second, this copy can go back to a real
              number; if it's ~1.3s, say "about a second" and mean it. */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 text-lg text-[#475569]">
            Ella answers every call for {descriptor}, 24 hours a day — no rings, no hold music.
          </motion.p>
          {/* 2026-08-15 — the "value proposition" economic point, kept
              qualitative rather than a fabricated conversion-rate stat (a
              specific "$X per missed call" claim would need real
              measured-outcome data this product doesn't have yet). */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-2 text-sm font-medium text-[#4f46e5]">
            A missed call is a booking someone else answers instead.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90">
              Start 7-day free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] hover:bg-slate-50">
              Try the demo
            </Link>
          </motion.div>
        </div>
      </section>

      {subNavItems.length > 0 && <SolutionSubNav items={subNavItems} />}

      <section className="py-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-wide text-[#475569]">Example call</p>
          <ExampleCallScene callerLine={content.callerLine} greeting={content.greeting} />
        </div>
      </section>

      {content.overview && (
        <section className="py-14">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-base leading-relaxed text-[#475569]">{content.overview}</p>
          </div>
        </section>
      )}

      {painPoints && painPoints.length > 0 && (
        <PainPointsSection industryName={content.name} painPoints={painPoints} headingLabel={industry ? undefined : content.painPointsHeadingLabel} />
      )}

      <section className="py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">Built for {descriptor}</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {content.features.map((f) => (
            <div key={f} className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10b981]" />
              <p className="text-sm text-[#475569]">{f}</p>
            </div>
          ))}
        </div>
      </section>

      {content.showAllIndustriesStrip && (
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-xl font-bold text-[#0f172a]">Built for every industry we support</h2>
            <p className="mt-2 text-center text-sm text-[#475569]">The same Ella, tuned to how your industry actually answers its phones.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {INDUSTRIES.map((i) => (
                <Link
                  key={i.slug}
                  href={`/solutions/${i.slug}`}
                  className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] shadow-sm hover:border-[#c7d2fe] hover:text-[#0f172a]"
                >
                  {i.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {industry && <RoleUseCasesSection industryName={content.name} roles={industry.roles} />}

      {roiPlans && roiPlans.length > 0 && (
        <InteractiveRoiCalculator
          industryName={content.name}
          plans={roiPlans}
          planExampleLabel={industry ? undefined : content.roiPlanExampleLabel}
          disclaimerNote={industry ? undefined : content.roiDisclaimer}
        />
      )}

      {integrationsVertical && (
        <VerticalIntegrationsSection
          industryName={content.name}
          vertical={integrationsVertical}
          sectionLabel={industry ? undefined : content.integrationsSectionLabel}
        />
      )}

      {industry && (
        <section id="analytics-preview" className="py-14">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">See the dashboard in action</h2>
            <p className="mt-3 text-[#475569]">The real ZyncoAI dashboard interface, shown with clearly-labelled sample data.</p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl px-6">
            <LiveDashboardScene labels={industry.dashboardPreview} />
          </div>
        </section>
      )}

      {industry && <OnboardingRoadmapSection />}

      {/* 2026-08-10 — replaced a fabricated testimonial (invented name,
          invented business, invented quote) with real, verifiable
          differentiators. ZyncoAI has no customers to quote yet — this
          slot returns to a real testimonial only once a real one exists.
          Sydney residency is a genuinely true claim as of the 2026-08-06
          Neon cutover (GET /api/business/compliance reports
          dataResidency.compliant: true) — see REAL_DIFFERENTIATORS in
          ./data for the single source of truth these are pulled from.
          2026-08-15: also doubles as this page's honest COMPLIANCE +
          SUPPORT content blocks — no separate section needed, and no risk
          of the two drifting into different wording for the same facts. */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#475569]">Built early, built honestly</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {REAL_DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10b981]" />
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{d.title}</p>
                  <p className="mt-0.5 text-sm text-[#475569]">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {industry && <CaseStudiesSection industryName={content.name} />}

      {content.faqs && content.faqs.length > 0 && (
        <section id="faq" className="py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">Frequently asked questions</h2>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {content.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.question} className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-base font-semibold text-[#0f172a]">{f.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#475569] transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed text-[#475569]">{f.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: content.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            }}
          />
        </section>
      )}

      {otherIndustries.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-xl font-bold text-[#0f172a]">Also built for</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {otherIndustries.map((i) => (
                <Link
                  key={i.slug}
                  href={`/solutions/${i.slug}`}
                  className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] shadow-sm hover:border-[#c7d2fe] hover:text-[#0f172a]"
                >
                  {i.name}
                </Link>
              ))}
              <Link
                href="/resources/blog"
                className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] shadow-sm hover:border-[#c7d2fe] hover:text-[#0f172a]"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      )}

      <PricingSection showTitle={false} defaultIndustry={pricingSlug} />
      <FinalCtaSection price={entryPrice} />
    </div>
  );
}
