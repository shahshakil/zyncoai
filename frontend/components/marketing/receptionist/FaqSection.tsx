"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/components/seo/FaqJsonLd";

// Renders the exact same Q&A content the FAQPage JSON-LD in FaqJsonLd
// describes — Google's structured data guidelines require FAQ schema to
// reflect visible page content, not markup nobody can actually read. Used
// both as a homepage subsection (default props) and as the standalone
// /faq page's main content (headingLevel="h1", same visual design either
// way — see app/(marketing)/faq/page.tsx).
export function FaqSection({
  eyebrow = "FAQ",
  title = "Common questions",
  headingLevel = "h2",
}: {
  eyebrow?: string;
  title?: string;
  headingLevel?: "h1" | "h2";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const Heading = headingLevel;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{eyebrow}</p>
        <Heading className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">{title}</Heading>
      </div>

      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {FAQS.map((f, i) => {
          const open = openIndex === i;
          return (
            <div key={f.question} className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open}
              >
                <span className="text-base font-semibold text-[#0f172a]">{f.question}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#94a3b8] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-[#475569]">{f.answer}</p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
