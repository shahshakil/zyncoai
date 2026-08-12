"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { PhoneIncoming, ArrowRight } from "lucide-react";
import { BookingCard } from "./DemoPlayer";

// 2026-08-11 — executive-grade restage. The old version was a small,
// auto-rotating 4-step carousel with a progress-dot rail — replaced with a
// spacious, static 3-beat layout (the real flow: call comes in -> Ella
// handles it -> booking lands on the dashboard) so it reads clearly in one
// glance rather than requiring a visitor to wait through an animation
// cycle. One entrance motion per beat, no looping, no auto-advance.
// Beat 3 reuses LiveDemoSection's exact BookingCard component — same real
// product styling in both places, not a redrawn lookalike.
//
// 2026-08-13 — proof-wiring pass. This section's claims now point at their
// own receipts elsewhere on the page (see the jump-links in beats 2 and 3,
// and the audit comment on the latency line in CallVisual below), and a
// scroll-linked rail/step-highlight ties the three beats into one visible
// thread instead of three independent cards. No layout/palette change
// beyond what those additions require.
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function jumpTo(e: React.MouseEvent, id: string, reducedMotion: boolean) {
  const el = document.getElementById(id);
  if (!el) return; // no target on this render (e.g. hydration race) — let the native #hash navigation handle it
  e.preventDefault();
  el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
}

function CallVisual() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4f46e5]/10">
          <PhoneIncoming className="h-5 w-5 text-[#4f46e5]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">Incoming call</p>
          {/* Audited 2026-08-11: Call.pddMs/ttfbMs (the fields built to
              measure exactly this — Twilio connect -> first greeting
              audio) are 0% populated across all 257 production calls;
              the write path was never wired up. The only real latency
              data in the system (CallTurn.latencyMs, mid-conversation
              turn latency, a different metric) has 6 samples at
              seconds-scale, not sub-second. No real distribution exists
              to back a stopwatch claim, so this states what's actually
              true by design rather than a measured number. */}
          <p className="text-xs text-[#475569]">No rings. No hold music. Just Ella.</p>
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
  // Verbatim excerpts from the real production-voice recording played in
  // "See how Ella handles a real call" (demoCallTranscript.json) — not a
  // paraphrase — so the "hear this exact conversation" link below is
  // literally true. Ella's line is a real substring (the ellipsis marks
  // the trimmed greeting that precedes it in the full call).
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-left text-xs text-[#0f172a]">
          <p className="mb-0.5 text-[9px] uppercase tracking-wide text-[#64748b]">Caller</p>
          &ldquo;Hi, I need to book an appointment for tomorrow morning, if possible.&rdquo;
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] px-3 py-2 text-left text-xs text-[#0f172a]">
          <p className="mb-0.5 text-[9px] uppercase tracking-wide text-[#4f46e5]">Ella</p>
          &ldquo;&hellip;I have nine a-m or eleven thirty tomorrow with Doctor Patel — would either of those suit?&rdquo;
        </div>
      </div>
    </div>
  );
}

const VISUALS = [CallVisual, ConversationVisual, BookingCard];

export function HowItWorksSection() {
  const reducedMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  // This site's <body> (not window) is the actual scroll container — see
  // LiveDashboardScene.tsx's IntersectionObserver notes for the same
  // quirk. useScroll listens on window by default, which never fires
  // here, so scrollYProgress would silently stay frozen at 0 without an
  // explicit container pointed at body. Evaluated as the useRef initial
  // value (not set later in an effect) so it's correct from the very
  // first client render — SSR-safe since it only guards `document`, and a
  // ref mismatch between server/client never triggers a hydration warning
  // the way JSX output would.
  const bodyRef = useRef<HTMLElement | null>(typeof document !== "undefined" ? document.body : null);
  const { scrollYProgress } = useScroll({ container: bodyRef, target: gridRef, offset: ["start 0.75", "end 0.35"] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // One continuous scroll-linked signal drives both the rail fill and the
  // step-number highlight below, so the two read as one gesture rather
  // than two independently-timed effects.
  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reducedMotion) return;
    setActiveStep(Math.min(2, Math.max(0, Math.floor(v * 3))));
  });
  // scrollYProgress can only be known once the browser is measuring real
  // scroll position, and prefers-reduced-motion is itself only knowable
  // after mount (see usePrefersReducedMotion above) — so, same fix as
  // LiveDashboardScene.tsx, the reduced-motion "complete" state is set
  // from an effect keyed on the real value, never baked into an
  // initializer that would miss a reduced-motion visitor entirely.
  useEffect(() => {
    if (reducedMotion) setActiveStep(2);
  }, [reducedMotion]);

  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">How it works</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">A live call, start to finish</h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <div className="pointer-events-none absolute -top-3 left-6 right-6 hidden h-px bg-[#e2e8f0] md:block" aria-hidden="true">
          {!reducedMotion ? (
            <motion.div className="h-px bg-[#6366f1]" style={{ width: lineWidth }} />
          ) : (
            <div className="h-px w-full bg-[#6366f1]" />
          )}
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {BEATS.map((beat, i) => {
            const Visual = VISUALS[i];
            const reached = i <= activeStep;
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
                <span className={`text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${reached ? "text-[#6366f1]" : "text-[#cbd5e1]"}`}>
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-xl font-bold text-[#0f172a]">{beat.title}</h3>
                <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-[#475569]">{beat.description}</p>
                <div className="mt-6 w-full max-w-xs">
                  <Visual />
                </div>
                {i === 1 && (
                  <a
                    href="#live-demo-audio"
                    onClick={(e) => jumpTo(e, "live-demo-audio", reducedMotion)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    <span aria-hidden="true">&#9654;</span> Hear this exact conversation
                  </a>
                )}
                {i === 2 && (
                  <a
                    href="#dashboard-live-scene"
                    onClick={(e) => jumpTo(e, "dashboard-live-scene", reducedMotion)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    See it land live <span aria-hidden="true">&#8595;</span>
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
