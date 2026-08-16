"use client";

import { motion } from "framer-motion";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";

const pillars = [
  {
    title: "Governance fabric",
    desc: "Run AI workflows and agents with approvals, permissions, auditability, and operational guardrails.",
  },
  {
    title: "Operational visibility",
    desc: "Observe run health, retries, latency, outputs, recoveries, and delivery status across every workflow surface.",
  },
  {
    title: "Deployment control",
    desc: "Move from test to production with versioning, staged rollout, rollback, and safer workflow release practices.",
  },
  {
    title: "Enterprise integration",
    desc: "Connect internal systems, public SaaS tools, custom APIs, and data services behind one orchestration layer.",
  },
];

const controls = [
  "Org-ready permissions",
  "Approvals and escalation paths",
  "Run-level logs and evidence",
  "Policy-aware execution flows",
  "Connector isolation patterns",
  "Secrets separation",
  "Workflow version history",
  "Retry and rollback support",
  "Enterprise onboarding patterns",
  "Support for large-scale team operations",
];

const useCases = [
  {
    title: "Revenue operations",
    text: "Qualify leads, route ownership, notify reps, update CRM, and schedule next actions with AI-guided workflow logic.",
  },
  {
    title: "Support operations",
    text: "Classify tickets, summarize context, enrich accounts, escalate urgent cases, and keep evidence attached to actions.",
  },
  {
    title: "Internal operations",
    text: "Coordinate reminders, approvals, onboarding, finance follow-up, and multi-step internal processes across teams.",
  },
  {
    title: "Enterprise service orchestration",
    text: "Broker actions across APIs, internal systems, tools, and human approvals without losing visibility or control.",
  },
];

export default function EnterprisePageClient() {
  return (
    <main className="bg-[#f6f1ee] text-zinc-950">
      <section className="relative overflow-hidden bg-[#070710] py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.26),transparent_22%),radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.18),transparent_20%),radial-gradient(circle_at_50%_65%,rgba(236,72,153,0.12),transparent_24%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-300">
                Enterprise • zyncoai control layer
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
                Govern AI-native automation like enterprise infrastructure.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                ZyncoAI combines agents, workflows, connectors, runtime controls,
                visibility, approvals, auditability, and deployment structure into
                one operational platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/app"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-8 text-sm font-semibold text-white shadow-[0_0_50px_rgba(139,92,246,0.34)]"
                >
                  Start free
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-8 text-sm font-semibold text-white"
                >
                  View pricing
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Operational guardrails built in",
                  "Versioned deployment structure",
                  "Workflow + AgentOps + WorkflowOps",
                  "Approvals and audit trails by default",
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

            <motion.div
              className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0a0a12] p-6 shadow-[0_40px_140px_rgba(76,29,149,0.30)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(124,58,237,0.22),transparent_24%),radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.10),transparent_28%)]" />
              <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#0f0f18,#090910)] p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Enterprise control plane
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    active
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.56fr_0.44fr]">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Runtime map
                    </div>

                    <div className="relative mt-4 h-[360px] rounded-[22px] border border-white/8 bg-[#0b0b14]">
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 360" fill="none">
                        <path d="M86 92 C 162 92, 180 128, 250 156" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                        <path d="M286 156 C 360 156, 380 108, 458 86" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                        <path d="M286 166 C 360 166, 382 220, 454 250" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                        <path d="M452 252 C 484 252, 500 274, 516 298" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

                        <motion.path
                          d="M86 92 C 162 92, 180 128, 250 156"
                          stroke="url(#entA)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.2 }}
                        />
                        <motion.path
                          d="M286 156 C 360 156, 380 108, 458 86"
                          stroke="url(#entB)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.3, delay: 0.2 }}
                        />
                        <motion.path
                          d="M286 166 C 360 166, 382 220, 454 250"
                          stroke="url(#entC)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.35, delay: 0.45 }}
                        />
                        <motion.path
                          d="M452 252 C 484 252, 500 274, 516 298"
                          stroke="url(#entD)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.4, delay: 0.7 }}
                        />

                        <defs>
                          <linearGradient id="entA" x1="0" y1="0" x2="560" y2="0">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <linearGradient id="entB" x1="0" y1="0" x2="560" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <linearGradient id="entC" x1="0" y1="0" x2="560" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                          <linearGradient id="entD" x1="0" y1="0" x2="560" y2="0">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute left-6 top-16 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white">
                        Request intake
                      </div>
                      <motion.div
                        className="absolute left-[40%] top-[38%] rounded-2xl border border-violet-300/20 bg-violet-500/15 px-5 py-4 text-sm text-white"
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        ZyncoAI Policy + Planner
                      </motion.div>
                      <div className="absolute right-8 top-12 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white">
                        Approval path
                      </div>
                      <div className="absolute right-10 top-[60%] rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white">
                        Connector action
                      </div>
                      <div className="absolute bottom-6 right-5 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white">
                        Audit evidence
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        Controls
                      </div>
                      <div className="mt-4 grid gap-2">
                        {[
                          "Approvals",
                          "Policy checks",
                          "Evidence log",
                          "Connector limits",
                          "Recovery",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
                          >
                            ✓ {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        Enterprise outcomes
                      </div>
                      <div className="mt-4 grid gap-3">
                        {[
                          "Safer deployment structure",
                          "Cross-system orchestration",
                          "Better visibility for operators",
                          "Clear ownership at every step",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-violet-400/20 bg-violet-500/10 p-4">
                      <div className="text-sm font-medium text-white">
                        One control layer across every workflow.
                      </div>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        Approvals, policy checks, and audit evidence apply the same way
                        whether a step ran automatically or an agent decided it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Enterprise pillars
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              What enterprise governance means on ZyncoAI.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-[32px] border border-zinc-200 bg-[#fbfbfd] p-7 shadow-[0_16px_60px_rgba(15,23,42,0.04)]"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-zinc-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3f1] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                Control checklist
              </div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
                Buyer trust comes from visible control.
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Enterprise buyers do not only care about automation speed. They care about
                runtime discipline, safer execution, predictable deployment, and clearer ownership.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {controls.map((item, i) => (
                <motion.div
                  key={item}
                  className="rounded-[24px] border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-700 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  ✓ {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Enterprise use cases
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              Real operational surfaces, not abstract AI claims.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {useCases.map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-[30px] border border-zinc-200 bg-[#fbfbfd] p-7"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-zinc-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070710] py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[40px] border border-white/10 bg-white/[0.04] px-8 py-14 shadow-[0_40px_140px_rgba(76,29,149,0.24)] md:px-12">
            <div className="max-w-4xl">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Final enterprise CTA
              </div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Turn AI workflows into a governed operating system.
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-300">
                Intelligent automation that stays fast, visible, controlled, and
                production-ready at the same time.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/app"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-8 text-sm font-semibold text-white"
                >
                  Start free
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/5 px-8 text-sm font-semibold text-white"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
