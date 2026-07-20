import { VERTICAL_COLORS, VERTICAL_LABELS } from "./format";

export function VerticalBadge({ vertical }: { vertical: string }) {
  const c = VERTICAL_COLORS[vertical] || VERTICAL_COLORS.OTHER;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      {VERTICAL_LABELS[vertical] || vertical}
    </span>
  );
}
