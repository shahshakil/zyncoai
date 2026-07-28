"use client";

import { useEffect, useState } from "react";

const AGENTS = [
  {
    name: "Planner Agent",
    role: "Turns goals into executable plans",
    bullets: [
      "Reads workflow intent",
      "Chooses tools and sequence",
      "Builds safe execution plan",
    ],
  },
  {
    name: "Executor Agent",
    role: "Runs tasks across real systems",
    bullets: [
      "Calls integrations and actions",
      "Handles retries and outputs",
      "Writes structured results",
    ],
  },
  {
    name: "Repair Agent",
    role: "Recovers failures before humans notice",
    bullets: [
      "Detects broken steps",
      "Re-routes or retries safely",
      "Escalates only when needed",
    ],
  },
  {
    name: "Optimization Agent",
    role: "Improves quality and throughput over time",
    bullets: [
      "Finds bottlenecks",
      "Suggests better paths",
      "Raises efficiency signals",
    ],
  },
];

export default function AgentOpsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((v) => (v + 1) % AGENTS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            AGENTOPS
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Multi-agent execution that feels operational, not experimental.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            ZyncoAI is stronger when it shows a real AgentOps story: planning,
            execution, repair, optimization, and auditability working together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-4">
            {AGENTS.map((agent, index) => (
              <div
                key={agent.name}
                className={`rounded-[28px] border p-6 transition-all duration-500 ${
                  active === index
                    ? "border-violet-200 bg-white shadow-[0_20px_60px_rgba(108,71,255,0.12)]"
                    : "border-zinc-200 bg-[#fbfaf8]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold text-zinc-950">{agent.name}</div>
                    <div className="mt-2 text-sm text-zinc-600">{agent.role}</div>
                  </div>
                  <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-500">
                    Agent {index + 1}
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-sm text-zinc-700">
                  {agent.bullets.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-[34px] border border-zinc-200 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
            <div className="rounded-[28px] bg-[#0b0b14] p-5">
              <div className="mb-4 text-sm font-semibold text-white/80">
                Agent orchestration board
              </div>

              <div className="relative h-[420px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_center,rgba(98,65,225,0.22),rgba(10,10,16,1)_74%)]">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-20" />

                <div className="absolute left-[8%] top-[42%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Trigger
                </div>
                <div className="absolute left-[31%] top-[18%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Planner
                </div>
                <div className="absolute left-[31%] top-[42%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Executor
                </div>
                <div className="absolute left-[31%] top-[66%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Repair
                </div>
                <div className="absolute right-[8%] top-[30%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Optimization
                </div>
                <div className="absolute right-[8%] top-[58%] rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">
                  Output + Audit
                </div>

                <svg className="absolute inset-0 h-full w-full">
                  <line x1="110" y1="205" x2="260" y2="110" stroke="#c084fc" strokeWidth="3" />
                  <line x1="110" y1="205" x2="260" y2="205" stroke="#a78bfa" strokeWidth="3" />
                  <line x1="110" y1="205" x2="260" y2="300" stroke="#db8cff" strokeWidth="3" />
                  <line x1="345" y1="110" x2="560" y2="150" stroke="#b794ff" strokeWidth="3" />
                  <line x1="345" y1="205" x2="560" y2="150" stroke="#b794ff" strokeWidth="3" />
                  <line x1="345" y1="300" x2="560" y2="270" stroke="#b794ff" strokeWidth="3" />
                  <line x1="560" y1="150" x2="560" y2="270" stroke="#ddd6fe" strokeWidth="3" />
                </svg>

                <div
                  className="absolute h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_18px_rgba(244,114,182,1)] transition-all duration-700"
                  style={{
                    left:
                      active === 0
                        ? "26%"
                        : active === 1
                        ? "26%"
                        : active === 2
                        ? "26%"
                        : "74%",
                    top:
                      active === 0
                        ? "26%"
                        : active === 1
                        ? "50%"
                        : active === 2
                        ? "73%"
                        : "38%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
