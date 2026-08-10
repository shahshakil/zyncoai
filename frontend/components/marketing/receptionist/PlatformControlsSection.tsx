"use client";
import { useSpotlight } from "./useSpotlight";

// 2026-08-10 — the section used to claim "every capability, on by default",
// which wasn't true for three of the six pills: SMS Follow-up (Twilio's SMS
// capability is disabled on our account — see backend src/lib/sms.ts's own
// header comment), Missed-Call Text-Back and Voicemail Transcription (no
// backend implementation exists for either — Ella answers calls live
// instead of taking voicemails, so there's nothing to transcribe). The
// other three are real and live today: Call Recording (local-disk storage),
// Appointment Reminders (a real pre-appointment voice call, see
// src/lib/checkinScheduler.ts — SMS is only a bonus channel there, gated
// behind a paid add-on and fails gracefully if unavailable), and Custom
// Scripts (core prompt configuration).
const CONTROLS = [
  { label: "Call Recording", color: "#4f46e5", live: true },
  { label: "Appointment Reminders", color: "#4f46e5", live: true },
  { label: "Custom Scripts", color: "#06b6d4", live: true },
  { label: "Missed-Call Text-Back", color: "#06b6d4", live: false },
  { label: "SMS Follow-up", color: "#10b981", live: false },
  { label: "Voicemail Transcription", color: "#f59e0b", live: false },
];

export function PlatformControlsSection() {
  const spotlight = useSpotlight(CONTROLS.length);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">Platform controls</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a] sm:text-3xl">What&apos;s live today</h2>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
        {CONTROLS.map((c, i) => {
          const isLit = spotlight === i && c.live;
          return (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-[border-color,box-shadow,transform] duration-500"
              style={{
                borderColor: isLit ? c.color : "#e2e8f0",
                boxShadow: isLit ? `0 8px 20px ${c.color}26, 0 1px 3px rgba(0,0,0,0.08)` : "0 1px 3px rgba(0,0,0,0.08)",
                transform: isLit ? "translateY(-2px)" : "none",
                color: c.live ? "#1e293b" : "#475569",
              }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.live ? c.color : "#cbd5e1" }} />
              {c.label}
              {!c.live && <span className="text-[10px] font-semibold uppercase tracking-wide text-[#475569]">Coming soon</span>}
            </span>
          );
        })}
      </div>
    </section>
  );
}
