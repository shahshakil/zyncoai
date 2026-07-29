"use client";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden bg-[#f8fafc] pb-16 pt-32">
      {/* dot-pattern background, same motif as the dashboard */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(#4f46e508 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4f46e5]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f46e5] shadow-sm"
        >
          One platform, every industry
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-[42px] font-bold leading-[1.1] tracking-tight text-[#0f172a] [text-wrap:balance] sm:text-5xl lg:text-[64px]"
        >
          One AI Receptionist.{" "}
          <span className="bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] bg-clip-text text-transparent">Every vertical.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#475569]"
        >
          Ella answers every call in under a second, completes the booking, and automates the follow-up that comes next — one AI receptionist built to
          run across every industry, day or night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-8 flex items-center justify-center"
        >
          <Link
            href="/signup"
            onClick={() => posthog.capture("hero_cta_clicked", { button: "start_free_trial" })}
            className="group inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition hover:opacity-90"
          >
            Start Free Trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
