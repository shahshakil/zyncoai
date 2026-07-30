"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  CalendarClock, UserX, PieChart as PieChartIcon, PhoneCall, Phone, PhoneMissed, Clock, CalendarPlus, Search, FileText, PhoneOutgoing, Sparkles, CalendarX2, CheckCircle2,
} from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Skeleton, SkeletonStatTile } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";
import { CountUp } from "@/components/dashboard/ui/CountUp";
import { LightTooltip } from "@/components/dashboard/ui/ChartTooltip";
import { CHART_COLORS } from "@/components/dashboard/ui/chartTheme";

const ChartSkeleton = () => <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;
const SectionSkeleton = () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" />;
const HudSkeleton = () => <div className="h-32 animate-pulse rounded-xl bg-slate-100" />;

const BarChart = dynamic(() => import("recharts").then((m) => ({ default: m.BarChart })), { loading: ChartSkeleton, ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => ({ default: m.Bar })), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => ({ default: m.Cell })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => ({ default: m.XAxis })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })), { ssr: false });
const Sparkline = dynamic(() => import("@/components/dashboard/ui/Sparkline").then((m) => ({ default: m.Sparkline })), { ssr: false });
const LiveAgentHud = dynamic(() => import("@/components/dashboard/LiveAgentHud").then((m) => ({ default: m.LiveAgentHud })), { loading: HudSkeleton, ssr: false });
const DynamicAnalyticsPanel = dynamic(() => import("@/components/dashboard/DynamicAnalyticsPanel").then((m) => ({ default: m.DynamicAnalyticsPanel })), { loading: SectionSkeleton, ssr: false });
const VerticalPanelsSection = dynamic(() => import("@/components/dashboard/vertical/VerticalPanelsSection"), { loading: SectionSkeleton, ssr: false });
const AiMetricsSection = dynamic(() => import("@/components/dashboard/ai-metrics/AiMetricsSection"), { loading: SectionSkeleton, ssr: false });
const SentimentHeatmapSection = dynamic(() => import("@/components/dashboard/sentiment/SentimentHeatmapSection"), { loading: SectionSkeleton, ssr: false });
const SystemHealthSection = dynamic(() => import("@/components/dashboard/system-health/SystemHealthSection"), { loading: SectionSkeleton, ssr: false });

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#dc2626", "#059669", "#db2777"];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
}

interface OverviewPayload {
  role: "OWNER" | "ADMIN" | "STAFF" | "DOCTOR";
  isDoctor: boolean;
  selfProviderId: string | null;
  business: { phoneNumber: string; vertical: string };
  topStats: {
    appointments: { count: number; done: number; active: number; wait: number };
    noShow: { today: number; thisWeek: number };
    utilization: { booked: number; capacity: number; pctFilled: number };
    aiCalls: { today: number; changePctVsYesterday: number };
    revenueSaved: { cents: number; bookings: number };
  };
  performance: {
    completionRatePct: number;
    onTrack: boolean;
    avgCallDurationMinutes: number | null;
    peakHourLabel: string | null;
    seenToday: { seen: number; total: number };
    nextPatient: { contactName: string; service: string; timeLabel: string; startAt: string } | null;
  };
  patientList: { id: string; contactName: string; service: string; durationMinutes: number; timeLabel: string; startAt: string; status: string; rawStatus: string; pipelineStep: number; providerName: string | null }[];
  liveCallFeed: {
    stats: {
      callsToday: number; minutesUsed: number; bookingsMade: number; bookingRatePct: number;
      aiResolutionRatePct: number; escalationRatePct: number; avgAnswerTimeLabel: string; afterHoursCalls: number;
    };
    calls: {
      id: string; fromNumber: string; contactName: string | null; summary: string; durationLabel: string;
      border: "ongoing" | "booked" | "faq" | "other"; statusLabel: string; sentiment: "positive" | "neutral" | "negative"; timeAgo: string;
    }[];
  };
  doctorStatus: { id: string; name: string; title: string | null; status: "AVAILABLE" | "BUSY" | "AWAY"; seenToday: number; totalToday: number; isSelf: boolean }[];
  weeklyTrend: { day: string; dateISO: string; count: number; isToday: boolean; isWeekend: boolean }[];
  recalls: { total: number; patients: { contactId: string; name: string; hasPhone: boolean; lastVisitLabel: string; monthsOverdue: number }[] };
}

const STATUS_BADGE: Record<string, string> = {
  Done: "bg-[#f0fdf4] text-[#16a34a]",
  Active: "bg-[#eff6ff] text-[#2563eb]",
  Waiting: "bg-[#fffbeb] text-[#d97706]",
  Cancelled: "bg-[#fef2f2] text-[#dc2626]",
  "No-show": "bg-[#fef2f2] text-[#dc2626]",
};

// Color-by-meaning, matching the shared tag-pill convention: positive
// outcome (booked) = emerald, informational (faq) = cyan, neutral = slate,
// live-in-progress gets its own indigo lane so it never reads as "already
// booked."
const CALL_BORDER: Record<string, string> = {
  ongoing: "border-l-indigo-500",
  booked: "border-l-emerald-500",
  faq: "border-l-cyan-400",
  other: "border-l-slate-600",
};
const CALL_BADGE: Record<string, string> = {
  ongoing: "bg-indigo-500/15 text-indigo-300",
  booked: "bg-emerald-500/15 text-emerald-300",
  faq: "bg-cyan-500/15 text-cyan-300",
  other: "bg-slate-500/15 text-slate-300",
};

const SENTIMENT_EMOJI: Record<string, string> = { positive: "😊", neutral: "😐", negative: "😟" };
const PIPELINE_STEP_LABELS = ["Booked", "Arrived", "In Consultation", "Checked Out"];
const PIPELINE_STEP_STATUS = ["CONFIRMED", "ARRIVED", "IN_CONSULTATION", "COMPLETED"];

const SLOT_FILTERS: { label: string; value: "all" | 15 | 30 | 45 | 60 }[] = [
  { label: "All", value: "all" },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

export default function OverviewDashboard() {
  const { business, role, canSeeFinancials } = useDashboard();
  const { data: resp, isLoading, mutate } = useApi<OverviewPayload & { ok: boolean }>("/api/business/dashboard/overview", { refreshInterval: 20000 });
  const [slotFilter, setSlotFilter] = useState<"all" | 15 | 30 | 45 | 60>("all");
  const [callingIds, setCallingIds] = useState<Set<string>>(new Set());
  const [advancingIds, setAdvancingIds] = useState<Set<string>>(new Set());

  const filteredPatients = useMemo(() => {
    if (!resp) return [];
    if (slotFilter === "all") return resp.patientList;
    return resp.patientList.filter((p) => p.durationMinutes === slotFilter);
  }, [resp, slotFilter]);

  async function callNow(contactId: string) {
    setCallingIds((s) => new Set(s).add(contactId));
    try {
      await apiPost(`/api/business/dashboard/recalls/${contactId}/call`);
      toast.success("Call placed — AI is dialling the patient now");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "voice_engine_not_configured" || e?.message === "twilio_not_configured" ? "Voice calling isn't configured yet" : "Could not place the call");
    } finally {
      setCallingIds((s) => { const n = new Set(s); n.delete(contactId); return n; });
    }
  }

  async function advanceStatus(appointmentId: string, step: number) {
    setAdvancingIds((s) => new Set(s).add(appointmentId));
    try {
      await apiPost(`/api/business/appointments/${appointmentId}`, { status: PIPELINE_STEP_STATUS[step] }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update patient status");
    } finally {
      setAdvancingIds((s) => { const n = new Set(s); n.delete(appointmentId); return n; });
    }
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Overview</h1>
          <p className="text-sm text-[#94a3b8]">{business.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/bookings">
            <Button size="sm" className="bg-gradient-to-r from-[#4f87f0] to-[#2563eb] text-white hover:opacity-90">
              <CalendarPlus className="h-4 w-4" /> Book Appointment
            </Button>
          </Link>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm"><Search className="h-4 w-4" /> Find Appointment</Button>
          </Link>
          {canSeeFinancials && (
            <Link href="/dashboard/finance">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90">
                <FileText className="h-4 w-4" /> Create Invoice
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ---------------- TOP STATS ROW ---------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isLoading || !resp ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonStatTile key={i} />)
        ) : (
          <>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Today&apos;s Appointments</p>
                  <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900"><CountUp value={resp.topStats.appointments.count} /></p>
                  <p className="mt-1 text-[11px] text-slate-400">{resp.topStats.appointments.done} done · {resp.topStats.appointments.active} active · {resp.topStats.appointments.wait} wait</p>
                </div>
                <div className="shrink-0 rounded-xl bg-indigo-50 p-2.5"><CalendarClock className="h-5 w-5 text-indigo-600" /></div>
              </div>
              {resp.weeklyTrend.some((d) => d.count > 0) && (
                <div className="mt-3">
                  <Sparkline data={resp.weeklyTrend.map((d) => d.count)} color={CHART_COLORS.primary} />
                </div>
              )}
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">No-shows Today</p>
                  <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900">{resp.topStats.noShow.today}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{resp.topStats.noShow.thisWeek} this week</p>
                </div>
                <div className="shrink-0 rounded-xl bg-rose-50 p-2.5"><UserX className="h-5 w-5 text-rose-600" /></div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Utilization</p>
                  <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900">{resp.topStats.utilization.booked}/{resp.topStats.utilization.capacity}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{resp.topStats.utilization.pctFilled}% slots filled</p>
                </div>
                <div className="shrink-0 rounded-xl bg-amber-50 p-2.5"><PieChartIcon className="h-5 w-5 text-amber-600" /></div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">AI Calls Today</p>
                  <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900"><CountUp value={resp.topStats.aiCalls.today} /></p>
                  <p className="mt-1 text-[11px] text-slate-400">{resp.topStats.aiCalls.changePctVsYesterday >= 0 ? "+" : ""}{resp.topStats.aiCalls.changePctVsYesterday}% vs yesterday</p>
                </div>
                <div className="shrink-0 rounded-xl bg-emerald-50 p-2.5"><PhoneCall className="h-5 w-5 text-emerald-600" /></div>
              </div>
            </Card>
            {canSeeFinancials && (
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Revenue Saved Today</p>
                    <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900">
                      AUD $<CountUp value={Math.round(resp.topStats.revenueSaved.cents / 100)} />
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{resp.topStats.revenueSaved.bookings} AI bookings × $150</p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-violet-50 p-2.5"><Sparkles className="h-5 w-5 text-violet-600" /></div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* ---------------- LIVE ANALYTICS PANEL (Phase 2) ---------------- */}
      <DynamicAnalyticsPanel />

      {/* ---------------- MID ROW: 1fr 1fr 1.4fr ---------------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.4fr]">
        {/* Col 1: Today's performance + next patient */}
        <Card>
          <CardHeader><CardTitle>Today&apos;s Performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading || !resp ? <Skeleton className="h-64 w-full" /> : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `conic-gradient(#2563eb ${resp.performance.completionRatePct * 3.6}deg, #e2e8f0 0deg)` }}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#0f172a]">{resp.performance.completionRatePct}%</div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#94a3b8]">Completion</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-[#94a3b8]" />
                    <p className="text-sm font-semibold text-[#0f172a]">{resp.performance.avgCallDurationMinutes != null ? `${resp.performance.avgCallDurationMinutes}m` : "—"}</p>
                    <p className="text-[11px] text-[#94a3b8]">Avg call duration</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${resp.performance.onTrack ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#fffbeb] text-[#d97706]"}`}>
                      {resp.performance.onTrack ? "On track" : "Behind"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[#e2e8f0] pt-3 text-center">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{resp.performance.peakHourLabel || "—"}</p>
                    <p className="text-[11px] text-[#94a3b8]">Peak Hour</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{resp.performance.seenToday.seen}/{resp.performance.seenToday.total}</p>
                    <p className="text-[11px] text-[#94a3b8]">Seen Today</p>
                  </div>
                </div>

                <div className="border-t border-[#e2e8f0] pt-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Next Patient</p>
                  {resp.performance.nextPatient ? (
                    <div className="flex items-start gap-2 rounded-xl bg-[#f0fdf4] p-3">
                      <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#065f46]">{resp.performance.nextPatient.contactName}</p>
                        <p className="truncate text-xs text-[#047857]">{resp.performance.nextPatient.service}</p>
                        <p className="text-xs font-medium text-[#10b981]">{resp.performance.nextPatient.timeLabel}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#94a3b8]">No upcoming appointment today.</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Col 2: Today's patient list */}
        <Card>
          <CardHeader><CardTitle>Today&apos;s Patients</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {SLOT_FILTERS.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setSlotFilter(f.value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    slotFilter === f.value ? "bg-gradient-to-r from-[#4f87f0] to-[#2563eb] text-white" : "bg-slate-100 text-[#374151] hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {isLoading || !resp ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : filteredPatients.length === 0 ? (
              <EmptyState icon={CalendarX2} title="No patients in this slot" description="Nothing scheduled today for that duration." />
            ) : (
              <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-2.5 ${p.status === "Active" ? "border-[#2563eb] bg-[#eff6ff]" : "border-transparent"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: avatarColor(p.contactName) }}>
                          {initials(p.contactName)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#0f172a]">{p.contactName}</p>
                          <p className="truncate text-xs text-[#94a3b8]">{p.service} · {p.durationMinutes}m</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-[#374151]">{p.timeLabel}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[p.status] || "bg-slate-100 text-slate-500"}`}>{p.status}</span>
                      </div>
                    </div>
                    {p.pipelineStep < 3 && !["Cancelled", "No-show"].includes(p.status) && (
                      <div className="mt-2 flex items-center gap-1 pl-11">
                        {PIPELINE_STEP_LABELS.map((label, i) => (
                          <button
                            key={label}
                            title={`Mark as ${label}`}
                            disabled={advancingIds.has(p.id) || i < p.pipelineStep}
                            onClick={() => advanceStatus(p.id, i)}
                            className={`h-1.5 flex-1 rounded-full transition ${
                              i <= p.pipelineStep ? "bg-[#2563eb]" : "bg-slate-200 hover:bg-slate-300"
                            } ${i === p.pipelineStep + 1 ? "cursor-pointer" : i <= p.pipelineStep ? "cursor-default" : "cursor-not-allowed opacity-60"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Col 3: Live AI call feed (dark) */}
        <div className="rounded-2xl bg-[#0f172a] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Live AI call feed</h3>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE
            </span>
          </div>

          {isLoading || !resp ? (
            <div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#1e293b]" />)}</div>
          ) : (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Calls Today</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">{resp.liveCallFeed.stats.callsToday}</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Minutes Used</p>
                <p className="mt-1 text-xl font-semibold text-blue-400">{resp.liveCallFeed.stats.minutesUsed}</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Bookings Made</p>
                <p className="mt-1 text-xl font-semibold text-amber-400">{resp.liveCallFeed.stats.bookingsMade}</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Booking Rate</p>
                <p className="mt-1 text-xl font-semibold text-violet-400">{resp.liveCallFeed.stats.bookingRatePct}%</p>
              </div>
            </div>
          )}

          {!isLoading && resp && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">AI Resolution Rate</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">{resp.liveCallFeed.stats.aiResolutionRatePct}%</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Human Escalation</p>
                <p className="mt-1 text-xl font-semibold text-amber-400">{resp.liveCallFeed.stats.escalationRatePct}%</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">Avg Answer Time</p>
                <p className="mt-1 text-xl font-semibold text-blue-400">{resp.liveCallFeed.stats.avgAnswerTimeLabel}</p>
              </div>
              <div className="rounded-xl bg-[#1e293b] p-3">
                <p className="text-[11px] text-[#94a3b8]">After Hours Calls</p>
                <p className="mt-1 text-xl font-semibold text-violet-400">{resp.liveCallFeed.stats.afterHoursCalls}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {isLoading || !resp ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-[#1e293b]" />)
            ) : resp.liveCallFeed.calls.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[#1e293b] bg-[#1e293b] p-6 text-center">
                <PhoneMissed className="h-5 w-5 text-slate-500" />
                <p className="text-sm text-[#94a3b8]">No calls yet today — the feed will fill in as calls come in.</p>
              </div>
            ) : (
              resp.liveCallFeed.calls.map((c) => (
                <div key={c.id} className={`rounded-xl border-l-4 bg-[#1e293b] p-3 ${CALL_BORDER[c.border]}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#e2e8f0]">
                      {c.border === "ongoing" ? <Phone className="h-3.5 w-3.5 text-[#10b981]" /> : <PhoneMissed className="h-3.5 w-3.5 text-[#64748b]" />}
                      {c.contactName || c.fromNumber}
                    </div>
                    <span className="shrink-0 text-[11px] text-[#64748b]" title={`Sentiment: ${c.sentiment}`}>{SENTIMENT_EMOJI[c.sentiment]} {c.timeAgo}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#94a3b8]">{c.summary}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-[#64748b]">{c.durationLabel}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CALL_BADGE[c.border]}`}>{c.statusLabel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ---------------- BOTTOM ROW: 3 columns ---------------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Col 1: Doctor status + live AI agent HUD (Phase 3) */}
        <LiveAgentHud doctorStatus={resp?.doctorStatus || []} isLoading={isLoading || !resp} />

        {/* Col 2: Weekly trend */}
        <Card>
          <CardHeader><CardTitle>Weekly Trend</CardTitle></CardHeader>
          <CardContent>
            {isLoading || !resp ? <Skeleton className="h-48 w-full" /> : resp.weeklyTrend.every((d) => d.count === 0) ? (
              <EmptyState icon={CalendarX2} title="No appointments this week" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={resp.weeklyTrend}>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<LightTooltip />} cursor={{ fill: "#F1F5F9" }} />
                    <Bar dataKey="count" name="Appointments" radius={[4, 4, 0, 0]}>
                      {resp.weeklyTrend.map((d) => (
                        <Cell key={d.dateISO} fill={d.isToday ? CHART_COLORS.primary : d.isWeekend ? "#e0e7ff" : "#c7d2fe"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#64748b]">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#c7d2fe]" /> Weekday</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#e0e7ff]" /> Weekend</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Today</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Col 3: Patient recalls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <PhoneOutgoing className="h-4 w-4 text-violet-500" />
              <div>
                <CardTitle>Patient Recalls</CardTitle>
                <p className="mt-0.5 text-xs text-[#94a3b8]">Patients overdue for checkup</p>
              </div>
            </div>
            {!isLoading && resp && resp.recalls.total > 0 && (
              <span className="rounded-full bg-[#fffbeb] px-2 py-0.5 text-xs font-medium text-[#d97706]">{resp.recalls.total}</span>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading || !resp ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : resp.recalls.patients.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No recalls due — great work!" />
            ) : (
              <>
                {resp.recalls.patients.map((r) => (
                  <div key={r.contactId} className="flex items-center justify-between gap-2 rounded-xl border border-[#e2e8f0] p-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: avatarColor(r.name) }}>
                        {initials(r.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#0f172a]">{r.name}</p>
                        <p className="truncate text-xs text-[#94a3b8]">Last visit: {r.lastVisitLabel}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-[#fffbeb] px-2 py-0.5 text-[10px] font-medium text-[#d97706]">{r.monthsOverdue}mo overdue</span>
                      <Button size="sm" variant="outline" disabled={!r.hasPhone || callingIds.has(r.contactId)} onClick={() => callNow(r.contactId)}>
                        {callingIds.has(r.contactId) ? "Calling…" : "Call now"}
                      </Button>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/contacts" className="block pt-1 text-center text-xs font-medium text-[#2563eb] hover:underline">View all</Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- SYSTEM HEALTH PANEL (Phase 8) ---------------- */}
      <SystemHealthSection />

      {/* ---------------- UNIVERSAL AI METRICS (Phase 4) ---------------- */}
      <AiMetricsSection />

      {/* ---------------- SENTIMENT HEATMAP (Phase 6) ---------------- */}
      <SentimentHeatmapSection />

      {/* ---------------- VERTICAL-SPECIFIC PANELS (Phase 3) ---------------- */}
      <VerticalPanelsSection />
    </div>
  );
}
