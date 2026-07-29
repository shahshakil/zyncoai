"use client";
// The one glass tooltip every recharts <Tooltip content={...}> in the dashboard
// should use, replacing the 3 divergent styles (dark-glass in
// DynamicAnalyticsPanel, light-bordered in RevenueCharts, unstyled default
// elsewhere) that had grown independently.
interface Payload {
  name?: string;
  value?: number;
  color?: string;
  fill?: string;
}

// Light-theme counterpart to GlassTooltip, for charts that sit on white/
// light cards (the vast majority) — GlassTooltip stays dark, reserved for
// the deliberately dark-glass panels (DynamicAnalyticsPanel, LiveAgentHud,
// the Analytics dashboard page).
export function LightTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: Payload[];
  label?: string | number;
  formatter?: (value: number, name?: string) => string;
  labelFormatter?: (label: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border,#e2e8f0)] bg-white px-4 py-3 text-sm shadow-lg">
      {label != null && (
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <p key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color || p.fill }} />
            {p.name && <span className="text-slate-500">{p.name}</span>}
            <span className="font-semibold text-slate-900">{formatter ? formatter(p.value ?? 0, p.name) : p.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function GlassTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: Payload[];
  label?: string | number;
  formatter?: (value: number, name?: string) => string;
  labelFormatter?: (label: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 shadow-2xl backdrop-blur-md">
      {label != null && (
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <p key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color || p.fill }} />
            {p.name && <span className="text-slate-400">{p.name}</span>}
            <span className="font-semibold text-white">{formatter ? formatter(p.value ?? 0, p.name) : p.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
