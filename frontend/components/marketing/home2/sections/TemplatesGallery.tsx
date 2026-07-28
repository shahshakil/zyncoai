"use client";

import { motion } from "framer-motion";

const templates = [
  {
    title: "Lead routing with AI qualification",
    desc: "Detect lead quality, enrich CRM, route owner, notify Slack, hold calendar.",
    tags: ["Sales", "Agent", "Calendar"],
  },
  {
    title: "Appointment reminder engine",
    desc: "Send reminder sequences by email, app, or channel before appointments.",
    tags: ["Reminder", "Notify", "Ops"],
  },
  {
    title: "Support triage and escalation",
    desc: "Classify incoming support, summarize issue, assign queue, log audit trail.",
    tags: ["Support", "Triage", "Audit"],
  },
  {
    title: "Finance follow-up automation",
    desc: "Detect due records, compose outreach, escalate based on payment state.",
    tags: ["Finance", "Workflow", "Queue"],
  },
  {
    title: "Recruitment interview scheduling",
    desc: "Collect applicant signals, score fit, coordinate interview holds, notify team.",
    tags: ["HR", "Scheduling", "AI"],
  },
  {
    title: "Enterprise onboarding orchestration",
    desc: "Provision records, route approvals, create docs, and update internal systems.",
    tags: ["Enterprise", "Provisioning", "Ops"],
  },
];

export default function TemplatesGallery() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Templates gallery
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              Start from powerful patterns, not blank screens.
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              ZyncoAI should help users imagine real business outcomes fast. Templates
              make the platform easier to buy, easier to trust, and easier to adopt.
            </p>
          </div>

          <a
            href="/app"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Explore builder
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((item, i) => (
            <motion.div
              key={item.title}
              className="group overflow-hidden rounded-[32px] border border-zinc-200 bg-[#fbfbfd] shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="relative h-[220px] overflow-hidden border-b border-zinc-200 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.18),transparent_26%),linear-gradient(180deg,#111118,#0a0a12)]">
                <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-zinc-300">
                  Template preview
                </div>

                <div className="absolute inset-x-5 bottom-5 top-14 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="relative h-full">
                    <motion.div
                      className="absolute left-0 top-7 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-2 text-xs text-white"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      Trigger
                    </motion.div>
                    <motion.div
                      className="absolute left-[36%] top-[28%] rounded-2xl border border-violet-300/25 bg-violet-400/15 px-4 py-3 text-xs text-white"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      Planner
                    </motion.div>
                    <motion.div
                      className="absolute right-0 top-7 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-2 text-xs text-white"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2.7, repeat: Infinity }}
                    >
                      Tools
                    </motion.div>
                    <motion.div
                      className="absolute bottom-2 right-4 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-2 text-xs text-white"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.9, repeat: Infinity }}
                    >
                      Output
                    </motion.div>

                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 140" fill="none">
                      <motion.path
                        d="M58 40 C 105 40, 118 56, 150 66"
                        stroke="url(#tmplA)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.2 }}
                      />
                      <motion.path
                        d="M186 68 C 220 68, 235 48, 263 40"
                        stroke="url(#tmplB)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.3, delay: 0.2 }}
                      />
                      <motion.path
                        d="M175 82 C 220 82, 246 100, 270 112"
                        stroke="url(#tmplC)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.35, delay: 0.45 }}
                      />
                      <defs>
                        <linearGradient id="tmplA" x1="0" y1="0" x2="320" y2="0">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="tmplB" x1="0" y1="0" x2="320" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <linearGradient id="tmplC" x1="0" y1="0" x2="320" y2="0">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{item.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
