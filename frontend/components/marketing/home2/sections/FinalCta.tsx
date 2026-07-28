"use client";

import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#070710] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.24),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.14),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          className="overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] px-8 py-14 shadow-[0_40px_140px_rgba(76,29,149,0.28)] backdrop-blur-2xl md:px-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Final CTA
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Run workflows, agents, and operations from one intelligent layer.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              ZyncoAI combines builder-grade workflow power, agent-driven orchestration,
              connector execution, observability, and enterprise control — in a surface
              designed to look premium and operate for real teams.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/app"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-8 text-sm font-semibold text-white shadow-[0_0_50px_rgba(139,92,246,0.35)]"
              >
                Start free
              </a>

              <a
                href="/enterprise"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-xl"
              >
                Explore enterprise
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Explain what ZyncoAI is",
                "Show why it is powerful",
                "Push users to Start free",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
