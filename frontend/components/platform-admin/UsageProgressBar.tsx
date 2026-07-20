"use client";

// Green under 80% of allowance, amber 80-100%, red once overage kicks in.
function colorFor(pct: number): string {
  if (pct > 100) return "#EF4444";
  if (pct >= 80) return "#F59E0B";
  return "#10B981";
}

export function UsageProgressBar({ pctUsed, label }: { pctUsed: number | null; label?: string }) {
  if (pctUsed === null) {
    return (
      <div>
        {label && <div className="mb-1 text-xs text-[#6B7280]">{label}</div>}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
          <div className="h-full w-full rounded-full bg-[#6366F1]/30" />
        </div>
        <p className="mt-1 text-[11px] text-[#9CA3AF]">Unlimited plan</p>
      </div>
    );
  }
  const width = Math.min(100, pctUsed);
  const color = colorFor(pctUsed);
  return (
    <div>
      {label && <div className="mb-1 flex items-center justify-between text-xs text-[#6B7280]"><span>{label}</span><span className="font-semibold" style={{ color }}>{pctUsed}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}
