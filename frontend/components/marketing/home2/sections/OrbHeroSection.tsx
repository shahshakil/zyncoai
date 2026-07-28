"use client";

import OrbScene from "./OrbScene";

export default function OrbHeroSection() {
  return (
    <section id="ai-brain" className="relative overflow-hidden bg-[#070710] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.14),transparent_20%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.08),transparent_18%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.84fr_1.16fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            AI Brain
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            A real 3D orchestration center, not a fake static section.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            This visual exists to make ZyncoAI feel like a serious AI-native platform.
            Requests come in, the Brain chooses logic, routes execution, coordinates connectors,
            and delivers outcomes across your operating stack.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "3D animated visual surface",
              "Matches premium AI product art direction",
              "Makes buyers feel the product is bigger",
              "Supports investor-grade homepage storytelling",
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

        <OrbScene />
      </div>
    </section>
  );
}
