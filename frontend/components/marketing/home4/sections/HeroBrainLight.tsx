"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { floatingApps, metricCards, proofLogos } from "../lib/homeData";

function appBg(index: number) {
  const variants = [
    "from-violet-500 to-fuchsia-500",
    "from-sky-500 to-blue-600",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-violet-600",
  ];
  return variants[index % variants.length];
}

export default function HeroBrainLight() {
  return (
    <section className="relative overflow-hidden bg-[#f6f2ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_28%),linear-gradient(to_bottom,#f8f5ff,#fbf9ff)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm backdrop-blur"
            >
              ZyncoAI · AI-native orchestration
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-7 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-950 md:text-7xl"
            >
              Your AI system for
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                workflows, agents,
              </span>
              <span className="block">and enterprise execution.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl"
            >
              ZyncoAI turns requests into execution. Plan with AI, call tools,
              route across apps, apply guardrails, track outcomes, and operate
              with the reliability enterprise buyers and investors expect.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_-20px_rgba(124,58,237,0.55)] transition hover:scale-[1.02]"
              >
                Start free
              </Link>

              <Link
                href="/enterprise"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white/85 px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                Explore enterprise
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              {[
                "AgentOps: planner, memory, repair loops, approvals, and optimization",
                "WorkflowOps: release safety, versioning, retries, rollback, and observability",
                "Enterprise: RBAC, auditability, secure orchestration, and policy controls",
                "AI Brain: voice, reminders, scheduling, action routing, and context-aware execution",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 text-sm leading-6 text-zinc-700 shadow-[0_14px_50px_-30px_rgba(0,0,0,0.28)] backdrop-blur"
                >
                  <span className="mr-2 text-violet-600">✦</span>
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              {proofLogos.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-[36px] border border-white/70 bg-white/55 p-4 shadow-[0_40px_120px_-40px_rgba(109,40,217,0.45)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[28px] border border-white/75 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),rgba(79,70,229,0.12)_30%,rgba(255,255,255,0.85)_72%)] p-4 md:p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_45%)]" />

                <div className="relative h-[520px] w-full overflow-hidden rounded-[24px]">
                  <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(124,58,237,0.18)_30%,rgba(99,102,241,0.06)_52%,transparent_70%)] blur-xl" />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/45"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-[256px] w-[256px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/40"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-[208px] w-[208px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/40"
                  />

                  <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 opacity-20 blur-2xl" />

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(124,58,237,0.25)",
                        "0 0 50px rgba(124,58,237,0.35)",
                        "0 0 0px rgba(124,58,237,0.25)",
                      ],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/2 top-1/2 flex h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(216,180,254,0.9)_35%,rgba(109,40,217,0.9)_75%,rgba(67,56,202,0.95))] text-center shadow-[0_30px_120px_-25px_rgba(109,40,217,0.75)]"
                  >
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                        ZyncoAI
                      </div>
                      <div className="mt-2 text-2xl font-black tracking-tight text-white">
                        AI Brain
                      </div>
                      <div className="mt-2 text-xs text-white/80">
                        Plan · Route · Execute
                      </div>
                    </div>
                  </motion.div>

                  {floatingApps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -10, 0],
                        x: [0, 6, 0],
                      }}
                      transition={{
                        opacity: { duration: 0.45, delay: app.delay },
                        scale: { duration: 0.45, delay: app.delay },
                        y: {
                          duration: 4.8 + index * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        x: {
                          duration: 5.4 + index * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="absolute"
                      style={{ left: `${app.x}%`, top: `${app.y}%` }}
                    >
                      <div className="group relative">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br ${appBg(
                            index
                          )} text-sm font-bold text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]`}
                        >
                          {app.short}
                        </div>
                        <div className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[11px] font-semibold text-zinc-700 opacity-0 shadow-sm transition group-hover:opacity-100">
                          {app.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <svg className="absolute inset-0 h-full w-full">
                    {floatingApps.map((app, index) => (
                      <motion.line
                        key={app.id}
                        x1="50%"
                        y1="50%"
                        x2={`${app.x + 3}%`}
                        y2={`${app.y + 3}%`}
                        stroke={index % 2 === 0 ? "rgba(139,92,246,0.35)" : "rgba(99,102,241,0.28)"}
                        strokeWidth="2"
                        strokeDasharray="6 10"
                        initial={{ pathLength: 0, opacity: 0.25 }}
                        animate={{ pathLength: 1, opacity: [0.2, 0.6, 0.2] }}
                        transition={{
                          pathLength: { duration: 1.2, delay: 0.2 + index * 0.08 },
                          opacity: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                        }}
                      />
                    ))}
                  </svg>

                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[6%] top-[8%] max-w-[190px] rounded-3xl border border-white/80 bg-white/78 p-4 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.25)] backdrop-blur"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                      Intent
                    </div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-zinc-900">
                      “Route a high-intent lead, alert sales, create CRM record,
                      and book a meeting.”
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], y: [0, -4, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[8%] right-[4%] max-w-[210px] rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-[0_30px_80px_-30px_rgba(109,40,217,0.7)]"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75">
                      Outcome
                    </div>
                    <ul className="mt-3 space-y-2 text-sm font-medium">
                      <li>✓ Calendar booked</li>
                      <li>✓ Email sent</li>
                      <li>✓ CRM updated</li>
                      <li>✓ Audit log written</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.06 }}
              className="rounded-[28px] border border-white/75 bg-white/80 p-5 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.28)] backdrop-blur"
            >
              <div className="text-sm font-medium text-zinc-500">{metric.label}</div>
              <div className="mt-3 text-4xl font-black tracking-tight text-zinc-950">
                {metric.value}
              </div>
              <div className="mt-3 text-sm leading-6 text-zinc-600">
                {metric.note}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${72 + index * 6}%` }}
                  transition={{ duration: 1.2, delay: 0.4 + index * 0.08 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
