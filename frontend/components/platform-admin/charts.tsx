"use client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { formatNumber, outcomeLabel, OUTCOME_COLORS } from "./format";

const AXIS_STYLE = { fontSize: 11, fill: "#9CA3AF" };
const GRID_STROKE = "#E5E7EB";

function TooltipCard({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-[#1F2937]">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-semibold">{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function GradientAreaChart({ data, dataKey = "count", xKey = "date", color = "#6366F1", height = 240 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  const gradId = `area-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={24} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<TooltipCard />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GradientBarChart({ data, dataKey = "count", xKey = "date", color = "#3B82F6", height = 240 }: { data: any[]; dataKey?: string; xKey?: string; color?: string; height?: number }) {
  const gradId = `bar-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5)} minTickGap={24} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<TooltipCard />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey={dataKey} fill={`url(#${gradId})`} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBarChart({ data, dataKey, yKey, colors, height = 240 }: { data: any[]; dataKey: string; yKey: string; colors?: string[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey={yKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} width={90} />
        <Tooltip content={<TooltipCard />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors?.[i % (colors.length || 1)] || "#6366F1"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, height = 240 }: { data: { outcome: string; count: number }[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="55%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="outcome" innerRadius="60%" outerRadius="90%" paddingAngle={2}>
            {data.map((d, i) => (
              <Cell key={i} fill={OUTCOME_COLORS[d.outcome] || "#94A3B8"} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<TooltipCard />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2 text-xs">
        {data.map((d) => (
          <li key={d.outcome} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: OUTCOME_COLORS[d.outcome] || "#94A3B8" }} />
              {outcomeLabel(d.outcome)}
            </span>
            <span className="font-semibold text-[#1F2937]">{d.count}{total ? ` (${Math.round((d.count / total) * 100)}%)` : ""}</span>
          </li>
        ))}
        {!data.length && <li className="text-[#9CA3AF]">No calls in this period yet.</li>}
      </ul>
    </div>
  );
}

const COST_COLORS: Record<string, string> = { openai: "#6366F1", twilio: "#3B82F6", server: "#94A3B8", other: "#F59E0B" };

export function CostPieChart({ data, height = 220 }: { data: { key: string; label: string; cents: number }[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.cents, 0);
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="55%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="cents" nameKey="label" innerRadius="55%" outerRadius="90%" paddingAngle={2}>
            {data.map((d, i) => (
              <Cell key={i} fill={COST_COLORS[d.key] || "#94A3B8"} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<TooltipCard />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2 text-xs">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COST_COLORS[d.key] || "#94A3B8" }} />
              {d.label}
            </span>
            <span className="font-semibold text-[#1F2937]">${(d.cents / 100).toFixed(2)}{total ? ` (${Math.round((d.cents / total) * 100)}%)` : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RealtimeLineChart({ data, dataKey, color = "#6366F1", height = 160, unit = "" }: { data: any[]; dataKey: string; color?: string; height?: number; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="t" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit={unit} />
        <Tooltip content={<TooltipCard />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Voice Infrastructure's response-time chart — two named series (LLM/TTS)
// plus a fixed target reference line, points above target colored red via
// a per-dot custom renderer rather than a second overlaid series (Recharts
// doesn't support per-point stroke color any other way without one).
function SpikeDot(target: number, color: string) {
  return function Dot(props: any) {
    const { cx, cy, value } = props;
    if (cx == null || cy == null) return null;
    const over = value > target;
    return <circle cx={cx} cy={cy} r={over ? 3.5 : 2} fill={over ? "#EF4444" : color} stroke={over ? "#EF4444" : color} />;
  };
}

export function ResponseTimeChart({
  data, targetMs = 1000, height = 260,
}: { data: { t: string; llm?: number; tts?: number }[]; targetMs?: number; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="t" tick={AXIS_STYLE} axisLine={false} tickLine={false} minTickGap={32} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="ms" />
        <Tooltip content={<TooltipCard />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <ReferenceLine y={targetMs} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: `target ${targetMs}ms`, fontSize: 10, fill: "#9CA3AF", position: "insideTopRight" }} />
        <Line type="monotone" dataKey="llm" name="LLM" stroke="#6366F1" strokeWidth={2} dot={SpikeDot(targetMs, "#6366F1")} isAnimationActive={false} connectNulls />
        <Line type="monotone" dataKey="tts" name="TTS" stroke="#10B981" strokeWidth={2} dot={SpikeDot(targetMs, "#10B981")} isAnimationActive={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Postgres EXTRACT(DOW) is 0=Sunday..6=Saturday; rendered Monday-first per
// spec ("Y axis: Mon to Sun") without changing the underlying dow values.
const DOW_ROWS: { dow: number; label: string }[] = [
  { dow: 1, label: "Mon" }, { dow: 2, label: "Tue" }, { dow: 3, label: "Wed" }, { dow: 4, label: "Thu" },
  { dow: 5, label: "Fri" }, { dow: 6, label: "Sat" }, { dow: 0, label: "Sun" },
];

export function PeakHoursHeatmap({ data }: { data: { dow: number; hour: number; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const cell = new Map(data.map((d) => [`${d.dow}-${d.hour}`, d.count]));

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid min-w-[640px] gap-1" style={{ gridTemplateColumns: "40px repeat(24, 1fr)" }}>
        <div />
        {Array.from({ length: 24 }).map((_, h) => (
          <div key={h} className="text-center text-[9px] text-[#9CA3AF]">{h % 3 === 0 ? h : ""}</div>
        ))}
        {DOW_ROWS.map(({ dow, label }) => (
          <div key={dow} className="contents">
            <div className="flex items-center text-[10px] text-[#6B7280]">{label}</div>
            {Array.from({ length: 24 }).map((_, hour) => {
              const count = cell.get(`${dow}-${hour}`) || 0;
              const intensity = count / max;
              return (
                <div
                  key={hour}
                  title={`${label} ${hour}:00 — ${count} calls`}
                  className="aspect-square rounded-[3px]"
                  style={{ background: intensity === 0 ? "#F1F5F9" : `rgba(99, 102, 241, ${0.15 + intensity * 0.85})` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
