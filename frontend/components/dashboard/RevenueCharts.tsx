"use client";
// Minimal chart pair for the clinic Financial Dashboard — same visual
// language as components/platform-admin/charts.tsx (gradient fill, soft
// grid, currency tooltip) but a dedicated small file since the tenant
// dashboard doesn't otherwise have a charts wrapper.
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartGradient } from "./ui/ChartGradient";
import { LightTooltip } from "./ui/ChartTooltip";
import { CHART_COLORS, CHART_GRID_STROKE, CHART_AXIS_STYLE } from "./ui/chartTheme";

function money(cents: number): string { return `$${(cents / 100).toFixed(2)}`; }

export function RevenueAreaChart({ data, dataKey = "amountCents", xKey = "month", color = CHART_COLORS.primary, height = 240 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  const gradId = `rev-area-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <ChartGradient id={gradId} color={color} />
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={20} />
        <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
        <Tooltip content={<LightTooltip formatter={money} />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({ data, dataKey = "amountCents", xKey = "date", color = CHART_COLORS.primary, height = 220 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={20} />
        <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
        <Tooltip content={<LightTooltip formatter={money} />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
