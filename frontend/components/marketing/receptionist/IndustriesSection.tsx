"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope, Smile, Scale, Wrench, UtensilsCrossed, Landmark, GraduationCap, Sparkles, PiggyBank, Home, ShieldCheck, type LucideIcon,
} from "lucide-react";
import { INDUSTRIES, INDUSTRY_PRICING, INDUSTRY_PRICING_SLUG_MAP, REAL_DIFFERENTIATORS } from "./data";

const ICONS: Record<string, LucideIcon> = {
  healthcare: Stethoscope,
  dental: Smile,
  legal: Scale,
  mechanic: Wrench,
  restaurant: UtensilsCrossed,
  bank: Landmark,
  university: GraduationCap,
  salon: Sparkles,
  "financial-services": PiggyBank,
  "home-services": Home,
};

// 2026-08-10 — removed a fabricated "N calls handled today" counter (we
// have zero live customers to have handled any calls). Each card now shows
// its real entry price via the same INDUSTRY_PRICING_SLUG_MAP resolution
// SolutionTemplate.tsx already uses, so nothing here can drift from the
// real plan data. The section-level strip below reuses REAL_DIFFERENTIATORS
// (./data) rather than duplicating another invented trust signal.
function industryFromPrice(slug: string): number | undefined {
  const pricingSlug = INDUSTRY_PRICING_SLUG_MAP[slug];
  return pricingSlug ? INDUSTRY_PRICING.find((g) => g.slug === pricingSlug)?.plans[0]?.priceMonthly : undefined;
}

export function IndustriesSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="industries" className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4f46e5]">
          Early access
        </span>
        <h2 className="mt-4 text-3xl font-bold text-[#0f172a] sm:text-4xl">Built for every Australian business</h2>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {INDUSTRIES.map((ind, i) => {
          const Icon = ICONS[ind.slug] || Sparkles;
          const isHovered = hovered === ind.slug;
          const fromPrice = industryFromPrice(ind.slug);
          return (
            <Link key={ind.slug} href={`/solutions/${ind.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04 }}
                onHoverStart={() => setHovered(ind.slug)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:border-[#6366f1]/40 hover:shadow-[0_4px_16px_rgba(99,102,241,0.15)]"
              >
                {!isHovered ? (
                  <>
                    <Icon className="h-6 w-6 text-[#6366f1]" />
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{ind.name}</p>
                      {fromPrice != null && (
                        <p className="mt-0.5 text-[11px] text-[#475569]">From ${fromPrice}/mo</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-wide text-[#475569]">Ella says</p>
                    <p className="mt-1 text-xs leading-5 text-[#475569]">&ldquo;{ind.greeting}&rdquo;</p>
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
        {REAL_DIFFERENTIATORS.map((d) => (
          <div key={d.title} className="flex items-center gap-2 text-xs font-medium text-[#475569]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#10b981]" />
            {d.title}
          </div>
        ))}
      </div>
    </section>
  );
}
