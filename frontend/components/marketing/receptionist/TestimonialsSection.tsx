"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "./data";

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Trusted by Australian practices</h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#475569]">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 border-t border-[#e2e8f0] pt-4">
              <p className="text-sm font-semibold text-[#0f172a]">{t.name}</p>
              <p className="text-xs text-[#94a3b8]">{t.role} · {t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
