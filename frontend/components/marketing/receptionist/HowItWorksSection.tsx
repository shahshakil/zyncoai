"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneIncoming, Mic, Volume2, LayoutDashboard, MousePointer2, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    label: "Phone rings",
    icon: PhoneIncoming,
    color: "#4f46e5",
    render: () => (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5]/10"
        >
          <PhoneIncoming className="h-7 w-7 text-[#4f46e5]" />
        </motion.div>
        <p className="text-sm font-medium text-[#0f172a]">Incoming call…</p>
        <div className="flex items-end gap-1">
          {[6, 12, 18, 12, 7, 14].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-[#4f46e5]/50"
              animate={{ height: [h, h * 1.6, h] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    label: "Caller just talks",
    icon: Mic,
    color: "#06b6d4",
    render: () => (
      <div className="flex flex-col items-center gap-3">
        <div className="max-w-[280px] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-left text-sm text-[#0f172a]">
          <p className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#475569]">
            <Mic className="h-3 w-3" /> Caller
          </p>
          &ldquo;Hi, I need to book an appointment for tomorrow morning.&rdquo;
        </div>
      </div>
    ),
  },
  {
    label: "Ella responds",
    icon: Volume2,
    color: "#10b981",
    render: () => (
      <div className="flex flex-col items-center gap-3">
        <div className="max-w-[280px] rounded-2xl rounded-br-sm border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3 text-left text-sm text-[#0f172a]">
          <p className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#4f46e5]">
            <Volume2 className="h-3 w-3" /> Ella
          </p>
          &ldquo;Of course! I have 9am or 11:30am open tomorrow — which works better?&rdquo;
        </div>
      </div>
    ),
  },
  {
    label: "It lands on your dashboard",
    icon: LayoutDashboard,
    color: "#f59e0b",
    render: () => (
      <div className="flex w-full max-w-[280px] flex-col gap-2 rounded-xl border border-[#e2e8f0] bg-white p-3 text-left shadow-sm">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-[#475569]">
          <span className="flex items-center gap-1"><LayoutDashboard className="h-3 w-3" /> Bookings</span>
          <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Synced</span>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">Tomorrow, 9:00am — New booking</div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const current = STEPS[step];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">How it works</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">A live call, start to finish</h2>
      </div>

      <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-slate-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
          <span className="ml-2 text-xs font-medium text-[#475569]">Live Call Flow</span>
        </div>

        {/* content */}
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden px-6 py-10">
          <motion.div
            className="pointer-events-none absolute text-[#475569]"
            animate={reducedMotion ? undefined : { x: [-40, 40, -10, 20, -40], y: [10, -10, 20, -6, 10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <MousePointer2 className="h-4 w-4" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {current.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* progress-dot rail — each dot stays visually tiny (the intended
            compact design), but the button itself gets padding so the real
            tappable area meets the 24x24px touch-target minimum without
            resizing or recolouring anything visible. */}
        <div className="flex items-center justify-center gap-1 border-t border-[#e2e8f0] bg-slate-50 py-3">
          {STEPS.map((s, i) => (
            <button key={s.label} onClick={() => setStep(i)} aria-label={s.label} className="rounded-full p-2.5 transition-all duration-300">
              <span
                className="block h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === step ? 20 : 6, background: i === step ? s.color : "#cbd5e1" }}
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-lg text-center text-xs text-[#475569]">{current.label}</p>
    </section>
  );
}
