"use client";
import { Sparkles } from "lucide-react";

// Ships EMPTY on purpose — ZyncoAI has no real customer case studies yet.
// This component exists so the layout/slot is ready, but it must never
// render invented names, businesses, quotes, or ROI percentages. Fill this
// the day a real partner gives real, attributable numbers — nothing before
// that. (Same standard as REAL_DIFFERENTIATORS in ./data, which replaced an
// earlier fabricated TESTIMONIALS array for the same reason.)
export function CaseStudiesSection({ industryName }: { industryName: string }) {
  return (
    <section id="case-studies" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff]">
          <Sparkles className="h-6 w-6 text-[#6366f1]" />
        </div>
        <h2 className="mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">First {industryName.toLowerCase()} partner story coming soon</h2>
        <p className="mt-3 text-[#475569]">
          We&apos;re not going to invent one. This slot fills the day a real {industryName.toLowerCase()} business gives us real numbers to share.
        </p>
      </div>
    </section>
  );
}
