"use client";
import { useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PricingSection } from "./PricingSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { TESTIMONIALS } from "./data";

export interface SolutionContent {
  eyebrow: string;
  name: string;
  tagline: string;
  greeting: string;
  callerLine: string;
  features: string[];
}

export function SolutionTemplate({ content }: { content: SolutionContent }) {
  const testimonial = TESTIMONIALS[content.name.length % TESTIMONIALS.length];

  useEffect(() => {
    posthog.capture("industry_page_viewed", { industry: content.name });
  }, [content.name]);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden pb-16 pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6366f1]/10 blur-[120px]" />
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
            className="mt-5 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl"
          >
            {content.tagline}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 text-lg text-[#475569]">
            Charlotte answers every call for {content.name.toLowerCase()} in under 1 second, 24 hours a day.
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

      <section className="py-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Example call</p>
          <div className="mt-4 space-y-3">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-[#0f172a]">
                <p className="mb-0.5 text-[10px] uppercase tracking-wide text-[#64748b]">Caller</p>
                {content.callerLine}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] px-4 py-2.5 text-sm text-[#0f172a]">
                <p className="mb-0.5 text-[10px] uppercase tracking-wide text-[#6366f1]">Charlotte</p>
                {content.greeting}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-[#0f172a] sm:text-3xl">Built for {content.name.toLowerCase()}</h2>
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

      <section className="py-14">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-sm leading-relaxed text-[#475569]">&ldquo;{testimonial.quote}&rdquo;</p>
          <p className="mt-4 text-sm font-semibold text-[#0f172a]">{testimonial.name}</p>
          <p className="text-xs text-[#94a3b8]">{testimonial.role} · {testimonial.location}</p>
        </div>
      </section>

      <PricingSection showTitle={false} />
      <FinalCtaSection />
    </div>
  );
}
