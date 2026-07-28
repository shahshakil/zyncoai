"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const metrics = [
  { label: "Runs today", value: "1,542" },
  { label: "Time saved / week", value: "17h" },
  { label: "Success rate", value: "99.9%" },
  { label: "Active workflows", value: "685" },
];

const tools = [
  { name: "Slack", x: "10%", y: "58%" },
  { name: "Gmail", x: "28%", y: "24%" },
  { name: "Calendar", x: "22%", y: "78%" },
  { name: "HubSpot", x: "74%", y: "22%" },
  { name: "Notion", x: "86%", y: "58%" },
  { name: "Stripe", x: "74%", y: "82%" },
];

const outputs = [
  "✓ Calendar booked",
  "✓ Email sent",
  "✓ CRM updated",
  "✓ Audit log written",
];

export default function HeroNeo() {
  return (
    <section className="relative overflow-hidden bg-[#f7f4ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,70,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(80,120,255,0.08),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-600 shadow-sm"
            >
              ZyncoAI · AI-native automation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-950 md:text-7xl"
            >
              Build once.
              <br />
              <span className="bg-[linear-gradient(135deg,#6d28d9_0%,#8b5cf6_45%,#4338ca_100%)] bg-clip-text text-transparent">
                Run like an enterprise.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl"
            >
              ZyncoAI turns intent into execution across workflows, agents,
              reminders, integrations, and enterprise operations — with
              observability, rollback, and production-grade reliability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-2xl bg-[#f25a29] px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(242,90,41,0.28)] transition hover:-translate-y-0.5 hover:bg-[#de4f21]"
              >
                Start free
              </Link>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-7 py-3.5 text-base font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50"
              >
                Watch it work
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-8 space-y-3 text-sm text-zinc-700 md:text-[15px]"
            >
              <li>• Describe → Deploy: turn business intent into tested execution logic</li>
              <li>• AgentOps: planner, memory, repair, approvals, and optimization loops</li>
              <li>• WorkflowOps: staging, rollback, monitoring, retry control, and release safety</li>
              <li>• Enterprise: auditability, permissions, policy control, and secure orchestration</li>
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {["Built for teams", "Designed for reliability", "Security-first"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="relative"
          >
            <div className="relative rounded-[34px] border border-[#e8def9] bg-[linear-gradient(180deg,rgba(252,249,255,0.98)_0%,rgba(245,237,255,0.94)_100%)] p-5 shadow-[0_30px_80px_rgba(95,63,177,0.12)]">
              <div className="grid gap-4 md:grid-cols-[0.34fr_0.66fr]">
                <div className="rounded-[28px] border border-[#e6dff6] bg-white/55 p-5 backdrop-blur">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Intent
                  </div>
                  <div className="mt-4 text-[15px] font-semibold leading-9 text-zinc-900 md:text-[18px]">
                    “When a new lead arrives, qualify, route, and notify the team.”
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Describe → Deploy", "Guardrails", "Audit"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#e6dff6] bg-white/55 p-4 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                      Execution
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                      ZyncoAI orchestration
                    </span>
                  </div>

                  <div className="relative h-[330px] overflow-hidden rounded-[28px] border border-[rgba(180,152,255,0.25)] bg-[radial-gradient(circle_at_50%_45%,rgba(157,110,255,0.55),rgba(44,21,86,0.96)_42%,#09090f_74%)] shadow-[inset_0_0_80px_rgba(197,165,255,0.18)]">
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.45, 0.72, 0.45],
                      }}
                      transition={{
                        duration: 4.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(173,130,255,0.95)_0%,rgba(141,93,255,0.42)_45%,transparent_72%)] blur-md"
                    />

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute left-[16%] top-[16%] h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.95)]" />
                      <div className="absolute right-[18%] top-[24%] h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_18px_rgba(244,114,182,0.95)]" />
                      <div className="absolute bottom-[22%] left-[22%] h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(147,197,253,0.95)]" />
                      <div className="absolute bottom-[18%] right-[18%] h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.95)]" />
                    </motion.div>

                    {tools.map((tool, index) => (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0.75 }}
                        animate={{
                          y: [0, index % 2 === 0 ? -7 : 7, 0],
                          x: [0, index % 2 === 0 ? 5 : -5, 0],
                        }}
                        transition={{
                          duration: 4 + index * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute"
                        style={{ left: tool.x, top: tool.y }}
                      >
                        <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                          {tool.name}
                        </div>
                      </motion.div>
                    ))}

                    <svg className="pointer-events-none absolute inset-0 h-full w-full">
                      <motion.line
                        x1="26%"
                        y1="28%"
                        x2="50%"
                        y2="50%"
                        stroke="rgba(211,190,255,0.85)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <motion.line
                        x1="18%"
                        y1="60%"
                        x2="50%"
                        y2="50%"
                        stroke="rgba(211,190,255,0.85)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.8, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="80%"
                        y2="26%"
                        stroke="rgba(211,190,255,0.85)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.7, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="82%"
                        y2="60%"
                        stroke="rgba(211,190,255,0.85)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.9, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
                      />
                    </svg>

                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1/2 top-1/2 w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-white/20 bg-white/12 px-4 py-5 text-center text-white shadow-[0_20px_50px_rgba(50,16,91,0.45)] backdrop-blur-xl"
                    >
                      <div className="text-lg font-black tracking-tight">AI Planner</div>
                      <div className="mt-2 text-xs leading-5 text-white/80">
                        Decides tools + action order
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute right-[8%] top-[33%] rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                    >
                      Record updated
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.1, repeat: Infinity, delay: 0.6 }}
                      className="absolute right-[12%] top-[53%] rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                    >
                      Email follow-up sent
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.3, repeat: Infinity, delay: 1 }}
                      className="absolute right-[20%] bottom-[18%] rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                    >
                      Output complete
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {outputs.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0.6, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25 + index * 0.12,
                    }}
                    className="rounded-2xl border border-[#ded7ef] bg-white/85 px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="rounded-[28px] border border-zinc-200 bg-white/90 p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-zinc-500">{metric.label}</div>
              <div className="mt-3 text-4xl font-black tracking-tight text-zinc-950">
                {metric.value}
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1, delay: 0.75 + index * 0.12 }}
                className="mt-5 h-1.5 rounded-full bg-[linear-gradient(90deg,#7c3aed,#8b5cf6,#6366f1)]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
