"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LightTooltip } from "./ChartTooltip";
import { CHART_GRID_STROKE, CHART_AXIS_STYLE } from "./chartTheme";

export interface StackedSeries {
  key: string;
  label: string;
  color: string;
}

// For any 2-3-category breakdown per time bucket (call outcomes by day,
// revenue by category). Legend is a colored-dot row above the chart, not
// inside it. Only the topmost segment gets rounded caps; a white stroke
// between segments stands in for a hard gap (recharts stacked bars don't
// support a real inter-segment gap without custom shapes).
export function StackedBarChart({
  data,
  xKey,
  series,
  height = 240,
  formatter,
}: {
  data: any[];
  xKey: string;
  series: StackedSeries[];
  height?: number;
  formatter?: (value: number, name?: string) => string;
}) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
          <XAxis dataKey={xKey} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
          <Tooltip content={<LightTooltip formatter={formatter} />} cursor={{ fill: "#F1F5F9" }} />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="stack"
              fill={s.color}
              stroke="#fff"
              strokeWidth={2}
              radius={i === series.length - 1 ? ([4, 4, 0, 0] as [number, number, number, number]) : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
