"use client";

import { motion } from "framer-motion";

const logos = [
  "acme",
  "northstar",
  "spectrum",
  "vector",
  "lattice",
  "skygrid",
  "nova",
  "paragon",
];

export default function CustomerProof() {
  return (
    <section className="bg-[#f7f3f1] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Customer proof
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              Built to look credible to buyers and investors.
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Your homepage should answer the trust question fast: can this platform
              really operate at scale, and does it solve meaningful work?
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["3x faster", "workflow launch with reusable patterns"],
                ["86%", "auto-recovery across failed action attempts"],
                ["99.99%", "measured run completion on healthy flows"],
                ["17h", "average weekly time saved per operating team"],
              ].map(([value, label], i) => (
                <motion.div
                  key={value + label}
                  className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="text-3xl font-semibold tracking-tight text-zinc-950">{value}</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-600">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[34px] border border-zinc-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.05)]">
              <div className="text-sm font-semibold text-zinc-900">Trusted by teams building serious operations</div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {logos.map((logo, i) => (
                  <motion.div
                    key={logo}
                    className="flex h-16 items-center justify-center rounded-2xl border border-zinc-200 bg-[#fbfbfd] text-sm font-medium uppercase tracking-[0.22em] text-zinc-500"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {logo}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "AgentOps",
                  quote:
                    "ZyncoAI gave us one control plane for planner logic, outputs, and audit-friendly execution.",
                },
                {
                  title: "WorkflowOps",
                  quote:
                    "The biggest value was safe deployment — retries, versioning, rollback, and visibility in one place.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">{item.title}</div>
                  <p className="mt-4 text-base leading-8 text-zinc-700">“{item.quote}”</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
