"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight, Phone } from "lucide-react";
import { CountUp } from "./CountUp";

const DEMO_NUMBER = "+61 2 5747 4612";

type Turn = { speaker: "charlotte"; audio: string; text: string } | { speaker: "caller"; text: string };

// Real Charlotte audio, generated via ElevenLabs with the same voice ID the
// production voice pipeline defaults to (backend/src/voice/vapi/vapiConfig.ts)
// — this is the voice that answers every real call, not a stand-in.
const CONVERSATION: Turn[] = [
  { speaker: "charlotte", audio: "/audio/charlotte-greeting.mp3", text: "Good morning! Thanks for calling Sydney Medical Centre, this is Charlotte speaking — how can I help you today?" },
  { speaker: "caller", text: "Hi I'd like to book an appointment" },
  { speaker: "charlotte", audio: "/audio/charlotte-availability.mp3", text: "Of course! The doctor has Thursday at 10am or Friday at 2pm available. Which works better for you?" },
  { speaker: "caller", text: "Thursday please" },
  { speaker: "charlotte", audio: "/audio/charlotte-confirm.mp3", text: "Perfect! Can I get your name and a good contact number to confirm the booking?" },
  { speaker: "caller", text: "My name is Sarah, 0412 345 678" },
  { speaker: "charlotte", audio: "/audio/charlotte-booked.mp3", text: "Lovely — you are all booked in for Thursday at 10am. I will send a confirmation to your email shortly. Is there anything else I can help you with?" },
];

function playClip(audio: HTMLAudioElement, src: string): Promise<void> {
  return new Promise((resolve) => {
    audio.src = src;
    audio.currentTime = 0;
    const onEnd = () => {
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onEnd);
      resolve();
    };
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onEnd);
    audio.play().catch(() => resolve());
  });
}

export function LiveDemoSection() {
  const [playing, setPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const cancelledRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function playSequence() {
    cancelledRef.current = false;
    setPlaying(true);
    const start = visibleCount >= CONVERSATION.length ? 0 : visibleCount;
    if (start === 0) setVisibleCount(0);

    for (let i = start; i < CONVERSATION.length; i++) {
      if (cancelledRef.current) return;
      setVisibleCount(i + 1);
      const turn = CONVERSATION[i];
      if (turn.speaker === "charlotte" && audioRef.current) {
        setSpeakingIndex(i);
        await playClip(audioRef.current, turn.audio);
        setSpeakingIndex(null);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      if (cancelledRef.current) return;
    }
    setPlaying(false);
  }

  function togglePlay() {
    if (playing) {
      cancelledRef.current = true;
      audioRef.current?.pause();
      setSpeakingIndex(null);
      setPlaying(false);
    } else {
      posthog.capture("demo_played", {});
      playSequence();
    }
  }

  const visibleTurns = CONVERSATION.slice(0, visibleCount);

  return (
    <section className="py-20">
      <audio ref={audioRef} preload="auto" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Hear Charlotte answer a real call</h2>
        <p className="mt-3 text-[#475569]">Press play — this is the real Charlotte voice, the same one that answers every ZyncoAI call.</p>
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
          <Phone className="h-5 w-5" /> Call Charlotte now: {DEMO_NUMBER}
        </a>
      </div>
      <p className="mt-3 text-center text-xs text-[#94a3b8]">This is a real AI — she will answer instantly.</p>

      <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Example conversation</p>
          <button
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : visibleCount >= CONVERSATION.length ? "Play again" : "Play"}
          </button>
        </div>

        <div className="mt-6 min-h-[280px] space-y-3">
          {visibleTurns.map((turn, i) => {
            const isCaller = turn.speaker === "caller";
            const isSpeaking = speakingIndex === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isCaller ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm transition-shadow ${
                    isCaller ? "bg-slate-100 text-[#0f172a]" : "border border-[#c7d2fe] bg-[#eef2ff] text-[#0f172a]"
                  } ${isSpeaking ? "ring-2 ring-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.45)]" : ""}`}
                >
                  <p className={`mb-0.5 text-[10px] uppercase tracking-wide ${isCaller ? "text-[#64748b]" : "text-[#6366f1]"}`}>
                    {isCaller ? "Caller" : "Charlotte"}
                  </p>
                  {turn.text}
                </div>
              </motion.div>
            );
          })}
          {visibleCount === 0 && <p className="py-16 text-center text-sm text-[#94a3b8]">Press play to hear the conversation</p>}
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#4338ca]">
            Try with your own clinic <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#e2e8f0] pt-6 text-center">
          <div>
            <div className="text-xl font-bold text-[#0f172a]"><CountUp target={847} /></div>
            <p className="mt-1 text-xs text-[#94a3b8]">Calls answered today</p>
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]"><CountUp target={312} /></div>
            <p className="mt-1 text-xs text-[#94a3b8]">Bookings made</p>
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0.8s</div>
            <p className="mt-1 text-xs text-[#94a3b8]">Avg answer time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
