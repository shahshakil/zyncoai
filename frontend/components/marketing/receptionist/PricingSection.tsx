"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import { COMMON_FEATURES, INDUSTRY_PRICING } from "./data";

export function PricingSection({ showTitle = true, defaultIndustry }: { showTitle?: boolean; defaultIndustry?: string }) {
  const [annual, setAnnual] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Falls back to INDUSTRY_PRICING[0] ("medical") only when no valid slug is
  // passed — SolutionTemplate passes the page's own vertical (via
  // INDUSTRY_PRICING_SLUG_MAP) so /solutions/mechanic opens on Mechanic's
  // own tab instead of always defaulting to Medical & Dental regardless of
  // which vertical page it's rendered on.
  const [industry, setIndustry] = useState(
    (defaultIndustry && INDUSTRY_PRICING.some((g) => g.slug === defaultIndustry) ? defaultIndustry : INDUSTRY_PRICING[0].slug)
  );
  const pathname = usePathname();

  const activeGroup = INDUSTRY_PRICING.find((g) => g.slug === industry) || INDUSTRY_PRICING[0];
  const activePlans = activeGroup.plans;

  useEffect(() => {
    if (pathname === "/pricing") posthog.capture("pricing_viewed", {});
  }, [pathname]);

  function toggleExpanded(key: string) {
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }

  return (
    <section className="py-20">
      {showTitle && (
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-[#475569]">All plans billed in AUD. 7-day free trial included. A one-time setup fee applies, varying by plan.</p>
        </div>
      )}

      <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6366f1]" />
        <p className="text-sm text-[#0f172a]">
          Every plan includes the complete ZyncoAI platform — all features, all dashboards, all integrations. Plans differ only by minutes included.
        </p>
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-center text-sm text-[#475569]">
        <span>Pricing varies by industry — select yours below.</span>
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
        {INDUSTRY_PRICING.map((g) => (
          <button
            key={g.slug}
            onClick={() => setIndustry(g.slug)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              g.slug === industry ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5]" : "border-[#e2e8f0] bg-white text-[#475569] hover:bg-slate-50"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-2 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-center text-xs text-[#475569]">
        <span>Don&rsquo;t see your industry?</span>
        <Link href="/contact" className="font-semibold text-[#4f46e5] underline underline-offset-2">
          Contact us →
        </Link>
      </div>

      <div className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-full border border-[#e2e8f0] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <button onClick={() => setAnnual(false)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!annual ? "bg-slate-100 text-[#0f172a]" : "text-[#475569]"}`}>
          Monthly
        </button>
        <button onClick={() => setAnnual(true)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${annual ? "bg-slate-100 text-[#0f172a]" : "text-[#475569]"}`}>
          Annual <span className="text-emerald-700">(save 20%)</span>
        </button>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {activePlans.map((plan, i) => {
          const price = annual ? plan.priceAnnualMonthly : plan.priceMonthly;
          const isOpen = expanded.has(plan.key);
          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col rounded-2xl border-t-4 border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${plan.popular ? "lg:-mt-3 lg:pb-9" : ""}`}
              style={{ borderTopColor: plan.borderColor }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#475569]">{plan.name}</h3>
              <div className="mt-2">
                {plan.priceMonthly > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-[#0f172a]">AUD ${price}</span>
                    <span className="text-sm text-[#475569]">/month</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[#0f172a]">Contact us</span>
                )}
              </div>
              <p className="mt-2 text-xs text-[#475569]">{plan.perMinute}</p>

              <ul className="mt-4 space-y-2">
                {[plan.minutesIncluded, plan.locations, plan.support].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13px] leading-[1.6] text-[#475569]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" /> {t}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => toggleExpanded(plan.key)}
                className="mt-4 flex w-full items-center justify-between rounded-lg border border-[#e2e8f0] bg-slate-50 px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:bg-slate-100"
              >
                All features included
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <ul className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3">
                  {COMMON_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] leading-[1.6] text-[#475569]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" /> {f}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={plan.priceMonthly === 0 ? "/contact" : `/signup?plan=${plan.key}`}
                onClick={() => {
                  if (plan.priceMonthly !== 0 && typeof window !== "undefined") sessionStorage.setItem("zynco_selected_plan", plan.key);
                  posthog.capture("plan_selected", { plan: plan.key });
                }}
                className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-white hover:opacity-90"
                    : "border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-[#475569]">
        One-time setup fee ({activeGroup.label}): {activePlans.map((p) => `${p.name} ${p.perMinute.match(/AUD \$[\d,]+ setup fee/)?.[0] || ""}`).join(" · ")}
      </p>
    </section>
  );
}
