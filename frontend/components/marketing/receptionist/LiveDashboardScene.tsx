"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CalendarClock, PhoneCall, UserX, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/dashboard/ui/card";
import { CountUp } from "@/components/dashboard/ui/CountUp";
import { BookingCard } from "./DemoPlayer";

// A scripted ~12s loop of "a real morning at a clinic," built from the same
// Card + CountUp + BookingCard pieces the real dashboard (OverviewDashboard)
// and the demo section (DemoPlayer) use, so this reads as one product, not
// a redrawn lookalike. The narrative (row contents, counter deltas, booking
// beat) is fixed/scripted, not random — every number here is a deliberate,
// modest, plausible sample stayed in sync with the events shown, per the
// section's own "Simulated preview" label.

type FeedKind = "ongoing" | "booked" | "faq";
type FeedRow = { id: string; kind: FeedKind; title: string; summary: string; durationLabel: string; statusLabel: string; timeAgo: string };

// Per-vertical sample-data LABELS only — the scene's structure, timing, and
// "Simulated preview" disclosure never change. Optional so the homepage's
// existing <LiveDashboardScene /> (no vertical context) keeps its original
// generic wording exactly as-is. Sourced from Industry.dashboardPreview in
// ./data, passed down from SolutionTemplate — this component stays
// decoupled from data.ts itself, per "one shared component reading
// per-vertical label data."
export interface DashboardPreviewLabels {
  stat1Label: string;
  stat2Label: string;
  recordNoun: string;
}
const DEFAULT_LABELS: DashboardPreviewLabels = { stat1Label: "Today's Appointments", stat2Label: "AI Calls Today", recordNoun: "appointment" };

// Mirrors OverviewDashboard.tsx's CALL_BORDER/CALL_BADGE color-by-meaning
// convention: emerald = booked (positive outcome), cyan = informational,
// indigo = live/in-progress so it never reads as "already booked."
const FEED_STYLE: Record<FeedKind, { border: string; dot: string; badge: string }> = {
  ongoing: { border: "border-l-indigo-500", dot: "bg-indigo-400", badge: "bg-indigo-500/15 text-indigo-300" },
  booked: { border: "border-l-emerald-500", dot: "bg-emerald-400", badge: "bg-emerald-500/15 text-emerald-300" },
  faq: { border: "border-l-cyan-400", dot: "bg-cyan-400", badge: "bg-cyan-500/15 text-cyan-300" },
};

function buildRows(recordNoun: string) {
  const rowA: FeedRow = { id: "a", kind: "booked", title: "Incoming call", summary: `Booked ${recordNoun} — Tuesday 2:00pm`, durationLabel: "3m 12s", statusLabel: "Booked", timeAgo: "12m ago" };
  const rowBRinging: FeedRow = { id: "b", kind: "ongoing", title: "Incoming call", summary: "Ringing…", durationLabel: "0:03", statusLabel: "Live", timeAgo: "just now" };
  const rowBBooked: FeedRow = { id: "b", kind: "booked", title: "Incoming call", summary: `Booked ${recordNoun} — Thursday 9:00am`, durationLabel: "2m 04s", statusLabel: "Booked", timeAgo: "just now" };
  const rowC: FeedRow = { id: "c", kind: "faq", title: "After-hours call", summary: "Message taken for the on-call team", durationLabel: "1m 48s", statusLabel: "Message taken", timeAgo: "just now" };
  return { rowA, rowBRinging, rowBBooked, rowC };
}

const BASELINE = { appointments: 41, aiCalls: 116 };
const FINAL = { appointments: 42, aiCalls: 118 };

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

function FeedRowCard({ row, animated }: { row: FeedRow; animated: boolean }) {
  const style = FEED_STYLE[row.kind];
  const body = (
    <div className={`rounded-xl border-l-4 bg-[#1e293b] p-3 ${style.border}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[#e2e8f0]">
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot} ${row.kind === "ongoing" && animated ? "animate-pulse" : ""}`} />
          {row.title}
        </div>
        <span className="shrink-0 text-[11px] text-[#64748b]">{row.timeAgo}</span>
      </div>
      <p className="mt-1 truncate text-xs text-[#94a3b8]">{row.summary}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-[#64748b]">{row.durationLabel}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${style.badge}`}>{row.statusLabel}</span>
      </div>
    </div>
  );
  if (!animated) return body;
  return (
    <motion.div layout key={row.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      {body}
    </motion.div>
  );
}

export function LiveDashboardScene({ onFirstPassComplete, labels = DEFAULT_LABELS }: { onFirstPassComplete?: () => void; labels?: DashboardPreviewLabels }) {
  const reducedMotion = usePrefersReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { once: true, amount: 0.4 });
  const startedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { rowA, rowBRinging, rowBBooked, rowC } = useMemo(() => buildRows(labels.recordNoun), [labels.recordNoun]);
  const finalRows = useMemo(() => [rowC, rowBBooked, rowA], [rowA, rowBBooked, rowC]);
  const bookingCardLabel = `Tomorrow, 9:00am — New ${labels.recordNoun}`;

  const [rows, setRows] = useState<FeedRow[]>([rowA]);
  const [appointments, setAppointments] = useState(BASELINE.appointments);
  const [aiCalls, setAiCalls] = useState(BASELINE.aiCalls);
  const [bookingShown, setBookingShown] = useState(false);
  const [bookingGlow, setBookingGlow] = useState(false);

  // usePrefersReducedMotion() can only report the real value after mount (a
  // media-query check can't run during the initial render/SSR), so it's
  // never safe to bake it into the useState() initializers above — those
  // only run once and would permanently miss a true reduced-motion user.
  // This effect corrects to the complete final frame as soon as the real
  // value is known, and also stops a loop already mid-flight if the OS
  // setting changes while the scene is animating.
  useEffect(() => {
    if (!reducedMotion) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRows(finalRows);
    setAppointments(FINAL.appointments);
    setAiCalls(FINAL.aiCalls);
    setBookingShown(true);
    setBookingGlow(false);
    onFirstPassComplete?.();
  }, [reducedMotion, onFirstPassComplete, finalRows]);

  useEffect(() => {
    if (reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;

    function schedule(delay: number, fn: () => void) {
      timers.current.push(setTimeout(fn, delay));
    }

    function runLoop() {
      // t=0 — settle back to the resting frame (one existing row; never an
      // empty/skeleton feed).
      setRows([rowA]);
      setAppointments(BASELINE.appointments);
      setAiCalls(BASELINE.aiCalls);
      setBookingShown(false);
      setBookingGlow(false);

      schedule(1400, () => setRows((prev) => [rowBRinging, ...prev]));
      schedule(3200, () => {
        setRows((prev) => prev.map((r) => (r.id === "b" ? rowBBooked : r)));
        setAppointments(42);
        setAiCalls(117);
      });
      schedule(3600, () => setBookingShown(true));
      schedule(3650, () => setBookingGlow(true));
      schedule(4850, () => setBookingGlow(false));
      schedule(7000, () => {
        setRows((prev) => [rowC, ...prev]);
        setAiCalls(118);
      });
      schedule(9500, () => onFirstPassComplete?.());
      schedule(11500, () => {
        // soft reset — rows/booking card exit-animate away, counters glide
        // back down, then the loop restarts. No wipe: everything fades.
      });
      schedule(12800, runLoop);
    }

    runLoop();
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reducedMotion, inView, onFirstPassComplete, rowA, rowBRinging, rowBBooked, rowC]);

  return (
    <div ref={sceneRef} className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#475569]">
          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard Overview
        </div>
      </div>

      {/* 2026-08-15 — grid-cols-1 min-w-0 on both children added: this
          component is now also embedded on /solutions/[slug] pages at
          mobile widths (previously only ever rendered on the homepage,
          apparently untested below the sm: breakpoint). A CSS grid item's
          default min-width is auto (its content's max-content size), not
          0 — below sm: this stayed a single implicit column, but each
          item still refused to shrink narrower than its own content
          (e.g. the feed panel's un-wrapped call-summary lines), pushing
          the whole scene wider than the viewport and clipping at the
          outer overflow-hidden. min-w-0 lets each grid item actually
          shrink to the column width instead of overflowing it. */}
      <div className="grid min-w-0 grid-cols-1 gap-4 p-5 sm:grid-cols-[1.1fr_1.4fr]">
        <div className="min-w-0 space-y-3">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{labels.stat1Label}</p>
                <p className="mt-1.5 text-[1.65rem] font-bold tabular-nums text-slate-900"><CountUp value={appointments} /></p>
              </div>
              <div className="shrink-0 rounded-xl bg-indigo-50 p-2"><CalendarClock className="h-4 w-4 text-indigo-600" /></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{labels.stat2Label}</p>
                <p className="mt-1.5 text-[1.65rem] font-bold tabular-nums text-slate-900"><CountUp value={aiCalls} /></p>
              </div>
              <div className="shrink-0 rounded-xl bg-emerald-50 p-2"><PhoneCall className="h-4 w-4 text-emerald-600" /></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">No-shows Today</p>
                <p className="mt-1.5 text-[1.65rem] font-bold tabular-nums text-slate-900">0</p>
              </div>
              <div className="shrink-0 rounded-xl bg-rose-50 p-2"><UserX className="h-4 w-4 text-rose-600" /></div>
            </div>
          </Card>

          {!reducedMotion ? (
            <motion.div
              initial={false}
              animate={bookingShown ? { opacity: 1, y: 0, height: "auto", marginTop: 12 } : { opacity: 0, y: 10, height: 0, marginTop: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="overflow-hidden"
            >
              <div className={`rounded-xl transition-shadow duration-500 ${bookingGlow ? "shadow-[0_0_0_3px_rgba(16,185,129,0.35),0_8px_24px_rgba(16,185,129,0.25)]" : ""}`}>
                <BookingCard label={bookingCardLabel} />
              </div>
            </motion.div>
          ) : (
            bookingShown && (
              <div className="mt-3">
                <BookingCard label={bookingCardLabel} />
              </div>
            )
          )}
        </div>

        <div className="min-w-0 rounded-2xl bg-[#0f172a] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Live AI call feed</h3>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${!reducedMotion ? "animate-pulse" : ""}`} /> LIVE
            </span>
          </div>
          <div className="min-h-[248px] space-y-2">
            {!reducedMotion ? (
              <AnimatePresence initial={false}>
                {rows.map((row) => <FeedRowCard key={row.id} row={row} animated />)}
              </AnimatePresence>
            ) : (
              rows.map((row) => <FeedRowCard key={row.id} row={row} animated={false} />)
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-[#e2e8f0] px-5 py-2">
        <span className="text-[11px] italic text-slate-400">Simulated preview — sample data</span>
      </div>
    </div>
  );
}
