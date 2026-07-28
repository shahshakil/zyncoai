"use client";

import { useMarketingHome } from "@/components/marketing/home3/lib/useMarketingHome";

function difficultyTone(difficulty?: string) {
  if (difficulty === "advanced") return "bg-rose-100 text-rose-700";
  if (difficulty === "medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function TemplatesGallerySection() {
  const { data, loading } = useMarketingHome();
  const templates = data?.templates ?? [];

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            TEMPLATES GALLERY
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Start from real operational patterns.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Templates make the platform feel useful on day one, especially when they match real workflows.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse rounded-[28px] border border-zinc-200 bg-white"
                />
              ))
            : templates.map((template) => (
                <a
                  key={template.id}
                  href={template.href ?? "/templates"}
                  className="group rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(108,71,255,0.12)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-full border border-violet-200 bg-[#faf6ff] px-3 py-1 text-xs font-semibold text-violet-700">
                      {template.category}
                    </div>
                    <div
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${difficultyTone(
                        template.difficulty
                      )}`}
                    >
                      {template.difficulty ?? "medium"}
                    </div>
                  </div>

                  <div className="mt-5 rounded-[22px] border border-zinc-200 bg-[linear-gradient(135deg,#ffffff,#faf6ff)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-950" />
                      <div className="h-10 flex-1 rounded-xl bg-white shadow-sm" />
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-violet-200" />
                    <div className="mt-3 h-3 w-4/5 rounded-full bg-zinc-200" />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="h-12 rounded-2xl bg-white shadow-sm transition group-hover:scale-[1.03]" />
                      <div className="h-12 rounded-2xl bg-white shadow-sm transition group-hover:scale-[1.03]" />
                      <div className="h-12 rounded-2xl bg-white shadow-sm transition group-hover:scale-[1.03]" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-zinc-950">{template.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{template.description}</p>

                  <div className="mt-5 text-sm font-semibold text-violet-700">
                    Open template →
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
