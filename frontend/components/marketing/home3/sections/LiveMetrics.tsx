"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Runs today", value: "1,542", sub: "Real orchestration surface" },
  { label: "Avg time saved / week", value: "17h", sub: "Automation + AI assist" },
  { label: "Success rate", value: "99.99%", sub: "Guardrailed delivery" },
  { label: "Retries auto-recovered", value: "86%", sub: "Self-healing workflow layer" },
];

export default function LiveMetrics() {
  return (
    <section className="px-6 py-10 md:py-14">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-zinc-200 bg-white/75 p-8 shadow-[0_15px_50px_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            Live metrics
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">
            Live signal, not vanity.
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-700 md:text-lg">
            Operational metrics that enterprise buyers care about — reliability,
            throughput, recovery, and measurable execution quality.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-[1.6rem] border border-zinc-200 bg-[#fbfaf8] p-5 shadow-sm"
            >
              <div className="text-sm font-semibold text-zinc-600">{stat.label}</div>
              <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-zinc-950">
                {stat.value}
              </div>
              <div className="mt-3 text-sm text-zinc-600">{stat.sub}</div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-200">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.2 + index * 0.08 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-sm text-zinc-500">
          Numbers can be wired later to your real marketing analytics endpoint.
        </div>
      </div>
    </section>
  );
}
