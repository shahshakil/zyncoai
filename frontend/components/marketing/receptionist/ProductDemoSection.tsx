"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, ArrowRight, PhoneCall, CalendarPlus, LayoutDashboard } from "lucide-react";

const SCREENS = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    cursor: { top: "30%", left: "60%" },
  },
  {
    key: "calls",
    label: "Call History",
    icon: PhoneCall,
    cursor: { top: "50%", left: "35%" },
  },
  {
    key: "booking",
    label: "Book Appointment",
    icon: CalendarPlus,
    cursor: { top: "65%", left: "55%" },
  },
];

function ScreenOverview() {
  return (
    <div className="grid h-full grid-cols-3 gap-3 p-5">
      {["Appointments", "No-shows", "AI Calls"].map((label, i) => (
        <div key={label} className="rounded-xl border border-[#e2e8f0] bg-slate-50 p-3">
          <p className="text-[10px] text-[#475569]">{label}</p>
          <p className="mt-1 text-lg font-bold text-[#0f172a]">{[42, 3, 118][i]}</p>
        </div>
      ))}
      <div className="col-span-3 mt-1 rounded-xl border border-[#e2e8f0] bg-slate-100 p-3">
        <p className="text-[10px] text-[#475569]">Live AI call feed</p>
        <div className="mt-2 space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-200" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenCalls() {
  return (
    <div className="h-full space-y-2 p-5">
      <p className="text-[10px] uppercase tracking-wide text-[#475569]">Transcript</p>
      {["Caller: Hi, I'd like to book an appointment", "Ella: Sure! What day suits you best?"].map((t, i) => (
        <div key={i} className="rounded-lg border border-[#e2e8f0] bg-slate-50 px-3 py-2 text-xs text-[#475569]">{t}</div>
      ))}
    </div>
  );
}

function ScreenBooking() {
  return (
    <div className="h-full space-y-2.5 p-5">
      <div className="h-8 rounded-lg border border-[#e2e8f0] bg-slate-50" />
      <div className="h-8 rounded-lg border border-[#e2e8f0] bg-slate-50" />
      <div className="h-8 w-1/2 rounded-lg bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]" />
    </div>
  );
}

const SCREEN_BODIES: Record<string, React.ComponentType> = { overview: ScreenOverview, calls: ScreenCalls, booking: ScreenBooking };

export function ProductDemoSection() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SCREENS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const screen = SCREENS[index];
  const Body = SCREEN_BODIES[screen.key];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See the dashboard in action</h2>
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <screen.icon className="h-3.5 w-3.5" /> {screen.label}
          </div>
        </div>

        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div key={screen.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
              <Body />
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="pointer-events-none absolute z-10"
            animate={{ top: screen.cursor.top, left: screen.cursor.left }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <MousePointer2 className="h-5 w-5 fill-[#0f172a] text-[#0f172a] drop-shadow" />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Try it yourself — free for 7 days <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
