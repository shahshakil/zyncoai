"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Skeleton } from "@/components/dashboard/ui/skeleton";

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
    <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_30px_-8px_var(--panel-glow)]" style={{ ["--panel-glow" as any]: theme.accent }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Inbound Calls vs AI Bookings</h3>
          <p className="text-xs text-slate-400">Today, by hour · {data?.totals.calls ?? 0} calls · {data?.totals.bookings ?? 0} bookings</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> SYSTEM LIVE
        </span>
      </div>

      {isLoading || !data ? (
        <Skeleton className="h-64 w-full bg-slate-800/60" />
      ) : points.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">No calls yet today</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={points} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="zynco-calls-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.accent} stopOpacity={0.5} />
                <stop offset="95%" stopColor={theme.accent} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="zynco-bookings-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#e2e8f0" }}
              cursor={{ stroke: "#334155", strokeWidth: 1 }}
            />
            <Area type="monotone" dataKey="calls" name="Inbound Calls" stroke={theme.accent} fill="url(#zynco-calls-gradient)" strokeWidth={2} isAnimationActive animationDuration={600} />
            <Area type="monotone" dataKey="bookings" name="AI Bookings" stroke="#10b981" fill="url(#zynco-bookings-gradient)" strokeWidth={2} isAnimationActive animationDuration={600} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
