"use client";
// Real "was this helpful?" vote capture, shared by the Help Centre
// (HelpCentre.tsx) and the corner help widget (HelpWidget.tsx) — both post
// to the same /help/feedback endpoint and HelpFeedback table, keyed by
// `slug`. Counts are admin-visible only (see admin/helpFeedback.ts) — never
// rendered here, so there's no public vote number to fabricate or inflate.
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { API_BASE } from "@/lib/marketing-api";

export function HelpVote({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(`help-vote:${slug}`) : null;
    if (stored === "yes" || stored === "no") setVoted(stored);
  }, [slug]);

  async function vote(helpful: boolean) {
    const value = helpful ? "yes" : "no";
    setVoted(value);
    try {
      window.localStorage.setItem(`help-vote:${slug}`, value);
    } catch {
      // localStorage unavailable (private browsing etc.) — vote still submits, just won't persist across reloads.
    }
    try {
      await fetch(`${API_BASE}/help/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionSlug: slug, helpful }),
      });
    } catch {
      // Best-effort — a failed vote isn't worth surfacing an error over.
    }
  }

  if (voted) {
    return <p className="mt-3 text-xs text-[#94a3b8]">Thanks for your feedback!</p>;
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      <p className="text-xs text-[#94a3b8]">Was this helpful?</p>
      <button
        type="button"
        onClick={() => vote(true)}
        className="flex items-center gap-1 rounded-full border border-[#e2e8f0] px-2.5 py-1 text-xs text-[#475569] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <ThumbsUp className="h-3 w-3" /> Yes
      </button>
      <button
        type="button"
        onClick={() => vote(false)}
        className="flex items-center gap-1 rounded-full border border-[#e2e8f0] px-2.5 py-1 text-xs text-[#475569] transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
      >
        <ThumbsDown className="h-3 w-3" /> No
      </button>
    </div>
  );
}
