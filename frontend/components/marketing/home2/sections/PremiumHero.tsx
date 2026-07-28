"use client";

import HeroInvestorCopy from "./HeroInvestorCopy";
import HeroFlowCanvas from "./HeroFlowCanvas";

export default function PremiumHero() {
  return (
    <section className="relative overflow-hidden bg-[#070710] pt-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(124,58,237,0.22),transparent_18%),radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.12),transparent_16%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.08),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-300">
              ZyncoAI • AI-native automation platform
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Build the intelligent operating layer for workflows, agents, and enterprise execution.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              ZyncoAI turns business intent into controlled execution across planners, workflows,
              connectors, memory, runtime logic, reminders, enterprise controls, and operational outcomes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/app"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 px-8 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(124,58,237,0.30)]"
              >
                Start free
              </a>
              <a
                href="#workflow-animation"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-8 text-sm font-semibold text-white"
              >
                Watch it work
              </a>
            </div>

            <HeroInvestorCopy />
          </div>

          <HeroFlowCanvas />
        </div>
      </div>
    </section>
  );
}
