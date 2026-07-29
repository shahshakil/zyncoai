// Shared chart color palette — the only colors charts should use for fills/strokes.
// Per-vertical brand accent (verticalTheme.ts) still drives the "primary series"
// color on charts that are explicitly vertical-themed (e.g. DynamicAnalyticsPanel);
// this palette covers everything else plus the fixed semantic colors.
export const CHART_COLORS = {
  primary: "#6366f1", // indigo
  secondary: "#8b5cf6", // violet
  info: "#06b6d4", // cyan
  success: "#10b981", // emerald
  warning: "#f59e0b", // amber
  danger: "#f43f5e", // rose
} as const;

export const CHART_GRID_STROKE = "#f1f5f9";
export const CHART_AXIS_STYLE = { fontSize: 11, fill: "#94a3b8" };
