"use client";
import { motion } from "framer-motion";
import { ONBOARDING_STEPS } from "./data";

// Visual timeline of the REAL signup -> live flow (see ONBOARDING_STEPS in
// ./data, traced against backend/src/api/routes/business/onboarding.ts and
// lib/voice/numberProvisioning.ts). Same steps for every vertical — this
// component takes no per-industry props on purpose.
export function OnboardingRoadmapSection() {
  return (
    <section id="onboarding" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">From signup to Ella answering calls</h2>
        <p className="mt-3 text-[#475569]">The real steps — nothing skipped, nothing sped up for the page.</p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl px-6">
        <ol className="relative space-y-8 border-l-2 border-[#e2e8f0] pl-8">
          {ONBOARDING_STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative"
            >
              <span className="absolute -left-[calc(2rem+1px)] flex h-8 w-8 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-base font-semibold text-[#0f172a]">{step.title}</p>
              <p className="mt-1 text-sm text-[#475569]">{step.detail}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
