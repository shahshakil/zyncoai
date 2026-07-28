"use client";

import { motion } from "framer-motion";

const widgets = [
  { title: "Workflow runs", value: "14,892", color: "from-violet-500 to-fuchsia-500" },
  { title: "AI decisions", value: "2.1M", color: "from-cyan-400 to-blue-500" },
  { title: "Connectors active", value: "318", color: "from-orange-400 to-pink-500" },
  { title: "Execution success", value: "99.92%", color: "from-emerald-400 to-green-500" },
];

export default function DarkDashboardSimulation() {
  return (
    <section className="bg-[#070710] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            platform intelligence
          </div>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Live operational intelligence across workflows and agents.
          </h2>

          <p className="mt-4 text-lg text-zinc-400">
            ZyncoAI provides an operational surface where automation,
            AI planning, connectors, and workflow executions are visible
            in real-time.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {widgets.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-[#0c0c14] p-6"
            >
              <div className="text-sm text-zinc-400">{w.title}</div>

              <div className="mt-3 text-3xl font-semibold">{w.value}</div>

              <div
                className={`mt-5 h-1 rounded-full bg-gradient-to-r ${w.color}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-14 rounded-[36px] border border-white/10 bg-[#0c0c14] p-8">

          <div className="text-sm text-zinc-400">execution timeline</div>

          <div className="mt-6 h-[280px] rounded-2xl bg-[#09090f] relative overflow-hidden">

            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

            <motion.div
              animate={{ x: ["-10%", "100%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute top-1/2 h-[2px] w-[200px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
