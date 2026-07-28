"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    title: "Trigger",
    desc: "Form submitted / webhook / schedule",
    badge: "Step 1",
  },
  {
    title: "AI Planner",
    desc: "Chooses tools + builds the run plan",
    badge: "Step 2",
  },
  {
    title: "Execution",
    desc: "Actions run with rate limits + isolation",
    badge: "Step 3",
  },
  {
    title: "Output",
    desc: "Slack, Email, CRM, Calendar — delivered",
    badge: "Step 4",
  },
];

export default function WorkflowAnimation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              WORKFLOW ANIMATION
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              See the engine work.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              Triggers fire, agents reason, tools execute, and outputs land where your team already works —
              with guardrails and observability.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, i) => {
                const on = i <= active;
                return (
                  <div
                    key={step.title}
                    className={`rounded-[24px] border p-5 transition-all duration-500 ${
                      on
                        ? "border-violet-200 bg-white shadow-[0_18px_50px_rgba(108,71,255,0.10)]"
                        : "border-zinc-200 bg-[#fbfaf8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-zinc-950">{step.title}</div>
                        <div className="mt-2 text-sm leading-6 text-zinc-600">{step.desc}</div>
                      </div>
                      <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-500">
                        {step.badge}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-zinc-700">
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-2">✓ Calendar booked</span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-2">✓ Slack message posted</span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-2">✓ CRM updated</span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-2">✓ Audit log written</span>
            </div>
          </div>

          <div className="rounded-[34px] border border-zinc-200 bg-[#fcfbff] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.06)] md:p-5">
            <div className="rounded-[28px] bg-[#0b0b14] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-white/80">
                <span>Run preview</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
                  Active
                </span>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(96,50,220,0.18),rgba(10,10,16,1)_75%)]">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-25" />

                <div className="absolute left-[10%] top-[18%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  Trigger
                </div>

                <div className="absolute left-[44%] top-[40%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  AI Agent
                </div>

                <div className="absolute left-[55%] top-[68%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  Output
                </div>

                <div className="absolute right-[8%] top-[16%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  Slack
                </div>

                <div className="absolute right-[8%] top-[42%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  CRM
                </div>

                <div className="absolute right-[8%] top-[68%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
                  Email
                </div>

                <svg className="absolute inset-0 h-full w-full">
                  <line x1="120" y1="85" x2="290" y2="170" stroke="#b37cff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="335" y1="185" x2="510" y2="110" stroke="#b37cff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="335" y1="185" x2="510" y2="205" stroke="#7c5cff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="335" y1="185" x2="510" y2="300" stroke="#db8cff" strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div
                  className="absolute h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(244,114,182,1)] transition-all duration-700"
                  style={{
                    left:
                      active === 0 ? "21%" :
                      active === 1 ? "43%" :
                      active === 2 ? "63%" : "80%",
                    top:
                      active === 0 ? "24%" :
                      active === 1 ? "46%" :
                      active === 2 ? "56%" : active === 3 ? "30%" : "30%",
                  }}
                />

                <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80">
                    Multi-agent routing
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80">
                    Guardrails + approvals
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80">
                    Retries + observability
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80">
                    Output delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
