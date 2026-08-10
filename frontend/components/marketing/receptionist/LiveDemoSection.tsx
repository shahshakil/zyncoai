"use client";
import { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { Play, RotateCcw, ArrowRight, Phone } from "lucide-react";

// 2026-08-10 — this file and CallEllaButton.tsx each carried a different
// number with a comment claiming the OTHER one was fake. Re-verified
// directly against the DB rather than trusting either stale comment: BOTH
// numbers are real, live, ACTIVE Business.phoneNumber records with genuine
// completed call history (+61 2 5747 4612 = Bright Smile Dental, +61 2 5747
// 4792 = shahs clinic). Standardized on 4792 — shahs clinic is the
// deliberately-designated internal test/demo business (see BusinessAddOn /
// paid-plan-invariant notes elsewhere in this codebase) and has the more
// recently verified live completed call. Exported so other components
// (e.g. FaqSection's closing CTA) reuse this exact literal instead of
// duplicating it, so there's only ever one number to keep correct.
export const DEMO_NUMBER = "+61 2 5747 4792";

type Turn = { speaker: "ella" | "caller"; text: string };

// Real dialogue pattern from the production system prompt (backend
// src/voice/pipecat/server.py) — not a fabricated script, this is how Ella
// actually structures a booking call. No audio here: press play for the
// transcript, or call the real number above to hear her live.
const CONVERSATION: Turn[] = [
  { speaker: "ella", text: "Good morning! Thanks for calling Sydney Medical Centre, this is Ella speaking — how can I help you today?" },
  { speaker: "caller", text: "Hi, I'd like to book an appointment" },
  { speaker: "ella", text: "Of course! The doctor has Thursday at 10am or Friday at 2pm available. Which works better for you?" },
  { speaker: "caller", text: "Thursday please" },
  { speaker: "ella", text: "Perfect! Can I get your name and a good contact number to confirm the booking?" },
  { speaker: "caller", text: "My name is Sarah, 0412 345 678" },
  { speaker: "ella", text: "Lovely — you're all booked in for Thursday at 10am. I'll send a confirmation to your email shortly. Is there anything else I can help you with?" },
];

export function LiveDemoSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  function playSequence() {
    posthog.capture("demo_played", {});
    setPlaying(true);
    setVisibleCount(0);
    let i = 0;
    const step = () => {
      i += 1;
      setVisibleCount(i);
      if (i < CONVERSATION.length) {
        setTimeout(step, 1400);
      } else {
        setPlaying(false);
      }
    };
    setTimeout(step, 300);
  }

  const visibleTurns = CONVERSATION.slice(0, visibleCount);
  const finished = visibleCount >= CONVERSATION.length;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See how Ella handles a real call</h2>
        <p className="mt-3 text-[#475569]">This is the actual conversation pattern from Ella&apos;s production booking flow.</p>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl justify-center">
        <a
          href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
          className="relative inline-flex items-center gap-2.5 rounded-2xl bg-[#10b981] px-6 py-3.5 text-base font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition hover:bg-emerald-500"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <Phone className="h-5 w-5" /> Call Ella now: {DEMO_NUMBER}
        </a>
      </div>
      <p className="mt-3 text-center text-xs text-[#94a3b8]">This is a real AI — she will answer instantly.</p>

      <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Example conversation</p>
          <button
            onClick={playSequence}
            disabled={playing}
            className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {finished ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Playing…" : finished ? "Play again" : "Play"}
          </button>
        </div>

        <div className="mt-6 min-h-[280px] space-y-3">
          {visibleTurns.map((turn, i) => {
            const isCaller = turn.speaker === "caller";
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isCaller ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isCaller ? "bg-slate-100 text-[#0f172a]" : "border border-[#c7d2fe] bg-[#eef2ff] text-[#0f172a]"
                  }`}
                >
                  <p className={`mb-0.5 text-[10px] uppercase tracking-wide ${isCaller ? "text-[#64748b]" : "text-[#4f46e5]"}`}>
                    {isCaller ? "Caller" : "Ella"}
                  </p>
                  {turn.text}
                </div>
              </motion.div>
            );
          })}
          {visibleCount === 0 && <p className="py-16 text-center text-sm text-[#94a3b8]">Press play to see the conversation</p>}
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]">
            Try with your own clinic <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
