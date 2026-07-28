"use client";

import VideoLoopCard from "./VideoLoopCard";

export default function PremiumVideoGrid() {
  return (
    <section className="bg-[#070710] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Motion surfaces
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Video / WebGL / motion-graph feeling across the homepage.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-300">
            These cards are ready for real WebM loops later. For now they provide the premium product
            surface and layout structure you asked for.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <VideoLoopCard
            title="Workflow runtime story"
            subtitle="Use this for a real n8n / Flowise-style moving workflow loop"
          />
          <VideoLoopCard
            title="Dashboard simulation"
            subtitle="Use this for metrics, execution states, and product walkthrough loops"
          />
          <VideoLoopCard
            title="Connectors cloud"
            subtitle="Use this for floating apps, routes, and orchestration pulses"
          />
          <VideoLoopCard
            title="Enterprise / security animation"
            subtitle="Use this for tenancy, compliance, access, and deployment topology"
          />
        </div>
      </div>
    </section>
  );
}
