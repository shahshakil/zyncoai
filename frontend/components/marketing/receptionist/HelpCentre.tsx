"use client";
// 2026-08-17 — presentation-only rebuild of /resources/help. No answer text
// changed from the locked, fact-checked content in the server page — see
// app/(marketing)/resources/help/page.tsx's HELP_CATEGORIES for the source
// of truth. This file only adds search, an accordion, anchors, and real
// "was this helpful?" voting on top of it.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Mail } from "lucide-react";
import { HelpVote } from "./HelpVote";

export interface HelpItem {
  slug: string;
  question: string;
  answer: string;
}

export interface HelpCategory {
  slug: string;
  name: string;
  items: HelpItem[];
}

// The one answer with a real embedded link (Terms page) — content is
// locked, so this splits the exact original sentence around the literal
// substring "Terms page" to turn it into a real <Link>, rather than
// storing JSX in the data (which would need to live in a client file and
// couldn't be reused server-side for the no-JS/SEO-visible HTML).
function AnswerText({ slug, answer }: { slug: string; answer: string }) {
  if (slug === "cancellation-and-refund-policy") {
    const marker = "Terms page";
    const idx = answer.indexOf(marker);
    if (idx !== -1) {
      return (
        <>
          {answer.slice(0, idx)}
          <Link href="/terms#cancellation" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
            {marker}
          </Link>
          {answer.slice(idx + marker.length)}
        </>
      );
    }
  }
  return <>{answer}</>;
}

function CategorySection({
  category,
  isOpen,
  onToggle,
  highlightIds,
}: {
  category: HelpCategory;
  isOpen: boolean;
  onToggle: () => void;
  highlightIds: Set<string> | null;
}) {
  return (
    <div id={category.slug} className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[#0f172a]">{category.name}</span>
        <span className="flex items-center gap-2">
          <span className="text-xs font-normal text-[#94a3b8]">
            {category.items.length} question{category.items.length === 1 ? "" : "s"}
          </span>
          <ChevronDown className={`h-4 w-4 text-[#94a3b8] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {/* Content always stays in the DOM — never conditionally mounted — so
          every question/answer is present in the server-rendered HTML and
          crawlable/visible without JS, exactly like the page it replaces.
          Collapsing is purely a CSS visibility toggle, not an unmount. */}
      <div className={`space-y-5 border-t border-[#e2e8f0] px-5 py-5 ${isOpen ? "" : "hidden"}`}>
          {category.items.map((item) => (
            <div
              key={item.slug}
              id={item.slug}
              className={`scroll-mt-24 rounded-xl p-3 -m-3 ${highlightIds?.has(item.slug) ? "bg-[#eef2ff]" : ""}`}
            >
              <p className="font-medium text-[#0f172a]">{item.question}</p>
              <p className="mt-1 text-[#475569]">
                <AnswerText slug={item.slug} answer={item.answer} />
              </p>
              <HelpVote slug={item.slug} />
            </div>
          ))}

          <div className="border-t border-[#e2e8f0] pt-4 text-sm text-[#94a3b8]">
            Still stuck?{" "}
            <a href="mailto:support@zyncoai.com" className="inline-flex items-center gap-1 font-medium text-[#6366f1] hover:underline">
              <Mail className="h-3.5 w-3.5" /> Contact support@zyncoai.com
            </a>
          </div>
      </div>
    </div>
  );
}

export function HelpCentre({ categories }: { categories: HelpCategory[] }) {
  const [query, setQuery] = useState("");
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => new Set([categories[0]?.slug].filter(Boolean) as string[]));

  // Deep-link support: /resources/help#call-forwarding (a category) or
  // /resources/help#how-do-i-set-up-call-forwarding (a specific question)
  // both open the right category and scroll to the right spot.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const categoryMatch = categories.find((c) => c.slug === hash);
    if (categoryMatch) {
      setOpenSlugs((prev) => new Set(prev).add(categoryMatch.slug));
    } else {
      const owner = categories.find((c) => c.items.some((i) => i.slug === hash));
      if (owner) setOpenSlugs((prev) => new Set(prev).add(owner.slug));
    }
    const el = document.getElementById(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const query_ = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query_) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => i.question.toLowerCase().includes(query_) || i.answer.toLowerCase().includes(query_)),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, query_]);

  const matchIds = useMemo(() => {
    if (!query_) return null;
    return new Set(filtered.flatMap((c) => c.items.map((i) => i.slug)));
  }, [filtered, query_]);

  const searching = Boolean(query_);
  const visibleCategories = searching ? filtered : categories;
  const openSet = searching ? new Set(filtered.map((c) => c.slug)) : openSlugs;

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Help Centre…"
          className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-10 pr-4 text-sm text-[#0f172a] shadow-[0_1px_3px_rgba(0,0,0,0.08)] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
        />
      </div>

      {searching && (
        <p className="mt-2 text-xs text-[#94a3b8]">
          {filtered.reduce((n, c) => n + c.items.length, 0)} result{filtered.reduce((n, c) => n + c.items.length, 0) === 1 ? "" : "s"} for &quot;{query}&quot;
        </p>
      )}

      <div className="mt-4 space-y-3">
        {visibleCategories.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            isOpen={openSet.has(category.slug)}
            onToggle={() =>
              setOpenSlugs((prev) => {
                const next = new Set(prev);
                if (next.has(category.slug)) next.delete(category.slug);
                else next.add(category.slug);
                return next;
              })
            }
            highlightIds={searching ? matchIds : null}
          />
        ))}
        {searching && !visibleCategories.length && (
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center text-sm text-[#94a3b8]">
            No results for &quot;{query}&quot; — try a different search, or{" "}
            <a href="mailto:support@zyncoai.com" className="font-medium text-[#6366f1] hover:underline">
              email support
            </a>
            .
          </div>
        )}
      </div>
    </div>
  );
}
