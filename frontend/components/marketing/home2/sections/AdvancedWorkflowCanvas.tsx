"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "trigger", label: "User submits request", x: 10, y: 34, type: "light" },
  { id: "planner", label: "AI Planner", x: 33, y: 24, type: "primary" },
  { id: "tool1", label: "Slack", x: 36, y: 53, type: "tool" },
  { id: "tool2", label: "CRM", x: 48, y: 53, type: "tool" },
  { id: "memory", label: "Memory", x: 48, y: 75, type: "tool" },
  { id: "decision", label: "Is manager?", x: 63, y: 36, type: "decision" },
  { id: "approve", label: "Approval", x: 81, y: 20, type: "success" },
  { id: "notify", label: "Update channel", x: 84, y: 46, type: "success" },
  { id: "output", label: "Task completed", x: 79, y: 73, type: "primary" },
];

function nodeClass(type: string) {
  if (type === "primary") {
    return "border-violet-300/25 bg-violet-500/15 text-white";
  }
  if (type === "tool") {
    return "border-sky-300/25 bg-sky-500/10 text-white";
  }
  if (type === "decision") {
    return "border-emerald-300/25 bg-emerald-500/10 text-white";
  }
  if (type === "success") {
    return "border-white/12 bg-white/[0.05] text-white";
  }
  return "border-white/12 bg-white/[0.05] text-white";
}

export default function AdvancedWorkflowCanvas() {
  return (
    <section className="relative overflow-hidden bg-[#070710] py-24 text-white">
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_20%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.84fr_1.16fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Advanced workflow canvas
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Dark Flowise / n8n style node map with real orchestration feeling.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              This section is for people who buy with their eyes first. It should instantly say:
              ZyncoAI can coordinate requests, planning, tools, memory, branching, approvals,
              and outcomes in one serious execution surface.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Shows real workflow logic structure",
                "Looks closer to premium node-canvas tools",
                "Better for technical buyers and investors",
                "Supports the story that ZyncoAI is a serious platform",
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
            className="overflow-hidden rounded-[38px] border border-white/10 bg-[#0a0a12] p-6 shadow-[0_40px_140px_rgba(76,29,149,0.28)]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative h-[620px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#101019,#0a0a12)]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" fill="none">
                <path d="M144 210 C 220 210, 228 160, 296 150" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M344 166 C 356 166, 370 256, 362 306" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M350 166 C 416 166, 436 276, 434 306" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M344 176 C 420 176, 445 380, 430 442" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M504 220 C 560 220, 578 220, 624 220" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M690 202 C 748 202, 760 150, 786 122" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M690 226 C 758 226, 768 274, 795 282" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                <path d="M690 248 C 760 248, 766 388, 758 448" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />

                {[
                  "M144 210 C 220 210, 228 160, 296 150",
                  "M344 166 C 356 166, 370 256, 362 306",
                  "M350 166 C 416 166, 436 276, 434 306",
                  "M344 176 C 420 176, 445 380, 430 442",
                  "M504 220 C 560 220, 578 220, 624 220",
                  "M690 202 C 748 202, 760 150, 786 122",
                  "M690 226 C 758 226, 768 274, 795 282",
                  "M690 248 C 760 248, 766 388, 758 448",
                ].map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    stroke="url(#wfFlow)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 0.35,
                      delay: i * 0.14,
                    }}
                  />
                ))}

                <defs>
                  <linearGradient id="wfFlow" x1="0" y1="0" x2="900" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.88, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl",
                      nodeClass(node.type),
                    ].join(" ")}
                  >
                    {node.label}
                  </div>
                </motion.div>
              ))}

              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
                Workflow runtime canvas
              </div>

              <div className="absolute right-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-emerald-300">
                live sequence
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-4">
                {[
                  "Trigger",
                  "Planning",
                  "Branching",
                  "Outcome log",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
