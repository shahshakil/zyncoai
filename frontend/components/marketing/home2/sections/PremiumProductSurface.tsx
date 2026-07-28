"use client";

import { motion } from "framer-motion";

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{value}</div>
      <div className="mt-2 text-sm text-zinc-600">{hint}</div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: "78%" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function GlassCard({
  title,
  lines,
  tag,
}: {
  title: string;
  lines: string[];
  tag: string;
}) {
  return (
    <motion.div
      className="rounded-[30px] border border-white/40 bg-white/65 p-5 shadow-[0_18px_80px_rgba(99,102,241,0.12)] backdrop-blur-2xl"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className="inline-flex rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {tag}
      </div>
      <div className="mt-4 text-lg font-semibold text-zinc-950">{title}</div>
      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <div
            key={line}
            className="rounded-2xl border border-white/50 bg-white/60 px-3 py-2 text-sm text-zinc-700"
          >
            {line}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PremiumProductSurface() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1ee] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(168,85,247,0.08),transparent_20%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.06),transparent_22%),radial-gradient(circle_at_55%_60%,rgba(236,72,153,0.05),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Product surface
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            Real product feel. Not a fake marketing shell.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            ZyncoAI should feel like a live operating system for automation: workflows,
            agents, approvals, observability, and enterprise control in one surface.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          <MetricCard
            label="Runs today"
            value="1,542"
            hint="Workflow and agent executions across connected systems."
          />
          <MetricCard
            label="Time saved"
            value="17h"
            hint="Average weekly time returned to operating teams."
          />
          <MetricCard
            label="Success rate"
            value="99.99%"
            hint="Measured completion of orchestrated production actions."
          />
          <MetricCard
            label="Auto-recovered"
            value="86%"
            hint="Retries, repair logic, and safe fallback handling."
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-white/70 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Operator dashboard
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Execution, observability, and action outcomes
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                {[
                  {
                    title: "AI Planner",
                    desc: "Chooses tools, resolves context, creates safe action order.",
                  },
                  {
                    title: "Execution",
                    desc: "Runs actions with retries, limits, isolation, and auditing.",
                  },
                  {
                    title: "Repair loop",
                    desc: "Detects failure, retries, degrades safely, escalates when needed.",
                  },
                  {
                    title: "Outputs",
                    desc: "Slack, CRM, calendar, email, ticketing, and internal events.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="rounded-[24px] border border-white/60 bg-white/75 p-4 shadow-sm"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-semibold text-zinc-900">{item.title}</div>
                      <div className="text-xs text-zinc-400">Step {i + 1}</div>
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</div>
                  </motion.div>
                ))}
              </div>

              <div className="relative rounded-[30px] border border-zinc-900/8 bg-[#0b0b12] p-4 shadow-[0_20px_100px_rgba(109,40,217,0.18)]">
                <div className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.35),rgba(9,9,15,0.96)_58%)] p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-zinc-300">Run preview</div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Active
                    </div>
                  </div>

                  <div className="mt-5 relative h-[280px] rounded-[20px] border border-white/8 bg-white/[0.03]">
                    <motion.div
                      className="absolute left-8 top-8 rounded-2xl border border-white/20 bg-white/[0.05] px-5 py-3 text-sm text-white"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                    >
                      Trigger
                    </motion.div>

                    <motion.div
                      className="absolute left-[42%] top-[38%] rounded-2xl border border-violet-300/30 bg-violet-400/18 px-5 py-4 text-center text-sm font-medium text-white shadow-[0_0_40px_rgba(168,85,247,0.25)]"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    >
                      AI Agent
                    </motion.div>

                    <motion.div
                      className="absolute right-8 bottom-8 rounded-2xl border border-white/20 bg-white/[0.05] px-5 py-3 text-sm text-white"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      Output
                    </motion.div>

                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 280" fill="none">
                      <motion.path
                        d="M100 58 C 170 58, 180 98, 245 132"
                        stroke="url(#surfaceGradientA)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4 }}
                      />
                      <motion.path
                        d="M275 145 C 340 145, 360 200, 410 226"
                        stroke="url(#surfaceGradientB)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6, delay: 0.3 }}
                      />

                      <defs>
                        <linearGradient id="surfaceGradientA" x1="0" y1="0" x2="500" y2="0">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="surfaceGradientB" x1="0" y1="0" x2="500" y2="0">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      "Calendar booked",
                      "Email sent",
                      "CRM updated",
                      "Audit log written",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200"
                      >
                        ✓ {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <GlassCard
              tag="AgentOps"
              title="Multi-agent execution with memory + recovery"
              lines={[
                "Planner → Executor → Repair loop",
                "Approvals and safe human handoff",
                "Context memory across runs and tools",
              ]}
            />
            <GlassCard
              tag="WorkflowOps"
              title="Ship safely with staging, rollback, and observability"
              lines={[
                "Versioned workflows and release safety",
                "Rate limits, retries, and queue-backed actions",
                "Environment controls for test → prod",
              ]}
            />
            <GlassCard
              tag="Enterprise"
              title="Trust layer for serious buyers and larger teams"
              lines={[
                "RBAC, SSO, SCIM, and policy control",
                "Auditability and evidence-ready logs",
                "Security posture and data control patterns",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
