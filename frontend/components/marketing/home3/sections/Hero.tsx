"use client";

import { useEffect, useMemo, useState } from "react";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function GlassNode({
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
      className={`rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.30)] backdrop-blur ${className}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-white/65">{subtitle}</div> : null}
    </div>
  );
}

export default function Hero() {
  const sequence = useMemo(
    () => [
      { x: "18%", y: "18%" },
      { x: "42%", y: "38%" },
      { x: "60%", y: "62%" },
      { x: "78%", y: "30%" },
      { x: "78%", y: "55%" },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((v) => (v + 1) % sequence.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [sequence.length]);

  return (
    <section className="relative overflow-hidden pb-14 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr]">
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
              ZyncoAI turns intent into execution across workflows, agents, reminders,
              orchestration, and enterprise operations — with guardrails, observability,
              and production-safe deployment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/app"
                className="inline-flex items-center rounded-full bg-[#f46f33] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:bg-[#e76025]"
              >
                Start free
              </a>

              <a
                href="#workflow-showcase"
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                Watch it work
              </a>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-zinc-700">
              <div>• Describe → Deploy: turn business intent into tested execution logic</div>
              <div>• AgentOps: planner, memory, repair, approvals, and optimization loops</div>
              <div>• WorkflowOps: staging, rollback, monitoring, retry control, and release safety</div>
              <div>• Enterprise: auditability, permissions, policy control, and secure orchestration</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Pill>Built for teams</Pill>
              <Pill>Security-first</Pill>
              <Pill>Operational by design</Pill>
              <Pill>Made for scale</Pill>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[34px] border border-[#eadfff] bg-[linear-gradient(180deg,#fcf9ff_0%,#f6f0ff_100%)] p-4 shadow-[0_40px_120px_rgba(62,20,140,0.12)] md:p-5">
              <div className="grid gap-4 md:grid-cols-[0.75fr_1.25fr]">
                <div className="rounded-[28px] border border-[#eadfff] bg-white/75 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Intent
                  </div>

                  <p className="mt-3 text-xl font-semibold leading-9 text-zinc-900">
                    “When a new lead arrives, qualify, route, and notify the team.”
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill>Describe → Deploy</Pill>
                    <Pill>Guardrails</Pill>
                    <Pill>Audit</Pill>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#eadfff] bg-white/75 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    <span>Execution</span>
                    <span>ZyncoAI orchestration</span>
                  </div>

                  <div className="relative h-[330px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_center,rgba(112,60,255,0.30),rgba(10,9,22,1)_68%)]">
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-20" />

                    <GlassNode title="Trigger" className="absolute left-[7%] top-[10%] w-[33%]" />
                    <GlassNode
                      title="AI Planner"
                      subtitle="Decides tools + action order"
                      className="absolute left-[40%] top-[34%] w-[30%]"
                    />
                    <GlassNode
                      title="CRM"
                      subtitle="Record updated"
                      className="absolute right-[6%] top-[22%] w-[23%]"
                    />
                    <GlassNode
                      title="Email"
                      subtitle="Follow-up sent"
                      className="absolute right-[6%] top-[48%] w-[23%]"
                    />
                    <GlassNode
                      title="Output"
                      subtitle="Complete"
                      className="absolute left-[50%] bottom-[10%] w-[26%]"
                    />

                    <svg className="absolute inset-0 h-full w-full">
                      <line x1="120" y1="60" x2="260" y2="142" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                      <line x1="330" y1="155" x2="510" y2="105" stroke="#b794ff" strokeWidth="3" strokeLinecap="round" />
                      <line x1="330" y1="165" x2="510" y2="185" stroke="#db8cff" strokeWidth="3" strokeLinecap="round" />
                      <line x1="330" y1="180" x2="390" y2="265" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
                    </svg>

                    <div
                      className="absolute h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_24px_rgba(244,114,182,1)] transition-all duration-700"
                      style={{
                        left: sequence[active].x,
                        top: sequence[active].y,
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
