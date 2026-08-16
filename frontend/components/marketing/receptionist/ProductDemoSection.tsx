"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LiveDashboardScene } from "./LiveDashboardScene";
import { ExampleCallScene } from "./ExampleCallScene";
import { SITEWIDE_EXAMPLE_CALL } from "./data";

export function ProductDemoSection() {
  const [ctaSettled, setCtaSettled] = useState(false);
  const handleFirstPassComplete = useCallback(() => setCtaSettled(true), []);
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20" id="dashboard-live-scene">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See it in action</h2>
        <p className="mt-3 text-base text-[#64748b]">From the call happening to your dashboard updating — no video, this is the real UI.</p>
      </div>

      <motion.div
        className="mx-auto mt-10 max-w-lg rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Example call</p>
        <ExampleCallScene callerLine={SITEWIDE_EXAMPLE_CALL.callerLine} greeting={SITEWIDE_EXAMPLE_CALL.greeting} />
      </motion.div>

      <div className="mt-4 text-center text-2xl text-[#cbd5e1]" aria-hidden="true">
        ↓
      </div>

      <LiveDashboardScene onFirstPassComplete={handleFirstPassComplete} />

      <div className="mt-8 text-center">
        <motion.div
          className="inline-block"
          initial={{ opacity: 1, scale: 1 }}
          animate={ctaSettled ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Try it yourself — free for 7 days <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
