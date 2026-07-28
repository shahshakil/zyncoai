"use client";
// Minimal chart pair for the clinic Financial Dashboard — same visual
// language as components/platform-admin/charts.tsx (gradient fill, soft
// grid, currency tooltip) but a dedicated small file since the tenant
// dashboard doesn't otherwise have a charts wrapper.
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const AXIS_STYLE = { fontSize: 11, fill: "#9CA3AF" };
const GRID_STROKE = "#E5E7EB";

function money(cents: number): string { return `$${(cents / 100).toFixed(2)}`; }

function CurrencyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-slate-900">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>{money(p.value)}</p>
      ))}
    </div>
  );
}

export function RevenueAreaChart({ data, dataKey = "amountCents", xKey = "month", color = "#2563eb", height = 240 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  const gradId = `rev-area-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={20} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
        <Tooltip content={<CurrencyTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({ data, dataKey = "amountCents", xKey = "date", color = "#2563eb", height = 220 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={20} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
        <Tooltip content={<CurrencyTooltip />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
