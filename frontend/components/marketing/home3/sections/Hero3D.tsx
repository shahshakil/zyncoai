"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const floatingApps = [
  { name: "Slack", x: "8%", y: "18%" },
  { name: "HubSpot", x: "78%", y: "14%" },
  { name: "Email", x: "86%", y: "46%" },
  { name: "CRM", x: "72%", y: "76%" },
  { name: "Calendar", x: "14%", y: "78%" },
  { name: "Docs", x: "4%", y: "56%" },
];

const bullets = [
  "Describe → Deploy: turn business intent into tested execution logic",
  "AgentOps: planner, memory, repair, approvals, and optimization loops",
  "WorkflowOps: staging, rollback, monitoring, retry control, and release safety",
  "Enterprise: auditability, permissions, policy control, and secure orchestration",
];

export default function Hero3D() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-10 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute right-[8%] top-[18%] h-[22rem] w-[22rem] rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute left-[5%] top-[45%] h-[18rem] w-[18rem] rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-700 shadow-sm backdrop-blur"
          >
            ZyncoAI · AI-native automation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl"
          >
            Build once.
            <span className="block bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 bg-clip-text text-transparent">
              Run like an enterprise.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl"
          >
            ZyncoAI turns intent into execution across workflows, agents, reminders,
            orchestration, and enterprise operations — with guardrails, observability,
            and production-safe deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/app"
              className="inline-flex items-center rounded-2xl bg-[#ef5a29] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(239,90,41,0.22)] transition hover:-translate-y-0.5 hover:bg-[#db4f22]"
            >
              Start free
            </Link>

            <a
              href="#workflow"
              className="inline-flex items-center rounded-2xl border border-zinc-300 bg-white/85 px-6 py-3.5 text-sm font-bold text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Watch it work
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-10 space-y-3 text-sm text-zinc-700 md:text-base"
          >
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-violet-500" />
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {["Built for teams", "Designed for reliability", "Security-first"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="relative z-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-[#f4ebfb] p-5 shadow-[0_30px_100px_rgba(31,41,55,0.10)]">
            <div className="grid gap-4 md:grid-cols-[0.42fr_0.58fr]">
              <div className="rounded-[1.5rem] border border-violet-100 bg-white/55 p-6 backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  Intent
                </div>
                <div className="mt-5 text-[1.05rem] font-bold leading-10 text-zinc-900 md:text-[1.15rem]">
                  “When a new lead
                  <br />
                  arrives, qualify,
                  <br />
                  route, and notify
                  <br />
                  the team.”
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {["Describe → Deploy", "Guardrails", "Audit"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-violet-100 bg-white/55 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between px-2">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Execution
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    ZyncoAI orchestration
                  </div>
                </div>

                <div className="relative h-[18rem] overflow-hidden rounded-[1.4rem] bg-[#090510] shadow-inner">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/15"
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.35),transparent_28%),radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_48%)]" />

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(168,85,247,0.3)",
                        "0 0 36px rgba(168,85,247,0.55)",
                        "0 0 0px rgba(168,85,247,0.3)",
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2.8 }}
                    className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.7rem] border border-violet-300/25 bg-white/10 p-4 text-center text-sm font-extrabold text-white backdrop-blur-md"
                  >
                    AI
                    <br />
                    Planner
                    <div className="mt-2 text-[10px] font-medium leading-4 text-violet-100/80">
                      Decides
                      <br />
                      tools + action
                      <br />
                      order
                    </div>
                  </motion.div>

                  {floatingApps.map((app, i) => (
                    <motion.div
                      key={app.name}
                      animate={{
                        y: [0, -8, 0],
                        x: [0, i % 2 === 0 ? 4 : -4, 0],
                        opacity: [0.85, 1, 0.85],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.6 + i * 0.5,
                        ease: "easeInOut",
                      }}
                      className="absolute z-20"
                      style={{ left: app.x, top: app.y }}
                    >
                      <div className="rounded-[1.2rem] border border-white/15 bg-white/8 px-3 py-3 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                        {app.name}
                      </div>
                    </motion.div>
                  ))}

                  <svg className="absolute inset-0 h-full w-full">
                    <motion.path
                      d="M 95 50 C 180 100, 260 120, 330 110"
                      stroke="url(#grad1)"
                      strokeWidth="3"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.2, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 185 220 C 220 185, 290 165, 352 140"
                      stroke="url(#grad2)"
                      strokeWidth="3"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.2, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 2.9, ease: "easeInOut", delay: 0.2 }}
                    />
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#d8b4fe" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#f0abfc" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {[
                "✓ Calendar booked",
                "✓ Email sent",
                "✓ CRM updated",
                "✓ Audit log written",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
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
