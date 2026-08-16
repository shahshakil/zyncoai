"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TRADITIONAL_RECEPTIONIST_ANNUAL_LOW, TRADITIONAL_RECEPTIONIST_ANNUAL_HIGH, type PricingPlan } from "./data";
import { CountUp } from "@/components/dashboard/ui/CountUp";

// Pure arithmetic, no invented savings percentage: the visitor's own input
// (estimated call minutes/month) picks the cheapest real plan for THIS
// vertical that covers it (from real INDUSTRY_PRICING data), compared
// against the same named, on-screen wage assumption RoiSection.tsx uses —
// never a second, drifting copy of that assumption (see
// TRADITIONAL_RECEPTIONIST_ANNUAL_LOW/HIGH in ./data). The only thing shown
// is the raw dollar arithmetic, both numbers visible, formula visible.
export function InteractiveRoiCalculator({ industryName, plans }: { industryName: string; plans: PricingPlan[] }) {
  const metered = useMemo(
    () => plans.filter((p) => p.minutesIncludedRaw !== null && p.priceMonthly > 0).sort((a, b) => a.minutesIncludedRaw! - b.minutesIncludedRaw!),
    [plans]
  );
  const unlimited = useMemo(() => plans.find((p) => p.minutesIncludedRaw === null), [plans]);

  const minMinutes = metered[0]?.minutesIncludedRaw ?? 100;
  const maxMinutes = metered.length ? Math.round(metered[metered.length - 1].minutesIncludedRaw! * 1.4) : 2000;
  const defaultMinutes = metered[Math.floor(metered.length / 2)]?.minutesIncludedRaw ?? minMinutes;

  const [minutesNeeded, setMinutesNeeded] = useState(defaultMinutes);

  const matchedPlan = metered.find((p) => p.minutesIncludedRaw! >= minutesNeeded) ?? unlimited ?? metered[metered.length - 1];
  const isUnlimitedMatch = !matchedPlan || matchedPlan.minutesIncludedRaw === null;

  const traditionalMonthlyLow = Math.round(TRADITIONAL_RECEPTIONIST_ANNUAL_LOW / 12);
  const traditionalMonthlyHigh = Math.round(TRADITIONAL_RECEPTIONIST_ANNUAL_HIGH / 12);

  const annualDeltaLow = !isUnlimitedMatch && matchedPlan ? TRADITIONAL_RECEPTIONIST_ANNUAL_LOW - matchedPlan.priceMonthly * 12 : null;
  const annualDeltaHigh = !isUnlimitedMatch && matchedPlan ? TRADITIONAL_RECEPTIONIST_ANNUAL_HIGH - matchedPlan.priceMonthly * 12 : null;

  return (
    <section id="roi-calculator" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">What would this actually cost you?</h2>
        <p className="mt-3 text-[#475569]">Move the slider to your real call volume — every number below is either a published {industryName.toLowerCase()} plan price or a named assumption, never an estimate we can&apos;t show our working for.</p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        <label className="block text-sm font-medium text-[#0f172a]">
          Estimated call minutes needed per month: <span className="font-bold text-[#4f46e5]">{minutesNeeded.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min={minMinutes}
          max={maxMinutes}
          step={Math.max(10, Math.round((maxMinutes - minMinutes) / 100))}
          value={minutesNeeded}
          onChange={(e) => setMinutesNeeded(Number(e.target.value))}
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-[#6366f1]"
        />
        <div className="mt-1 flex justify-between text-xs text-[#94a3b8]">
          <span>{minMinutes.toLocaleString()} min/mo</span>
          <span>{maxMinutes.toLocaleString()}+ min/mo</span>
        </div>

        <motion.div key={matchedPlan?.key || "unlimited"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4f46e5]">ZyncoAI — real plan</p>
            {isUnlimitedMatch ? (
              <>
                <p className="mt-2 text-2xl font-bold text-[#0f172a]">Contact sales</p>
                <p className="mt-1 text-xs text-[#475569]">{unlimited?.name || "Enterprise"} tier — unlimited minutes, custom pricing.</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-bold text-[#0f172a]">
                  $<CountUp value={matchedPlan!.priceMonthly} durationMs={400} /><span className="text-sm font-normal text-[#475569]">/month</span>
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  {matchedPlan!.name} plan — {matchedPlan!.minutesIncluded}, real published price.
                </p>
              </>
            )}
          </div>
          <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b91c1c]">Traditional receptionist</p>
            <p className="mt-2 text-2xl font-bold text-[#0f172a]">
              ${traditionalMonthlyLow.toLocaleString()}–${traditionalMonthlyHigh.toLocaleString()}
              <span className="text-sm font-normal text-[#475569]">/month</span>
            </p>
            <p className="mt-1 text-xs text-[#475569]">
              Based on a ${TRADITIONAL_RECEPTIONIST_ANNUAL_LOW.toLocaleString()}–${TRADITIONAL_RECEPTIONIST_ANNUAL_HIGH.toLocaleString()}/year AUD wage — a typical Australian admin/reception award range, not a quote.
            </p>
          </div>
        </motion.div>

        {annualDeltaLow !== null && annualDeltaHigh !== null && (
          <p className="mt-6 text-center text-sm text-[#475569]">
            At this volume: <span className="font-semibold text-[#0f172a]">$<CountUp value={Math.max(0, annualDeltaLow)} durationMs={400} />–$<CountUp value={Math.max(0, annualDeltaHigh)} durationMs={400} /> AUD/year</span> difference between the {matchedPlan?.name} plan and the traditional-receptionist wage assumption above — the raw arithmetic, not a marketing percentage.
          </p>
        )}
        <p className="mt-3 text-center text-[10px] text-[#94a3b8]">
          A real receptionist and Ella aren&apos;t a like-for-like swap — this compares call-answering cost only, using the two figures shown above.
        </p>
      </div>
    </section>
  );
}
