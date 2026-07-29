"use client";
// Owner/Admin-only Analytics dashboard. Every number here comes from
// /api/business/analytics-dashboard/overview, which is 403'd server-side
// for STAFF/DOCTOR (backend/src/api/routes/business/analyticsDashboard.ts).
// Elite light theme, same tokens as the rest of the dashboard — this page
// used to be the last dark-glass holdout; now it's on --bg-card/--border
// like everything else.
import { useState } from "react";
import { toast } from "sonner";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell as PieCell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Phone, CalendarCheck, Percent, DollarSign, Clock, Sparkles, TrendingUp, TrendingDown, Minus, Download, FileSpreadsheet, Mail, MapPin, Users,
} from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { LightTooltip } from "@/components/dashboard/ui/ChartTooltip";
import { CHART_COLORS, CHART_GRID_STROKE, CHART_AXIS_STYLE } from "@/components/dashboard/ui/chartTheme";
import { Sparkline } from "@/components/dashboard/ui/Sparkline";
import { PrintLetterhead, PrintFooter } from "@/components/dashboard/PrintLetterhead";
import { exportToExcel, triggerPrint } from "@/lib/exportUtils";

interface Overview {
  kpis: {
    callsThisMonth: number; callsLastMonth: number; callsChangePct: number | null;
    bookingsThisMonth: number; bookingsLastMonth: number; bookingsChangePct: number | null;
    conversionRateThisMonthPct: number;
    revenueThisMonthCents: number; revenueLastMonthCents: number; revenueChangePct: number | null;
    avgCallDurationMinutesThisMonth: number;
    aiResolutionRatePctThisMonth: number;
  };
  callVolume30d: { date: string; label: string; calls: number; bookings: number }[];
  funnel: { stages: { key: string; label: string; count: number }[]; biggestDropOff: { from: string; to: string; dropPct: number } };
  heatmap: number[][];
  patients: {
    newVsReturning: { new: number; returning: number };
    topSuburbs: { suburb: string; count: number }[];
    noShowRateTrend: { weekStart: string; weekLabel: string; ratePct: number }[];
    recallSuccess: { attempted: number; successful: number; ratePct: number } | null;
  };
  aiPerformance12w: { weekStart: string; weekLabel: string; bookingRatePct: number; avgResponseTimeMs: number | null; escalationRatePct: number; afterHoursPct: number; ghostCallRescueRatePct: number | null }[];
  revenue: {
    monthlyTrend: { month: string; label: string; revenueCents: number }[];
    revenuePerBookingCents: number;
    projectedNextMonthRevenueCents: number;
    roiMultiple: number | null;
    planCostCents: number | null;
    zyncoAiCostIsConfigured: boolean;
    revenueThisMonthCents: number;
  };
}

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
}

function AnalyticsCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--bg-card,#fff)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ease-out hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct == null) return <span className="text-[11px] font-medium text-slate-400">New</span>;
  const Icon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus;
  const cls = pct > 0 ? "bg-emerald-50 text-emerald-600" : pct < 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      <Icon className="h-3 w-3" /> {pct > 0 ? "+" : ""}{pct}% vs last month
    </span>
  );
}

function KpiCard({ label, value, delta, icon: Icon, accent }: { label: string; value: React.ReactNode; delta?: number | null; icon: any; accent: string }) {
  return (
    <AnalyticsCard className="p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-[2rem] font-bold tabular-nums text-slate-900">{value}</p>
          {delta !== undefined && <div className="mt-1"><DeltaBadge pct={delta} /></div>}
        </div>
        <div className="shrink-0 rounded-xl p-2.5" style={{ background: `${accent}1a` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </AnalyticsCard>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900">{children}</h3>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function AnalyticsDashboard() {
  const { business, role } = useDashboard();
  const theme = getVerticalTheme(business.vertical);
  const { data, isLoading } = useApi<{ ok: boolean } & Overview>("/api/business/analytics-dashboard/overview", { refreshInterval: 60000 });
  const { data: schedule, mutate: mutateSchedule } = useApi<{ ok: boolean; schedule: { frequency: string; active: boolean } }>(role === "OWNER" ? "/api/business/report-schedule" : null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  async function toggleWeeklySummary(enabled: boolean) {
    setSavingSchedule(true);
    try {
      await apiPost("/api/business/report-schedule", { frequency: "WEEKLY", active: enabled }, "PUT");
      toast.success(enabled ? "Weekly summary email enabled" : "Weekly summary email disabled");
      mutateSchedule();
    } catch {
      toast.error("Could not update weekly summary setting");
    } finally {
      setSavingSchedule(false);
    }
  }

  function exportExcel() {
    if (!data) return;
    exportToExcel(
      [
        {
          name: "KPIs",
          columns: [{ key: "metric", label: "Metric", width: 28 }, { key: "value", label: "Value", width: 16 }],
          rows: [
            { metric: "Calls this month", value: data.kpis.callsThisMonth },
            { metric: "Bookings this month", value: data.kpis.bookingsThisMonth },
            { metric: "Conversion rate", value: `${data.kpis.conversionRateThisMonthPct}%` },
            { metric: "Revenue generated this month", value: money(data.kpis.revenueThisMonthCents) },
            { metric: "Avg call duration (min)", value: data.kpis.avgCallDurationMinutesThisMonth },
            { metric: "AI resolution rate", value: `${data.kpis.aiResolutionRatePctThisMonth}%` },
          ],
        },
        { name: "Call Volume (30d)", columns: [{ key: "label", label: "Date", width: 12 }, { key: "calls", label: "Calls", width: 10 }, { key: "bookings", label: "Bookings", width: 10 }], rows: data.callVolume30d },
        { name: "Funnel", columns: [{ key: "label", label: "Stage", width: 22 }, { key: "count", label: "Count", width: 10 }], rows: data.funnel.stages },
        { name: "Revenue (12mo)", columns: [{ key: "label", label: "Month", width: 12 }, { key: "revenueCents", label: "Revenue ($)", width: 14, format: (v) => (v / 100).toFixed(2) }], rows: data.revenue.monthlyTrend },
      ],
      { businessName: business.name, reportTitle: "Analytics Report" },
      `Analytics-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + export bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Analytics</h1>
          <p className="text-sm text-slate-400">{business.name} · real-time, from your call &amp; booking data</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => triggerPrint("pdf")} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button onClick={exportExcel} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
          </button>
          {role === "OWNER" && (
            <button
              disabled={savingSchedule}
              onClick={() => toggleWeeklySummary(!schedule?.schedule.active)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                schedule?.schedule.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> {schedule?.schedule.active ? "Weekly email: On" : "Email weekly summary"}
            </button>
          )}
        </div>
      </div>

      {/* A. Performance overview */}
      <div className="no-print grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Calls this month" value={data.kpis.callsThisMonth} delta={data.kpis.callsChangePct} icon={Phone} accent={CHART_COLORS.primary} />
        <KpiCard label="Bookings this month" value={data.kpis.bookingsThisMonth} delta={data.kpis.bookingsChangePct} icon={CalendarCheck} accent={CHART_COLORS.success} />
        <KpiCard label="Conversion rate" value={`${data.kpis.conversionRateThisMonthPct}%`} icon={Percent} accent={CHART_COLORS.info} />
        <KpiCard label="Revenue generated" value={money(data.kpis.revenueThisMonthCents)} delta={data.kpis.revenueChangePct} icon={DollarSign} accent={CHART_COLORS.warning} />
        <KpiCard label="Avg call duration" value={`${data.kpis.avgCallDurationMinutesThisMonth}m`} icon={Clock} accent={CHART_COLORS.secondary} />
        <KpiCard label="AI resolution rate" value={`${data.kpis.aiResolutionRatePctThisMonth}%`} icon={Sparkles} accent={CHART_COLORS.danger} />
      </div>

      {/* B. Call volume line chart */}
      <AnalyticsCard className="no-print">
        <SectionTitle subtitle="Daily calls vs. AI bookings, last 30 days">Call Volume</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.callVolume30d} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <Tooltip content={<LightTooltip />} />
            <Line type="monotone" dataKey="calls" name="Calls" stroke={theme.accent} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="bookings" name="Bookings" stroke={CHART_COLORS.success} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: theme.accent }} /> Calls</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Bookings</span>
        </div>
      </AnalyticsCard>

      {/* C. Conversion funnel */}
      <AnalyticsCard className="no-print">
        <SectionTitle subtitle="Last 30 days — where callers drop off before booking">Booking Conversion Funnel</SectionTitle>
        <div className="space-y-2.5">
          {data.funnel.stages.map((s, i) => {
            const pctOfTotal = data.funnel.stages[0].count ? Math.round((s.count / data.funnel.stages[0].count) * 100) : 0;
            const isDropOff = i > 0 && data.funnel.stages[i - 1].label === data.funnel.biggestDropOff.from && s.label === data.funnel.biggestDropOff.to;
            return (
              <div key={s.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={isDropOff ? "font-semibold text-rose-600" : "text-slate-600"}>{s.label}{isDropOff && " — biggest drop-off"}</span>
                  <span className="text-slate-400">{s.count} · {pctOfTotal}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${isDropOff ? "bg-rose-500" : ""}`}
                    style={{ width: `${Math.max(pctOfTotal, 2)}%`, background: isDropOff ? undefined : theme.accent }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AnalyticsCard>

      {/* D. Hourly heatmap */}
      <AnalyticsCard className="no-print overflow-x-auto">
        <SectionTitle subtitle="Call volume by day &amp; hour, last 30 days — darker means busier">Busiest Times</SectionTitle>
        <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: "36px repeat(24, minmax(11px,1fr))" }}>
          <div />
          {Array.from({ length: 24 }).map((_, h) => <div key={h} className="text-center text-[8px] text-slate-500">{h % 3 === 0 ? h : ""}</div>)}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => {
            const row = data.heatmap[di];
            const maxHeat = Math.max(1, ...data.heatmap.flat());
            return (
              <HeatmapRow key={day} day={day} row={row} maxHeat={maxHeat} accent={theme.accent} />
            );
          })}
        </div>
      </AnalyticsCard>

      {/* E. Patient analytics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalyticsCard className="no-print">
          <SectionTitle subtitle="Last 30 days">New vs. Returning Patients</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[{ name: "New", value: data.patients.newVsReturning.new }, { name: "Returning", value: data.patients.newVsReturning.returning }]} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                <PieCell fill={theme.accent} />
                <PieCell fill={CHART_COLORS.success} />
              </Pie>
              <Tooltip content={<LightTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: theme.accent }} /> New {data.patients.newVsReturning.new}</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Returning {data.patients.newVsReturning.returning}</span>
          </div>
        </AnalyticsCard>

        <AnalyticsCard className="no-print">
          <SectionTitle subtitle="Parsed from contact addresses">Top Suburbs</SectionTitle>
          {data.patients.topSuburbs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <MapPin className="h-5 w-5 text-slate-600" />
              <p className="text-sm text-slate-500">No suburb data yet</p>
              <p className="max-w-xs text-xs text-slate-600">Add addresses when creating contacts to see caller locations here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.patients.topSuburbs.map((s) => {
                const max = data.patients.topSuburbs[0].count;
                return (
                  <div key={s.suburb}>
                    <div className="mb-1 flex justify-between text-xs text-slate-600"><span>{s.suburb}</span><span className="text-slate-400">{s.count}</span></div>
                    <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${(s.count / max) * 100}%`, background: theme.accent }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </AnalyticsCard>

        <AnalyticsCard className="no-print">
          <SectionTitle subtitle="Weekly, last 12 weeks">No-show Rate Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data.patients.noShowRateTrend}>
              <XAxis dataKey="weekLabel" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} interval={2} />
              <Tooltip content={<LightTooltip formatter={(v) => `${v}%`} />} />
              <Line type="monotone" dataKey="ratePct" name="No-show rate" stroke={CHART_COLORS.danger} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard className="no-print">
          <SectionTitle subtitle="Contacts called who booked again within 14 days">Recall Success Rate</SectionTitle>
          {!data.patients.recallSuccess ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Users className="h-5 w-5 text-slate-600" />
              <p className="text-sm text-slate-500">Not enough outbound call data yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6 py-4">
              <p className="text-4xl font-bold tabular-nums text-slate-900">{data.patients.recallSuccess.ratePct}%</p>
              <p className="text-xs text-slate-400">{data.patients.recallSuccess.successful} of {data.patients.recallSuccess.attempted} contacts called back rebooked within 14 days</p>
            </div>
          )}
        </AnalyticsCard>
      </div>

      {/* F. AI performance scorecard */}
      <AnalyticsCard className="no-print">
        <SectionTitle subtitle="Last 12 weeks">AI Performance Scorecard</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ScorecardTile label="Booking Rate" unit="%" data={data.aiPerformance12w.map((w) => w.bookingRatePct)} color={CHART_COLORS.success} />
          <ScorecardTile label="Avg Response Time" unit="ms" data={data.aiPerformance12w.map((w) => w.avgResponseTimeMs).filter((v): v is number => v != null)} color={theme.accent} />
          <ScorecardTile label="Escalation Rate" unit="%" data={data.aiPerformance12w.map((w) => w.escalationRatePct)} color={CHART_COLORS.danger} />
          <ScorecardTile label="After-Hours Calls" unit="%" data={data.aiPerformance12w.map((w) => w.afterHoursPct)} color={CHART_COLORS.secondary} />
          <ScorecardTile label="Ghost Call Rescue" unit="%" data={data.aiPerformance12w.map((w) => w.ghostCallRescueRatePct).filter((v): v is number => v != null)} color={CHART_COLORS.info} />
        </div>
      </AnalyticsCard>

      {/* G. Revenue analytics */}
      <AnalyticsCard className="no-print">
        <SectionTitle subtitle="AI-generated booking value, last 12 months">Revenue Analytics</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.revenue.monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} />
            <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `$${Math.round(v / 100)}`} />
            <Tooltip content={<LightTooltip formatter={(v) => money(v)} />} />
            <Bar dataKey="revenueCents" name="Revenue" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Revenue / Booking</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{money(data.revenue.revenuePerBookingCents)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Projected Next Month</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{money(data.revenue.projectedNextMonthRevenueCents)}</p>
            <p className="text-[10px] text-slate-500">Based on this month&apos;s pace</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">ROI Multiple</p>
            {data.revenue.roiMultiple != null ? (
              <p className="mt-1 text-xl font-semibold text-emerald-600">{data.revenue.roiMultiple}×</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">No plan price configured</p>
            )}
          </div>
        </div>
      </AnalyticsCard>

      {/* Print-only summary */}
      <div className="print-only">
        <PrintLetterhead reportTitle="Analytics Report" dateRangeLabel={new Date().toLocaleDateString("en-AU")} />
        <table className="print-table">
          <thead><tr><th>Metric</th><th>This month</th><th>Last month</th></tr></thead>
          <tbody>
            <tr><td>Calls</td><td>{data.kpis.callsThisMonth}</td><td>{data.kpis.callsLastMonth}</td></tr>
            <tr><td>Bookings</td><td>{data.kpis.bookingsThisMonth}</td><td>{data.kpis.bookingsLastMonth}</td></tr>
            <tr><td>Conversion rate</td><td colSpan={2}>{data.kpis.conversionRateThisMonthPct}%</td></tr>
            <tr><td>Revenue generated</td><td>{money(data.kpis.revenueThisMonthCents)}</td><td>{money(data.kpis.revenueLastMonthCents)}</td></tr>
            <tr><td>Avg call duration</td><td colSpan={2}>{data.kpis.avgCallDurationMinutesThisMonth}m</td></tr>
            <tr><td>AI resolution rate</td><td colSpan={2}>{data.kpis.aiResolutionRatePctThisMonth}%</td></tr>
          </tbody>
        </table>
        <PrintFooter />
      </div>
    </div>
  );
}

function HeatmapRow({ day, row, maxHeat, accent }: { day: string; row: number[]; maxHeat: number; accent: string }) {
  return (
    <>
      <div className="pr-1 text-[10px] text-slate-500">{day}</div>
      {row.map((count, h) => {
        const intensity = count / maxHeat;
        const rgb = hexToRgb(accent);
        return (
          <div
            key={h}
            title={`${day} ${h}:00 — ${count} calls`}
            className="aspect-square rounded-[2px]"
            style={{ background: count === 0 ? "#f1f5f9" : `rgba(${rgb}, ${0.15 + intensity * 0.8})` }}
          />
        );
      })}
    </>
  );
}

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m || m.length < 3) return "99, 102, 241";
  return m.slice(0, 3).map((h) => parseInt(h, 16)).join(", ");
}

function ScorecardTile({ label, unit, data, color }: { label: string; unit: string; data: number[]; color: string }) {
  const latest = data.length ? data[data.length - 1] : null;
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{latest != null ? `${Math.round(latest).toLocaleString()}${unit}` : "—"}</p>
      {data.length >= 2 && <div className="mt-2"><Sparkline data={data} color={color} height={28} /></div>}
    </div>
  );
}
