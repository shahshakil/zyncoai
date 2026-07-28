"use client";

import { motion } from "framer-motion";

const cards = [
  {
    id: "start",
    label: "Start",
    sub: "request comes in",
    x: 6,
    y: 48,
    style: "from-emerald-500/25 to-lime-400/10 border-emerald-300/20",
  },
  {
    id: "intent",
    label: "Detect user intention",
    sub: "route the request",
    x: 26,
    y: 48,
    style: "from-pink-500/25 to-rose-400/10 border-pink-300/20",
  },
  {
    id: "planner",
    label: "AI Planner",
    sub: "decides tools + steps",
    x: 48,
    y: 28,
    style: "from-violet-500/25 to-fuchsia-400/10 border-violet-300/20",
  },
  {
    id: "sales",
    label: "Sales Agent",
    sub: "follow-up flow",
    x: 64,
    y: 20,
    style: "from-cyan-500/20 to-sky-400/10 border-cyan-300/20",
  },
  {
    id: "ops",
    label: "Ops Agent",
    sub: "execution flow",
    x: 64,
    y: 46,
    style: "from-cyan-500/20 to-sky-400/10 border-cyan-300/20",
  },
  {
    id: "support",
    label: "Support Agent",
    sub: "case orchestration",
    x: 64,
    y: 72,
    style: "from-cyan-500/20 to-sky-400/10 border-cyan-300/20",
  },
  {
    id: "console",
    label: "Execution log",
    sub: "runtime reasoning",
    x: 88,
    y: 40,
    style: "from-white/10 to-white/5 border-white/12",
  },
];

export default function HeroFlowCanvas() {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0a0a12] p-5 shadow-[0_40px_140px_rgba(76,29,149,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.20),transparent_18%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.12),transparent_16%)]" />
      <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#101018,#090910)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
            Agentic workflow
          </div>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="h-3 w-3 rounded-full bg-orange-400" />
            <div className="h-3 w-3 rounded-full bg-violet-400" />
          </div>
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-[26px] border border-white/10 bg-[#0b0b13]">
          <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1100 520" fill="none">
            {[
              "M140 260 C 210 260, 220 260, 292 260",
              "M408 260 C 480 260, 486 170, 526 150",
              "M408 260 C 486 260, 486 260, 536 250",
              "M408 260 C 490 260, 486 360, 538 370",
              "M680 150 C 768 150, 792 160, 910 210",
              "M678 252 C 774 252, 796 240, 910 228",
              "M700 370 C 790 370, 814 310, 914 246",
            ].map((d, i) => (
              <g key={d}>
                <path d={d} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                <motion.path
                  d={d}
                  stroke="url(#heroFlow)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    delay: i * 0.18,
                  }}
                />
              </g>
            ))}
            <defs>
              <linearGradient id="heroFlow" x1="0" y1="0" x2="1100" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="45%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className="absolute"
              style={{
                left: `${card.x}%`,
                top: `${card.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                className={`min-w-[140px] rounded-[22px] border bg-gradient-to-br ${card.style} px-4 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl`}
              >
                <div className="text-sm font-semibold">{card.label}</div>
                <div className="mt-1 text-xs text-zinc-300">{card.sub}</div>
              </motion.div>
            </motion.div>
          ))}

          <div className="absolute right-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-emerald-300">
            live flow
          </div>
        </div>
      </div>
    </div>
  );
}
