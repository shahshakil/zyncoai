"use client";

import { useEffect, useState } from "react";
import { useMarketingHome } from "@/components/marketing/home3/lib/useMarketingHome";

export default function StoryboardShowcase() {
  const { data, loading } = useMarketingHome();
  const frames = data?.storyboard ?? [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!frames.length) return;
    const timer = setInterval(() => {
      setActive((v) => (v + 1) % frames.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [frames]);

  return (
    <section className="py-20 md:py-24" id="workflow-showcase">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            REAL WORKFLOW STORYBOARD
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Bigger motion. Clearer product story.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            This section uses structured run frames so the workflow motion feels like a real product sequence.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-[30px] border border-zinc-200 bg-white"
                />
              ))
            : frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`rounded-[30px] border p-5 transition-all duration-500 ${
                    active === index
                      ? "border-violet-200 bg-white shadow-[0_25px_70px_rgba(108,71,255,0.14)]"
                      : "border-zinc-200 bg-[#fbfaf8]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Frame {index + 1}
                    </div>
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        active === index ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                    />
                  </div>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
                    {frame.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">
                    {frame.subtitle ?? "Workflow frame"}
                  </p>

                  <div className="mt-5 space-y-3">
                    {frame.nodes.map((node, i) => (
                      <div
                        key={node}
                        className={`rounded-[18px] border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition-all duration-500 ${
                          active === index ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"
                        }`}
                        style={{ transitionDelay: `${i * 70}ms` }}
                      >
                        {node}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {frame.outcomes.map((outcome) => (
                      <div
                        key={outcome}
                        className="rounded-full border border-zinc-200 bg-[#faf6ff] px-3 py-1.5 text-xs font-semibold text-violet-700"
                      >
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
