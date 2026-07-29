"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { ChartGradient } from "@/components/dashboard/ui/ChartGradient";
import { LightTooltip } from "@/components/dashboard/ui/ChartTooltip";
import { CHART_COLORS, CHART_GRID_STROKE, CHART_AXIS_STYLE } from "@/components/dashboard/ui/chartTheme";

interface HourlyPoint {
  hour: number;
  label: string;
  calls: number;
  bookings: number;
  isFuture: boolean;
}

export function DynamicAnalyticsPanel() {
  const { business } = useDashboard();
  const theme = getVerticalTheme(business.vertical);
  const { data, isLoading } = useApi<{ ok: boolean; hourly: HourlyPoint[]; totals: { calls: number; bookings: number } }>(
    "/api/business/analytics/hourly-calls",
    { refreshInterval: 30000 }
  );

  // Trim leading/trailing all-zero future hours so the chart doesn't stretch
  // a flat empty line across the whole day before it's even lunchtime.
  const points = (data?.hourly || []).filter((h) => !h.isFuture || h.calls > 0 || h.bookings > 0);

  return (
    <div className="rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--bg-card,#fff)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ease-out hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Inbound Calls vs AI Bookings</h3>
          <p className="text-xs text-slate-400">Today, by hour · {data?.totals.calls ?? 0} calls · {data?.totals.bookings ?? 0} bookings</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> SYSTEM LIVE
        </span>
      </div>

      {isLoading || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : points.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">No calls yet today</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={points} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <ChartGradient id="zynco-calls-gradient" color={theme.accent} />
              <ChartGradient id="zynco-bookings-gradient" color={CHART_COLORS.success} />
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <Tooltip content={<LightTooltip />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="calls" name="Inbound Calls" stroke={theme.accent} fill="url(#zynco-calls-gradient)" strokeWidth={2} isAnimationActive animationDuration={600} />
            <Area type="monotone" dataKey="bookings" name="AI Bookings" stroke={CHART_COLORS.success} fill="url(#zynco-bookings-gradient)" strokeWidth={2} isAnimationActive animationDuration={600} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
