"use client";

import { motion } from "framer-motion";

const apps = [
  { label: "Slack", x: "8%", y: "55%" },
  { label: "Email", x: "18%", y: "25%" },
  { label: "Drive", x: "32%", y: "15%" },
  { label: "Calendar", x: "78%", y: "18%" },
  { label: "CRM", x: "88%", y: "42%" },
  { label: "Docs", x: "80%", y: "73%" },
  { label: "Tickets", x: "22%", y: "78%" },
  { label: "Payments", x: "58%", y: "84%" },
];

export default function BrainSection() {
  return (
    <section id="ai-brain" className="relative overflow-hidden bg-[#070710] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.24),transparent_22%),radial-gradient(circle_at_30%_25%,rgba(59,130,246,0.10),transparent_22%),radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.10),transparent_22%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              AI Brain
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              One intelligent layer across your tools, workflows, and decisions.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              The ZyncoAI Brain should feel like a real orchestration core — not only a title.
              It should visually show that requests come in, planning happens, connectors are chosen,
              actions are executed, and outcomes are delivered across your stack.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "AI planning across multi-step operational flows",
                "Connector-aware orchestration with runtime guardrails",
                "Business outcomes, not isolated AI chat",
                "Designed to impress users and investors immediately",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#09090f] p-6 shadow-[0_40px_140px_rgba(76,29,149,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.20),transparent_22%)]" />
            <div className="relative h-[640px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#0d0d16,#090910)]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 640" fill="none">
                {apps.map((app) => {
                  const x = parseFloat(app.x) / 100;
                  const y = parseFloat(app.y) / 100;
                  const px = 800 * x;
                  const py = 640 * y;
                  const cx = 400;
                  const cy = 320;
                  const mx = (px + cx) / 2;

                  return (
                    <g key={app.label}>
                      <path
                        d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="2"
                      />
                      <motion.path
                        d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`}
                        stroke="url(#brainFlow)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.08, pathOffset: 1 }}
                        animate={{ pathLength: 0.18, pathOffset: [1, 0] }}
                        transition={{
                          duration: 3.2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: Math.random() * 0.8,
                        }}
                      />
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="brainFlow" x1="0" y1="0" x2="800" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="45%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {apps.map((app, i) => (
                <motion.div
                  key={app.label}
                  className="absolute"
                  style={{
                    left: app.x,
                    top: app.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  animate={{ y: [0, -6, 0] }}
                >
                  <div className="flex h-16 min-w-[74px] items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(124,58,237,0.16)]">
                    {app.label}
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20 bg-[radial-gradient(circle_at_50%_50%,rgba(196,181,253,0.65),rgba(124,58,237,0.46),rgba(17,17,27,0.15))] shadow-[0_0_120px_rgba(124,58,237,0.50)]"
                animate={{ scale: [1, 1.04, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-[18px] rounded-full border border-white/10" />
                <div className="absolute inset-[38px] rounded-full border border-white/10" />
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight text-white">
                  ZyncoAI
                </div>
              </motion.div>

              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
                Brain orchestration view
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-2">
                {[
                  "Request enters the orchestration layer",
                  "Brain selects route, logic, and tools",
                  "Apps receive actions with control",
                  "Business result delivered and logged",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.06 }}
                  >
                    ✓ {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
