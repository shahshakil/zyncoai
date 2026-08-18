"use client";
// Hero + instant answers for the /support hub. Retrieval-only, same as
// HelpWidget.tsx — this reuses that file's exact search index, quick-topic
// keys, and answer card (ALL_ENTRIES/search/QUICK_ANSWER_KEYS/AnswerCard,
// all exported from HelpWidget.tsx) instead of holding a second copy of the
// verified content or a second search implementation. There is no LLM call
// anywhere in this file.
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { search, findByQuestion, QUICK_ANSWER_KEYS, AnswerCard, type Entry } from "./HelpWidget";

const QUICK_TOPICS: { label: string; question: string }[] = [
  { label: "Pricing", question: QUICK_ANSWER_KEYS.pricing },
  { label: "How it works", question: QUICK_ANSWER_KEYS.howItWorks },
  { label: "Setup & call forwarding", question: QUICK_ANSWER_KEYS.setup },
];

export function SupportSearchHero() {
  const [query, setQuery] = useState("");
  const [activeAnswer, setActiveAnswer] = useState<Entry | null>(null);

  const results = useMemo(() => search(query), [query]);
  const searching = query.trim().length > 0;

  function openQuickAnswer(question: string) {
    const entry = findByQuestion(question);
    setActiveAnswer(entry || null);
  }

  function onQueryChange(v: string) {
    setQuery(v);
    setActiveAnswer(null);
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Hi — let&apos;s get you some help</h1>
        <p className="mt-3 text-lg text-[#475569]">Search our verified Help Centre and FAQ, or send us a message below.</p>
      </div>

      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for an answer…"
          className="w-full rounded-2xl border border-[#e2e8f0] bg-white py-4 pl-12 pr-4 text-sm text-[#0f172a] shadow-[0_4px_12px_rgba(0,0,0,0.08)] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
        />
      </div>

      <p className="mt-3 text-center text-xs font-medium text-[#94a3b8]">These answers are verified by us — not AI-generated.</p>

      {!searching && (
        <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2">
          {QUICK_TOPICS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => openQuickAnswer(t.question)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeAnswer?.question === t.question ? "border-[#6366f1] bg-[#eef2ff] text-[#4338ca]" : "border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto mt-5 max-w-xl space-y-3">
        {searching &&
          (results.length > 0 ? (
            results.map((entry) => <AnswerCard key={entry.slug} entry={entry} />)
          ) : (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 text-center">
              <p className="text-sm font-medium text-[#0f172a]">No verified answer for that yet.</p>
              <p className="mt-1 text-sm text-[#475569]">Send us a message below — a real person will reply by email.</p>
            </div>
          ))}
        {!searching && activeAnswer && <AnswerCard entry={activeAnswer} />}
      </div>
    </div>
  );
}
