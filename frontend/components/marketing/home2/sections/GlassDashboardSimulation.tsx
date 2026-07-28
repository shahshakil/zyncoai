"use client";

import { motion } from "framer-motion";

export default function GlassDashboardSimulation() {
  return (
    <section className="relative overflow-hidden bg-[#f7f3f1] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.08),transparent_20%),radial-gradient(circle_at_80%_22%,rgba(249,115,22,0.06),transparent_20%),radial-gradient(circle_at_50%_60%,rgba(168,85,247,0.06),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Dashboard simulation
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            A product surface users can trust in seconds.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Buyers should instantly understand that ZyncoAI is not only beautiful — it is
            operational. Metrics, actions, workflows, approvals, and enterprise trust all
            need to feel present in the UI.
          </p>
        </div>

        <div className="mt-12 rounded-[40px] border border-white/70 bg-white/60 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
          <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
            <div className="rounded-[30px] border border-white/70 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Navigation</div>
              <div className="mt-5 space-y-2">
                {[
                  "Automation",
                  "Workflows",
                  "Templates",
                  "Agents",
                  "Approvals",
                  "Analytics",
                  "Audit",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm",
                      i === 1
                        ? "border border-violet-200 bg-violet-50 text-violet-700"
                        : "border border-transparent bg-zinc-50 text-zinc-600",
                    ].join(" ")}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-orange-200 bg-orange-50 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-orange-600">
                  Quick action
                </div>
                <div className="mt-2 text-sm font-medium text-zinc-900">
                  Launch a workflow from template
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Runs today", "1,542"],
                  ["Time saved", "17h"],
                  ["Success rate", "99.99%"],
                  ["Recovered", "86%"],
                ].map(([label, value], i) => (
                  <motion.div
                    key={label}
                    className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-sm"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                      {value}
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-zinc-100">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${68 + i * 6}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.2 + i * 0.05 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
                <div className="rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        Active workflows
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-zinc-950">
                        Production workflow list
                      </div>
                    </div>
                    <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500">
                      Updated now
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        name: "Lead qualification + meeting routing",
                        badge: "Live",
                        desc: "Webhook → AI Planner → CRM → Slack → Calendar",
                      },
                      {
                        name: "Customer onboarding triage",
                        badge: "Healthy",
                        desc: "Form → classify → docs → approval → ticket",
                      },
                      {
                        name: "Finance reminder automation",
                        badge: "Watching",
                        desc: "Schedule → detect due invoices → send sequence",
                      },
                      {
                        name: "Enterprise support escalation",
                        badge: "Live",
                        desc: "Email → summarize → assign → enrich → Slack",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.name}
                        className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold text-zinc-950">{item.name}</div>
                            <div className="mt-1 text-sm text-zinc-600">{item.desc}</div>
                          </div>
                          <div
                            className={[
                              "rounded-full px-3 py-1 text-xs font-medium",
                              item.badge === "Live"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.badge === "Healthy"
                                ? "bg-violet-50 text-violet-700"
                                : "bg-amber-50 text-amber-700",
                            ].join(" ")}
                          >
                            {item.badge}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      Task completed
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        "Calendar booked",
                        "Email sent",
                        "CRM updated",
                        "Audit evidence captured",
                      ].map((item, i) => (
                        <motion.div
                          key={item}
                          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                        >
                          ✓ {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-zinc-900/8 bg-[#0c0c14] p-5 shadow-[0_20px_100px_rgba(109,40,217,0.18)]">
                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      Mini canvas
                    </div>
                    <div className="mt-4 h-[220px] rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.24),rgba(9,9,15,0.98)_60%)] p-4">
                      <div className="relative h-full rounded-[20px] border border-white/8 bg-white/[0.03]">
                        <motion.div
                          className="absolute left-4 top-5 rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2 text-xs text-white"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.3, repeat: Infinity }}
                        >
                          Trigger
                        </motion.div>
                        <motion.div
                          className="absolute left-[38%] top-[38%] rounded-2xl border border-violet-300/20 bg-violet-400/15 px-4 py-3 text-xs text-white"
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                        >
                          AI Agent
                        </motion.div>
                        <motion.div
                          className="absolute right-4 bottom-5 rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2 text-xs text-white"
                          animate={{ y: [0, 4, 0] }}
                          transition={{ duration: 2.7, repeat: Infinity }}
                        >
                          Output
                        </motion.div>

                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 340 220" fill="none">
                          <motion.path
                            d="M60 54 C 120 54, 130 88, 178 110"
                            stroke="url(#dashA)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.25 }}
                          />
                          <motion.path
                            d="M204 116 C 250 116, 265 152, 292 170"
                            stroke="url(#dashB)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.35, delay: 0.25 }}
                          />
                          <defs>
                            <linearGradient id="dashA" x1="0" y1="0" x2="340" y2="0">
                              <stop offset="0%" stopColor="#60a5fa" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <linearGradient id="dashB" x1="0" y1="0" x2="340" y2="0">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
