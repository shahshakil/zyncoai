"use client";
import { useSpotlight } from "./useSpotlight";

const CONTROLS = [
  { label: "Call Recording", color: "#4f46e5" },
  { label: "Missed-Call Text-Back", color: "#06b6d4" },
  { label: "SMS Follow-up", color: "#10b981" },
  { label: "Voicemail Transcription", color: "#f59e0b" },
  { label: "Appointment Reminders", color: "#4f46e5" },
  { label: "Custom Scripts", color: "#06b6d4" },
];

export function PlatformControlsSection() {
  const spotlight = useSpotlight(CONTROLS.length);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Platform controls</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a] sm:text-3xl">Every capability, on by default</h2>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
        {CONTROLS.map((c, i) => {
          const isLit = spotlight === i;
          return (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-[#1e293b] transition-[border-color,box-shadow,transform] duration-500"
              style={{
                borderColor: isLit ? c.color : "#e2e8f0",
                boxShadow: isLit ? `0 8px 20px ${c.color}26, 0 1px 3px rgba(0,0,0,0.08)` : "0 1px 3px rgba(0,0,0,0.08)",
                transform: isLit ? "translateY(-2px)" : "none",
              }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.color }} />
              {c.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
