import { Newspaper } from "lucide-react";

// One honest "nothing here yet" state, reused by every filtered view
// (category/tag/industry) that can legitimately have zero posts — never a
// fabricated placeholder article, never silently blank.
export function BlogEmptyState({ label }: { label: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-[#cbd5e1] bg-white/60 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff]">
        <Newspaper className="h-5 w-5 text-[#6366f1]" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#475569]">No articles about {label} yet — check back soon.</p>
    </div>
  );
}
