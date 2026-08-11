"use client";
import { motion } from "framer-motion";
import { PhoneIncoming, ArrowRight } from "lucide-react";
import { BookingCard } from "./LiveDemoSection";

// 2026-08-11 — executive-grade restage. The old version was a small,
// auto-rotating 4-step carousel with a progress-dot rail — replaced with a
// spacious, static 3-beat layout (the real flow: call comes in -> Ella
// handles it -> booking lands on the dashboard) so it reads clearly in one
// glance rather than requiring a visitor to wait through an animation
// cycle. One entrance motion per beat, no looping, no auto-advance.
// Beat 3 reuses LiveDemoSection's exact BookingCard component — same real
// product styling in both places, not a redrawn lookalike.
const BEATS = [
  {
    title: "A call comes in",
    description: "Ella answers instantly, day or night — no hold music, no voicemail.",
  },
  {
    title: "Ella handles it",
    description: "She checks real availability and books the appointment in the same conversation.",
  },
  {
    title: "It lands on your dashboard",
    description: "Synced to your calendar the moment the call ends — nothing to re-enter.",
  },
];

function CallVisual() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4f46e5]/10">
          <PhoneIncoming className="h-5 w-5 text-[#4f46e5]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">Incoming call</p>
          <p className="text-xs text-[#475569]">Answered in under 1 second</p>
        </div>
      </div>
      <div className="flex h-6 items-end gap-1">
        {[6, 14, 20, 12, 8, 16, 10].map((h, i) => (
          <span key={i} className="w-1 rounded-full bg-[#4f46e5]/40" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

function ConversationVisual() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-left text-xs text-[#0f172a]">
          <p className="mb-0.5 text-[9px] uppercase tracking-wide text-[#64748b]">Caller</p>
          &ldquo;Can I book for tomorrow morning?&rdquo;
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] px-3 py-2 text-left text-xs text-[#0f172a]">
          <p className="mb-0.5 text-[9px] uppercase tracking-wide text-[#4f46e5]">Ella</p>
          &ldquo;I have 9am with Dr Patel — does that work?&rdquo;
        </div>
      </div>
    </div>
  );
}

const VISUALS = [CallVisual, ConversationVisual, BookingCard];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">How it works</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">A live call, start to finish</h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {BEATS.map((beat, i) => {
            const Visual = VISUALS[i];
            return (
              <motion.div
                key={beat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                {i > 0 && (
                  <ArrowRight className="absolute -left-7 top-2 hidden h-5 w-5 text-[#cbd5e1] md:block" />
                )}
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6366f1]">Step {i + 1}</span>
                <h3 className="mt-2 text-xl font-bold text-[#0f172a]">{beat.title}</h3>
                <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-[#475569]">{beat.description}</p>
                <div className="mt-6 w-full max-w-xs">
                  <Visual />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
