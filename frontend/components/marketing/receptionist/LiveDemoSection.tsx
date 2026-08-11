"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight, PhoneIncoming, CheckCircle2, CalendarCheck } from "lucide-react";
import { CallEllaButton } from "./CallEllaButton";
import demoCall from "./demoCallTranscript.json";

// 2026-08-11 — this file and CallEllaButton.tsx each carried a different
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

// The old "Play" button here drove a hand-typed CONVERSATION array through
// a setTimeout-per-line animation — it never played real audio and wasn't
// wired to anything that could break, but it also wasn't real. Replaced
// 2026-08-11 with a genuine audio recording: every line below was
// synthesized through Cartesia using the EXACT production voice/model/
// settings (backend/src/voice/pipecat/server.py's send_busy_and_close —
// model_id "sonic-3.5", the real CARTESIA_VOICE_ID, speed 0.92, emotion
// "calm") — not a soundalike. Regenerate via
// backend/scripts/generate-demo-audio.mjs if the script text ever changes.
// The conversation itself follows the real production greeting pattern
// (server.py's build_dynamic_new_caller_greeting / AI IDENTITY rule): AI
// disclosure, recording disclosure, and an email confirmation — not SMS,
// which is currently blocked account-wide (lib/sms.ts) and would have
// reintroduced the exact overclaim already fixed elsewhere on this site.
type TranscriptLine = { speaker: "caller" | "ella"; text: string; start: number; end: number };
const LINES = demoCall.lines as TranscriptLine[];
const TOTAL_DURATION = demoCall.totalDuration as number;
const WAVEFORM = demoCall.waveform as number[];

// The moment Ella first confirms the booking — this is when the dashboard
// card slides in, synced to the actual audio, not a guessed delay.
const BOOKING_CONFIRMED_AT = LINES.find((l) => l.text.startsWith("Great, you're booked in"))?.start ?? 0;
const CALLER_MOBILE_DISPLAY = "+61 412 345 678"; // illustrative caller ID for the incoming-call mockup card — same convention as the fake example numbers already used throughout this site's other UI mockups (e.g. HowItWorksSection), not a real/dialable number

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

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LiveDemoSection({ voiceHealthy = false }: { voiceHealthy?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [hasStarted, setHasStarted] = useState(false); // becomes true on first play, stays true (idle "tease" state only shows before first play)
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [bookingCardShown, setBookingCardShown] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);

  // High-frequency waveform-progress + playhead updates go straight to the
  // DOM via refs (no React re-render per frame) — the only state updates
  // that cause a re-render are the discrete, much-rarer ones (active
  // transcript line, booking-card reveal), matching "CSS/transform-based
  // animations... 60fps" without hammering React on every tick.
  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const t = audio.currentTime;
      const progress = Math.min(1, t / TOTAL_DURATION);
      if (overlayRef.current) overlayRef.current.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${progress * 100}%)`;
      setDisplayTime(t);

      const idx = LINES.findIndex((l) => t >= l.start && t < l.end);
      setActiveLineIndex((prev) => (prev !== idx ? idx : prev));
      if (!bookingCardShown && t >= BOOKING_CONFIRMED_AT) setBookingCardShown(true);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [bookingCardShown]);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);

  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!hasStarted) {
        setHasStarted(true);
        posthog.capture("demo_played", {});
      }
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
    setActiveLineIndex(-1);
    setBookingCardShown(false);
    setDisplayTime(0);
    if (overlayRef.current) overlayRef.current.style.clipPath = "inset(0 100% 0 0)";
    if (playheadRef.current) playheadRef.current.style.transform = "translateX(0%)";
  }

  function seekTo(fraction: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = fraction * TOTAL_DURATION;
    if (!hasStarted) setHasStarted(true);
  }

  const callConnected = hasStarted && (isPlaying || displayTime > 0);

  return (
    <section className="py-20" id="live-demo-audio">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See how Ella handles a real call</h2>
        <p className="mt-3 text-[#475569]">
          {voiceHealthy ? "This is the actual conversation pattern from Ella's production booking flow." : "Our live demo line is temporarily offline — this recording is not a mockup."}
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl justify-center">
        <CallEllaButton healthy={voiceHealthy} />
      </div>
      {voiceHealthy && <p className="mt-3 text-center text-xs text-[#475569]">This is a real AI — she will answer instantly.</p>}

      <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
        {/* Incoming-call moment — appears once playback starts, settles into a connected state. */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {callConnected && !reducedMotion && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${callConnected ? "bg-emerald-500" : "bg-[#cbd5e1]"}`} />
            </span>
            <p className="text-xs uppercase tracking-wide text-[#475569]">{callConnected ? "Call connected" : "Example conversation"}</p>
          </div>
          <p className="text-xs font-medium text-[#475569]">Generated with Ella&apos;s real production voice</p>
        </div>

        {!reducedMotion ? (
          <motion.div
            initial={false}
            animate={hasStarted ? { opacity: 1, height: "auto", marginTop: 12 } : { opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <IncomingCallCard />
          </motion.div>
        ) : (
          hasStarted && (
            <div className="mt-3">
              <IncomingCallCard />
            </div>
          )
        )}

        {/* Waveform + play control */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={`group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)] transition hover:opacity-90 ${
              !hasStarted && !reducedMotion ? "zynco-breathe" : ""
            }`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>

          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              aria-label="Seek"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seekTo(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
              }}
              className="relative block h-10 w-full cursor-pointer"
            >
              {/* base (unplayed) bars */}
              <div className="absolute inset-0 flex items-center gap-[2px]">
                {WAVEFORM.map((v, i) => (
                  <span key={i} className="min-w-0 flex-1 rounded-full bg-[#e2e8f0]" style={{ height: `${Math.max(8, v * 100)}%` }} />
                ))}
              </div>
              {/* played overlay — revealed via clip-path, driven imperatively for smooth 60fps */}
              <div ref={overlayRef} className="absolute inset-0 flex items-center gap-[2px]" style={{ clipPath: "inset(0 100% 0 0)" }}>
                {WAVEFORM.map((v, i) => (
                  <span key={i} className="min-w-0 flex-1 rounded-full bg-[image:linear-gradient(180deg,#4f46e5,#06b6d4)]" style={{ height: `${Math.max(8, v * 100)}%` }} />
                ))}
              </div>
              <div ref={playheadRef} className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-[#0f172a]/20" style={{ transform: "translateX(0%)" }} />
            </button>
            <div className="mt-1.5 flex items-center justify-between text-[11px] tabular-nums text-[#475569]">
              <span>{formatTime(displayTime)}</span>
              <span>{formatTime(TOTAL_DURATION)}</span>
            </div>
          </div>
        </div>

        {!hasStarted && (
          <p className="mt-4 text-center text-sm font-medium text-[#475569]">
            {Math.round(TOTAL_DURATION)} seconds. Hear your next receptionist.
          </p>
        )}

        <audio ref={audioRef} src="/audio/demo/ella-demo-call.mp3" preload="none" onEnded={handleEnded} className="hidden" />

        {/* Transcript, synced */}
        <div className="mt-6 space-y-2.5">
          {LINES.map((line, i) => {
            const isCaller = line.speaker === "caller";
            const active = i === activeLineIndex;
            return (
              <div key={i} className={`flex ${isCaller ? "justify-end" : "justify-start"}`}>
                <button
                  onClick={() => seekTo(line.start / TOTAL_DURATION)}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-left text-sm transition-all duration-300 ${
                    isCaller ? "bg-slate-100 text-[#0f172a]" : "border border-[#c7d2fe] bg-[#eef2ff] text-[#0f172a]"
                  } ${active ? "shadow-[0_4px_16px_rgba(79,70,229,0.18)] ring-1 ring-[#6366f1]/40" : ""}`}
                >
                  {/* Label stays full-opacity/high-contrast regardless of active state —
                      dimming it along with the body text (previously via opacity-70 on
                      the whole button) pushed a 10px caption below WCAG AA contrast,
                      caught by a live Lighthouse accessibility audit. Only the message
                      text itself dims for inactive lines. */}
                  <p className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wide ${isCaller ? "text-[#475569]" : "text-[#4338ca]"}`}>
                    {isCaller ? "Caller" : "Ella"}
                  </p>
                  <span className={active ? "" : "opacity-70"}>{line.text}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Booking-confirmed dashboard-card moment — real product styling, synced to the exact line where Ella confirms. */}
        {!reducedMotion ? (
          <motion.div
            initial={false}
            animate={bookingCardShown ? { opacity: 1, y: 0, height: "auto", marginTop: 20 } : { opacity: 0, y: 10, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="overflow-hidden"
          >
            <BookingCard />
          </motion.div>
        ) : (
          bookingCardShown && (
            <div className="mt-5">
              <BookingCard />
            </div>
          )
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]">
            Try with your own clinic <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes zynco-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35); }
          50% { transform: scale(1.06); box-shadow: 0 8px 30px rgba(79, 70, 229, 0.5); }
        }
        .zynco-breathe { animation: zynco-breathe 2.4s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

function IncomingCallCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-slate-50 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4f46e5]/10">
        <PhoneIncoming className="h-5 w-5 text-[#4f46e5]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0f172a]">Incoming call</p>
        <p className="truncate text-xs text-[#475569]">{CALLER_MOBILE_DISPLAY}</p>
      </div>
    </div>
  );
}

export function BookingCard() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-[#e2e8f0] bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-[#475569]">
        <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> Bookings</span>
        <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Synced</span>
      </div>
      <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">Tomorrow, 9:00am — New booking</div>
    </div>
  );
}
