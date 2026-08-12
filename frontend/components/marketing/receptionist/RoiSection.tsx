"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SITEWIDE_CHEAPEST_PLAN_PRICE,
  SITEWIDE_MOST_EXPENSIVE_PLAN_PRICE,
  SITEWIDE_MIN_MINUTES_INCLUDED,
  SITEWIDE_MAX_MINUTES_INCLUDED,
} from "./data";

type Mode = "traditional" | "zynco";

// 2026-08-10 — the only figures on this page with no real source: a
// full-time receptionist's wage. Stated here as a named, on-screen
// assumption (typical Australian admin/reception award-wage range) rather
// than presented as fact, per this rebuild's "assumptions stated on-screen"
// requirement. Everything else below is computed from real INDUSTRY_PRICING
// plan data (./data), so it can't drift out of sync with what a visitor can
// actually select on /pricing.
const TRADITIONAL_ANNUAL_LOW = 65000;
const TRADITIONAL_ANNUAL_HIGH = 75000;
const TRADITIONAL_MONTHLY = Math.round(TRADITIONAL_ANNUAL_LOW / 12);

const ZYNCO_ANNUAL_LOW = SITEWIDE_CHEAPEST_PLAN_PRICE * 12;
const ZYNCO_ANNUAL_HIGH = SITEWIDE_MOST_EXPENSIVE_PLAN_PRICE * 12;
const MAX_ANNUAL_SAVINGS = TRADITIONAL_ANNUAL_HIGH - ZYNCO_ANNUAL_LOW;

function SlotPrice({ value }: { value: number }) {
  return (
    <div className="relative h-16 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center text-5xl font-bold tabular-nums text-[#0f172a]"
        >
          ${value.toLocaleString()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FeatureRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#475569]">{label}</span>
        <span className="font-medium text-[#0f172a]">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const TRADITIONAL_ROWS = [
  { label: "Operational hours", value: "38 hrs/week max", pct: 20 },
  { label: "Availability", value: "1 call at a time", pct: 20 },
  { label: "Data integration", value: "Manual EHR entry", pct: 20 },
  { label: "Languages", value: "English only", pct: 20 },
  { label: "After-hours", value: "Voicemail / missed calls", pct: 20 },
  { label: "Annual cost", value: `$${TRADITIONAL_ANNUAL_LOW.toLocaleString()} – $${TRADITIONAL_ANNUAL_HIGH.toLocaleString()} AUD`, pct: 20 },
];
const ZYNCO_ROWS = [
  { label: "Operational hours", value: "24/7/365 — never closes", pct: 100 },
  { label: "Availability", value: "Unlimited simultaneous calls", pct: 100 },
  { label: "Data integration", value: "Instant automated webhook sync", pct: 100 },
  { label: "Languages", value: "15+ auto-detected", pct: 100 },
  { label: "After-hours", value: "AI answers every call, every time", pct: 100 },
  { label: "Annual cost", value: `$${ZYNCO_ANNUAL_LOW.toLocaleString()} – $${ZYNCO_ANNUAL_HIGH.toLocaleString()} AUD`, pct: 100 },
];

export function RoiSection() {
  const [mode, setMode] = useState<Mode>("traditional");
  const isTrad = mode === "traditional";

  return (
    <section id="roi" className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">The math is simple</h2>
        <p className="mt-3 text-[#475569]">Compare what you pay now vs ZyncoAI</p>
      </div>

      <div className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-full border border-[#e2e8f0] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setMode("traditional")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isTrad ? "bg-[#b91c1c] text-white" : "text-[#475569] hover:text-[#0f172a]"}`}
        >
          Traditional Receptionist
        </button>
        <button
          onClick={() => setMode("zynco")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!isTrad ? "bg-[#047857] text-white" : "text-[#475569] hover:text-[#0f172a]"}`}
        >
          ZyncoAI Powered
        </button>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        <motion.div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-[100px]"
          animate={{ background: isTrad ? "rgba(220,38,38,0.25)" : "rgba(16,185,129,0.25)" }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative grid gap-10 md:grid-cols-2">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isTrad ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {!isTrad && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
              )}
              {isTrad ? "Standard Operations" : "24/7 Live Agent"}
            </span>

            <div className="mt-4">
              <SlotPrice value={isTrad ? TRADITIONAL_MONTHLY : SITEWIDE_CHEAPEST_PLAN_PRICE} />
              <p className="text-sm text-[#475569]">AUD/month{!isTrad && " from"}</p>
            </div>
            <p className="mt-2 text-xs text-[#475569]">
              {isTrad
                ? `Assumes a $${TRADITIONAL_ANNUAL_LOW.toLocaleString()}–$${TRADITIONAL_ANNUAL_HIGH.toLocaleString()} AUD/year full-time receptionist wage — a typical Australian admin/reception award range, not a quote`
                : `Real published plans, $${SITEWIDE_CHEAPEST_PLAN_PRICE}–$${SITEWIDE_MOST_EXPENSIVE_PLAN_PRICE}/month, including ${SITEWIDE_MIN_MINUTES_INCLUDED.toLocaleString()}–${SITEWIDE_MAX_MINUTES_INCLUDED.toLocaleString()} minutes/month depending on plan`}
            </p>

            <div className="mt-6 h-24">
              <svg viewBox="0 0 200 60" className="h-full w-full">
                <motion.polyline
                  points={isTrad ? "0,20 40,18 80,22 120,16 160,20 200,15" : "0,50 40,48 80,45 120,46 160,42 200,40"}
                  fill="none"
                  stroke={isTrad ? "#dc2626" : "#10b981"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {(isTrad ? TRADITIONAL_ROWS : ZYNCO_ROWS).map((r) => (
              <FeatureRow key={r.label} label={r.label} value={r.value} pct={r.pct} color={isTrad ? "#dc2626" : "#10b981"} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-3xl font-bold text-[#047857] sm:text-4xl">Save up to ${MAX_ANNUAL_SAVINGS.toLocaleString()} AUD per year</p>
        <p className="mx-auto mt-2 max-w-lg text-xs text-[#475569]">
          Best case: a ${TRADITIONAL_ANNUAL_HIGH.toLocaleString()} AUD/year receptionist wage (assumption, not a quote) vs. our cheapest real plan at ${SITEWIDE_CHEAPEST_PLAN_PRICE}
          /month. Your actual plan and savings depend on your industry and call volume — see real pricing below.
        </p>
      </div>
    </section>
  );
}
