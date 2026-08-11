"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, PhoneCall } from "lucide-react";
import { FAQS, FAQ_CATEGORIES, type FaqCategory } from "@/components/seo/FaqJsonLd";
import { DEMO_NUMBER } from "./LiveDemoSection";

// Renders the exact same Q&A content the FAQPage JSON-LD in FaqJsonLd
// describes — Google's structured data guidelines require FAQ schema to
// reflect visible page content, not markup nobody can actually read. Used
// both as a homepage subsection (default props) and as the standalone
// /faq page's main content (headingLevel="h1", same visual design either
// way — see app/(marketing)/faq/page.tsx).
//
// 2026-08-05 visual upgrade — category pills are a pure client-side
// filter over the SAME FAQS array FaqJsonLd exports; they don't change
// which questions exist or their JSON-LD content, only which subset is
// visible at once. openQuestion is keyed by question text rather than
// array index specifically so switching categories can't leave the
// "open" state pointing at the wrong row once the visible list changes.
export function FaqSection({
  eyebrow = "FAQ",
  title = "Common questions",
  subtitle = "Everything you need to know about ZyncoAI, answered plainly.",
  headingLevel = "h2",
  voiceHealthy = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  headingLevel?: "h1" | "h2";
  voiceHealthy?: boolean;
}) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(FAQS[0]?.question ?? null);
  const [activeCategory, setActiveCategory] = useState<FaqCategory | null>(null);
  const Heading = headingLevel;

  const visibleFaqs = useMemo(() => (activeCategory ? FAQS.filter((f) => f.category === activeCategory) : FAQS), [activeCategory]);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#4f46e5]">
          {eyebrow}
        </span>
        <Heading className="mt-4 text-3xl font-bold text-[#0f172a] sm:text-4xl">{title}</Heading>
        <p className="mt-3 text-sm text-[#475569]">{subtitle}</p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
        {FAQ_CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(active ? null : cat)}
              aria-pressed={active}
              className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition ${
                active
                  ? "bg-[#6366f1] text-white"
                  : "border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#c7d2fe] hover:text-[#4f46e5]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-3">
        {visibleFaqs.map((f) => {
          const open = openQuestion === f.question;
          return (
            <div
              key={f.question}
              className={`overflow-hidden rounded-[10px] border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors ${
                open ? "border-[#c7d2fe] border-l-[3px] border-l-[#6366f1]" : "border-[#e2e8f0]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenQuestion(open ? null : f.question)}
                className="flex min-h-[44px] w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open}
              >
                <span className="text-base font-semibold text-[#0f172a]">{f.question}</span>
                {open ? <Minus className="h-5 w-5 shrink-0 text-[#6366f1]" /> : <Plus className="h-5 w-5 shrink-0 text-[#475569]" />}
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <h3 className="text-lg font-semibold text-[#0f172a]">Still have questions?</h3>
        <p className="mt-2 text-sm text-[#475569]">
          {voiceHealthy ? "Hear ZyncoAI handle a real call yourself — no sign-up required." : "Our live demo line is temporarily offline — hear a real recording instead."}
        </p>
        <a
          href={voiceHealthy ? `tel:${DEMO_NUMBER.replace(/\s/g, "")}` : "#live-demo-audio"}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <PhoneCall className="h-4 w-4" /> {voiceHealthy ? "Call the live demo" : "Hear the demo recording"}
        </a>
      </div>
    </section>
  );
}
