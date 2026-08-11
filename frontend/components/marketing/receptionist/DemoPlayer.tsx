"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, PhoneIncoming, CheckCircle2, CalendarCheck } from "lucide-react";

// Extracted 2026-08-11 from LiveDemoSection.tsx so the personalized /demo
// generator can reuse the EXACT same player (waveform scrubber, synced
// transcript, incoming-call + booking-card visuals, imperative rAF-driven
// progress) instead of a redrawn lookalike — see that file's own comments
// for the full "why" behind the rAF/ref-based update strategy and the
// opacity/contrast fix. This component owns none of the audio content
// itself (no static import) — everything comes in as props, so both the
// landing page's fixed demo and a freshly-generated personalized one drive
// identical UI.
export type DemoTranscriptLine = { speaker: "caller" | "ella"; text: string; start: number; end: number };
export type DemoTranscript = { totalDuration: number; lines: DemoTranscriptLine[]; waveform: number[] };

const CALLER_MOBILE_DISPLAY = "+61 412 345 678"; // illustrative caller ID for the incoming-call mockup card — same convention as the fake example numbers used throughout this site's other UI mockups, not a real/dialable number

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

export function IncomingCallCard() {
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

export function BookingCard({ label = "Tomorrow, 9:00am — New booking" }: { label?: string }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-[#e2e8f0] bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-[#475569]">
        <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> Bookings</span>
        <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Synced</span>
      </div>
      <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">{label}</div>
    </div>
  );
}

export function DemoPlayer({
  audioSrc,
  transcript,
  idleTeaseText,
  bookingLineMatch,
  bookingLabel = "Tomorrow, 9:00am — New booking",
  onFirstPlay,
  onPlayError,
}: {
  audioSrc: string;
  transcript: DemoTranscript;
  idleTeaseText?: string;
  bookingLineMatch: (text: string) => boolean;
  bookingLabel?: string;
  onFirstPlay?: () => void;
  onPlayError?: (reason: string) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasFiredFirstPlayRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const { totalDuration, lines, waveform } = transcript;
  const bookingConfirmedAt = lines.find((l) => bookingLineMatch(l.text))?.start ?? 0;

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [bookingCardShown, setBookingCardShown] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  // Truthful playback-failure state — never assumed. audio.play() returns a
  // promise that can reject (mobile autoplay/gesture policy, a blocked
  // cross-origin load, a decode error) without ever throwing synchronously,
  // and isPlaying itself is only ever set from the <audio> element's own
  // native play/pause/error events below, never optimistically in the click
  // handler — otherwise a rejected play() still LOOKS like "Call connected"
  // with nothing actually playing: a silent hang, not a visible failure.
  const [playError, setPlayError] = useState<string | null>(null);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const t = audio.currentTime;
      const progress = Math.min(1, t / totalDuration);
      if (overlayRef.current) overlayRef.current.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${progress * 100}%)`;
      setDisplayTime(t);

      const idx = lines.findIndex((l) => t >= l.start && t < l.end);
      setActiveLineIndex((prev) => (prev !== idx ? idx : prev));
      if (!bookingCardShown && t >= bookingConfirmedAt) setBookingCardShown(true);
    }
    rafRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingCardShown, totalDuration, lines, bookingConfirmedAt]);

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

  // A fresh audioSrc (new personalized generation) needs its own clean
  // slate — otherwise a second generated demo would inherit the first
  // one's stale playhead/transcript-highlight state.
  useEffect(() => {
    setHasStarted(false);
    setIsPlaying(false);
    setPlayError(null);
    setActiveLineIndex(-1);
    setBookingCardShown(false);
    setDisplayTime(0);
    hasFiredFirstPlayRef.current = false;
    if (overlayRef.current) overlayRef.current.style.clipPath = "inset(0 100% 0 0)";
    if (playheadRef.current) playheadRef.current.style.transform = "translateX(0%)";
  }, [audioSrc]);

  // Direct result of a real tap/click — this is the ONLY place play() is
  // ever called. Never called from an effect, a timer, or right after
  // generation completes: mobile browsers silently reject autoplay outside
  // a genuine user gesture, and this handler only ever runs from one.
  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!hasStarted) setHasStarted(true);
      setPlayError(null);
      const playPromise = audio.play();
      // isPlaying is set by the native onPlay handler below, not here —
      // this only captures WHY a rejection happened, for the error state
      // and telemetry. Older browsers whose play() doesn't return a
      // promise fall through fine: onPlay still fires normally.
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err: unknown) => {
          const reason = err instanceof Error ? err.name || err.message : "playback_failed";
          setPlayError(reason);
          onPlayError?.(reason);
        });
      }
    } else {
      audio.pause();
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

  function handleAudioError() {
    setIsPlaying(false);
    const reason = "load_failed";
    setPlayError(reason);
    onPlayError?.(reason);
  }

  function seekTo(fraction: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = fraction * totalDuration;
    if (!hasStarted) setHasStarted(true);
  }

  const callConnected = hasStarted && (isPlaying || displayTime > 0);

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
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
            <div className="absolute inset-0 flex items-center gap-[2px]">
              {waveform.map((v, i) => (
                <span key={i} className="min-w-0 flex-1 rounded-full bg-[#e2e8f0]" style={{ height: `${Math.max(8, v * 100)}%` }} />
              ))}
            </div>
            <div ref={overlayRef} className="absolute inset-0 flex items-center gap-[2px]" style={{ clipPath: "inset(0 100% 0 0)" }}>
              {waveform.map((v, i) => (
                <span key={i} className="min-w-0 flex-1 rounded-full bg-[image:linear-gradient(180deg,#4f46e5,#06b6d4)]" style={{ height: `${Math.max(8, v * 100)}%` }} />
              ))}
            </div>
            <div ref={playheadRef} className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-[#0f172a]/20" style={{ transform: "translateX(0%)" }} />
          </button>
          <div className="mt-1.5 flex items-center justify-between text-[11px] tabular-nums text-[#475569]">
            <span>{formatTime(displayTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>
      </div>

      {playError && (
        <p className="mt-3 text-center text-sm font-medium text-red-600">
          Playback didn&apos;t start — tap the play button to try again.
        </p>
      )}

      {!hasStarted && idleTeaseText && (
        <p className="mt-4 text-center text-sm font-medium text-[#475569]">{idleTeaseText}</p>
      )}

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        crossOrigin="anonymous"
        onPlay={() => {
          setIsPlaying(true);
          if (!hasFiredFirstPlayRef.current) {
            hasFiredFirstPlayRef.current = true;
            onFirstPlay?.();
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={handleAudioError}
        className="hidden"
      />

      <div className="mt-6 space-y-2.5">
        {lines.map((line, i) => {
          const isCaller = line.speaker === "caller";
          const active = i === activeLineIndex;
          return (
            <div key={i} className={`flex ${isCaller ? "justify-end" : "justify-start"}`}>
              <button
                onClick={() => seekTo(line.start / totalDuration)}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-left text-sm transition-all duration-300 ${
                  isCaller ? "bg-slate-100 text-[#0f172a]" : "border border-[#c7d2fe] bg-[#eef2ff] text-[#0f172a]"
                } ${active ? "shadow-[0_4px_16px_rgba(79,70,229,0.18)] ring-1 ring-[#6366f1]/40" : ""}`}
              >
                <p className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wide ${isCaller ? "text-[#475569]" : "text-[#4338ca]"}`}>
                  {isCaller ? "Caller" : "Ella"}
                </p>
                <span className={active ? "" : "opacity-70"}>{line.text}</span>
              </button>
            </div>
          );
        })}
      </div>

      {!reducedMotion ? (
        <motion.div
          initial={false}
          animate={bookingCardShown ? { opacity: 1, y: 0, height: "auto", marginTop: 20 } : { opacity: 0, y: 10, height: 0, marginTop: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="overflow-hidden"
        >
          <BookingCard label={bookingLabel} />
        </motion.div>
      ) : (
        bookingCardShown && (
          <div className="mt-5">
            <BookingCard label={bookingLabel} />
          </div>
        )
      )}

      <style jsx global>{`
        @keyframes zynco-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35); }
          50% { transform: scale(1.06); box-shadow: 0 8px 30px rgba(79, 70, 229, 0.5); }
        }
        .zynco-breathe { animation: zynco-breathe 2.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
