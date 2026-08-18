"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircleQuestion, X, Search, ArrowRight, Mail, ChevronLeft } from "lucide-react";
import { HELP_CATEGORIES } from "@/lib/verifiedHelpContent";
import { FAQS } from "@/components/seo/FaqJsonLd";
import { ContactForm } from "./ContactForm";

// Retrieval-only help widget — zero generative AI. Every answer shown here
// is the VERBATIM text of an existing, already-published FAQ or Help
// Centre entry (both imported directly, never re-typed — see
// lib/verifiedHelpContent.ts's own comment on why that file exists). This
// widget only ever selects and displays one of those fixed strings, or
// falls through to the honest "I don't have that answer" state. There is
// no LLM call anywhere in this file.
type Entry = { question: string; answer: string; href: string; linkLabel: string };

const HELP_ENTRIES: Entry[] = HELP_CATEGORIES.flatMap((c) =>
  c.items.map((i) => ({ question: i.question, answer: i.answer, href: `/resources/help#${i.slug}`, linkLabel: "Read in the Help Centre" }))
);
const FAQ_ENTRIES: Entry[] = FAQS.map((f) => ({ question: f.question, answer: f.answer, href: "/faq", linkLabel: "Read in the FAQ" }));
const ALL_ENTRIES: Entry[] = [...HELP_ENTRIES, ...FAQ_ENTRIES];

const QUICK_ANSWER_KEYS = {
  pricing: "How much does it cost?",
  howItWorks: "What is ZyncoAI?",
  setup: "How do I set up call forwarding?",
} as const;

function findByQuestion(question: string): Entry | undefined {
  return ALL_ENTRIES.find((e) => e.question === question);
}

function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_ENTRIES.filter((e) => e.question.toLowerCase().includes(q) || e.answer.toLowerCase().includes(q)).slice(0, 6);
}

type View = "quick" | "answer" | "results" | "contact";

function AnswerCard({ entry }: { entry: Entry }) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <p className="text-sm font-semibold text-[#0f172a]">{entry.question}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{entry.answer}</p>
      <Link href={entry.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#6366f1] hover:text-[#4f46e5]">
        {entry.linkLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("quick");
  const [query, setQuery] = useState("");
  const [activeAnswer, setActiveAnswer] = useState<Entry | null>(null);

  const results = useMemo(() => search(query), [query]);

  function reset() {
    setView("quick");
    setQuery("");
    setActiveAnswer(null);
  }

  function openQuickAnswer(question: string) {
    const entry = findByQuestion(question);
    if (!entry) return;
    setActiveAnswer(entry);
    setView("answer");
  }

  function onQueryChange(v: string) {
    setQuery(v);
    setView(v.trim() ? "results" : "quick");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between gap-2 bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-3.5">
            <div className="flex items-center gap-2 text-white">
              {view !== "quick" && (
                <button type="button" onClick={reset} aria-label="Back" className="rounded-lg p-1 hover:bg-white/15">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <div>
                <p className="text-sm font-bold leading-none">ZyncoAI Help</p>
                <p className="mt-1 text-[11px] leading-none text-white/80">A help widget — searches our real Help Centre &amp; FAQ</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close help" className="rounded-lg p-1 text-white hover:bg-white/15">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[26rem] overflow-y-auto p-4">
            {view !== "contact" && (
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Search for an answer…"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                />
              </div>
            )}

            {view === "quick" && (
              <div className="space-y-1.5">
                <button type="button" onClick={() => openQuickAnswer(QUICK_ANSWER_KEYS.pricing)} className="block w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-left text-sm font-medium text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
                  Pricing
                </button>
                <button type="button" onClick={() => openQuickAnswer(QUICK_ANSWER_KEYS.howItWorks)} className="block w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-left text-sm font-medium text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
                  How it works
                </button>
                <button type="button" onClick={() => openQuickAnswer(QUICK_ANSWER_KEYS.setup)} className="block w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-left text-sm font-medium text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
                  Setup &amp; call forwarding
                </button>
                <Link href="/demo" className="block w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-left text-sm font-medium text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
                  Try the demo
                </Link>
                <button type="button" onClick={() => setView("contact")} className="block w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-left text-sm font-medium text-[#0f172a] hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
                  Contact us
                </button>
              </div>
            )}

            {view === "answer" && activeAnswer && <AnswerCard entry={activeAnswer} />}

            {view === "results" && (
              <div className="space-y-2">
                {results.length > 0 ? (
                  results.map((entry) => <AnswerCard key={entry.question} entry={entry} />)
                ) : (
                  <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    <p className="text-sm font-medium text-[#0f172a]">I don&apos;t have that answer.</p>
                    <p className="mt-1 text-sm text-[#475569]">Send us a message instead — a real person will reply by email.</p>
                    <button type="button" onClick={() => setView("contact")} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
                      <Mail className="h-3.5 w-3.5" /> Send a message
                    </button>
                  </div>
                )}
              </div>
            )}

            {view === "contact" && (
              <div>
                <p className="mb-3 text-sm text-[#475569]">A real person reads and replies to every message.</p>
                <ContactForm source="widget" onSent={() => {}} />
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) reset();
        }}
        aria-label={open ? "Close ZyncoAI Help" : "Open ZyncoAI Help"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-white shadow-[0_8px_24px_rgba(99,102,241,0.4)] transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleQuestion className="h-6 w-6" />}
      </button>
    </div>
  );
}
