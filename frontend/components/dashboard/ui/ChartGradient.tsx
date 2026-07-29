// Drop inside a chart's <defs> to get the standard fade-to-axis fill used by
// every area/bar chart in the dashboard — never a flat solid fill.
export function ChartGradient({ id, color, opacity = 0.35 }: { id: string; color: string; opacity?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={opacity} />
      <stop offset="95%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}
