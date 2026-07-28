"use client";

import { useEffect, useState } from "react";

function GlowOrb({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-60 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
    />
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function FlowNode({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur ${className}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-white/70">{subtitle}</div> : null}
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const steps = [
    "Lead arrives",
    "Planner selects tools",
    "Execution runs",
    "CRM updated",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 shadow-sm">
              ZyncoAI · AI-Native Automation
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 md:text-7xl">
              Build once.
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                Run like an enterprise.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              ZyncoAI turns intent into execution: agents plan, tools run, workflows self-heal,
              and outcomes are tracked across your stack.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/app"
                className="inline-flex items-center rounded-full bg-[#f46f33] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:bg-[#e65f25]"
              >
                Start free
              </a>
              <a
                href="#workflow"
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                Watch it work
              </a>
            </div>

            <ul className="mt-8 space-y-3 text-sm text-zinc-700">
              <li>• Describe → Deploy: turn a goal into a tested workflow</li>
              <li>• AgentOps: multi-agent governance + memory + optimization</li>
              <li>• WorkflowOps: versioning, staging, monitoring, rollback</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <MiniPill>Built for teams</MiniPill>
              <MiniPill>Designed for reliability</MiniPill>
              <MiniPill>Security-first</MiniPill>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[34px] border border-[#e8defd] bg-[linear-gradient(180deg,#fcf9ff_0%,#f5efff_100%)] p-4 shadow-[0_40px_120px_rgba(62,20,140,0.10)] md:p-5">
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[28px] border border-[#eadfff] bg-white/70 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                    Intent
                  </div>
                  <p className="mt-3 text-lg font-semibold leading-8 text-zinc-900">
                    “When a new lead arrives, qualify, route, and notify the team.”
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <MiniPill>Describe → Deploy</MiniPill>
                    <MiniPill>Guardrails</MiniPill>
                    <MiniPill>Audit</MiniPill>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#eadfff] bg-white/70 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                    <span>Execution</span>
                    <span>ZyncoAI orchestration</span>
                  </div>

                  <div className="relative h-[300px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_center,rgba(103,44,255,0.35),rgba(10,8,22,1)_65%)] p-4">
                    <GlowOrb className="left-[8%] top-[12%] h-20 w-20 bg-fuchsia-500/30" />
                    <GlowOrb className="right-[10%] top-[18%] h-16 w-16 bg-indigo-500/30" delay={1} />
                    <GlowOrb className="left-[32%] bottom-[18%] h-20 w-20 bg-violet-500/30" delay={2} />

                    <FlowNode title="Trigger" className="absolute left-[8%] top-[10%] w-[34%]" />
                    <FlowNode
                      title="AI Planner"
                      subtitle="Selects tools + sequence"
                      className="absolute right-[8%] top-[34%] w-[32%]"
                    />
                    <FlowNode
                      title="Output"
                      subtitle="Slack · CRM · Email"
                      className="absolute left-[43%] bottom-[12%] w-[28%]"
                    />

                    <svg className="absolute inset-0 h-full w-full">
                      <line
                        x1="110"
                        y1="60"
                        x2="260"
                        y2="125"
                        stroke={active >= 1 ? "#c084fc" : "#ffffff55"}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="280"
                        y1="160"
                        x2="220"
                        y2="225"
                        stroke={active >= 2 ? "#8b5cf6" : "#ffffff55"}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div
                      className="absolute h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_20px_rgba(232,121,249,1)] transition-all duration-700"
                      style={{
                        left:
                          active === 0 ? "24%" :
                          active === 1 ? "46%" :
                          active === 2 ? "60%" : "56%",
                        top:
                          active === 0 ? "18%" :
                          active === 1 ? "38%" :
                          active === 2 ? "58%" : "58%",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800">
                  ✓ Calendar booked
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800">
                  ✓ Email sent
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800">
                  ✓ CRM updated
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800">
                  ✓ Audit log written
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
