"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden bg-gradient-to-br from-[#0b0f19] via-[#030712] to-[#0b0f19] py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4f87f0]/10 blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-2xl px-6 text-center"
      >
        <h2 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">Ready to never miss a call again?</h2>
        <p className="mt-3 text-[#94a3b8]">Join 500+ Australian practices already using ZyncoAI</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f87f0] to-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(79,135,240,0.4)] transition hover:opacity-90"
          >
            Start free trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5">
            Talk to sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
