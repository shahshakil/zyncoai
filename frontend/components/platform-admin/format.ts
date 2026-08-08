export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format((cents || 0) / 100);
}

// 1,000,000 micros = $1 — used by the owner financial command centre's
// cost-tracking figures (CallCost/UsageCostEvent are stored in micros for
// sub-cent precision).
export function formatMicros(micros: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format((micros || 0) / 1_000_000);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n || 0);
}

export function pluralize(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function timeAgo(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const diffMs = Date.now() - date.getTime();
  const sec = Math.max(0, Math.round(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

import { Stethoscope, Smile, Scale, GraduationCap, UtensilsCrossed, Wrench, ShoppingBag, Scissors, Home, Landmark, Building2, type LucideIcon } from "lucide-react";

export const VERTICAL_ICONS: Record<string, LucideIcon> = {
  MEDICAL: Stethoscope, DENTAL: Smile, LAW: Scale, UNIVERSITY: GraduationCap,
  RESTAURANT: UtensilsCrossed, MECHANIC: Wrench, RETAIL: ShoppingBag, SALON: Scissors,
  REAL_ESTATE: Home, BANK: Landmark, OTHER: Building2,
};

export const VERTICAL_LABELS: Record<string, string> = {
  MEDICAL: "Medical", DENTAL: "Dental", LAW: "Law", UNIVERSITY: "University",
  RESTAURANT: "Restaurant", MECHANIC: "Mechanic", RETAIL: "Retail", SALON: "Salon",
  REAL_ESTATE: "Real Estate", BANK: "Bank", OTHER: "Other",
};

export const OUTCOME_COLORS: Record<string, string> = {
  booked: "#10B981",
  rescheduled: "#3B82F6",
  cancelled: "#F59E0B",
  faq: "#6366F1",
  callback: "#F97316",
  emergency: "#EF4444",
  abandoned: "#9CA3AF",
  unclassified: "#94A3B8",
  // Legacy values written before the outcome-classification fix — kept so
  // historical calls still render a sensible colour instead of falling
  // back to grey.
  callback_requested: "#F97316",
  canceled: "#F59E0B",
  guardrail_redirect: "#F97316",
  emergency_redirect: "#EF4444",
  faq_answered: "#6366F1",
};

export function outcomeLabel(outcome: string): string {
  if (outcome === "unclassified") return "Unclassified";
  return outcome.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Per-vertical badge colours (Businesses page, drawer, revenue/calls
// breakdowns) — distinct from the generic purple Badge tone so verticals
// are visually scannable in a long table.
export const VERTICAL_COLORS: Record<string, { bg: string; text: string }> = {
  MEDICAL: { bg: "#EFF6FF", text: "#2563EB" },
  DENTAL: { bg: "#F0FDFA", text: "#0D9488" },
  LAW: { bg: "#F5F3FF", text: "#7C3AED" },
  UNIVERSITY: { bg: "#EEF2FF", text: "#4F46E5" },
  RESTAURANT: { bg: "#FEF2F2", text: "#DC2626" },
  MECHANIC: { bg: "#FFF7ED", text: "#EA580C" },
  RETAIL: { bg: "#FDF4FF", text: "#C026D3" },
  SALON: { bg: "#FDF2F8", text: "#DB2777" },
  REAL_ESTATE: { bg: "#F0FDF4", text: "#16A34A" },
  BANK: { bg: "#F8FAFC", text: "#475569" },
  OTHER: { bg: "#F8F9FA", text: "#6B7280" },
};

const ACTIVITY_DOT_COLORS: Record<string, string> = {
  booking: "#10B981",
  call: "#3B82F6",
  signup: "#6366F1",
  callback: "#F97316",
  emergency: "#EF4444",
  abandoned: "#9CA3AF",
};

export function activityDotColor(type: string): string {
  return ACTIVITY_DOT_COLORS[type] || "#94A3B8";
}

// Minimal UA parser for the Audit Log's "Device" column — good enough to
// tell an admin "Chrome on Mac" apart from "curl/8.4" without pulling in a
// full user-agent-parsing dependency for one column.
export function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return "—";
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) && !/Chrome/.test(ua) ? "Safari" :
    /curl|Postman|python-requests|axios/i.test(ua) ? "API client" :
    "Other";
  const os =
    /Windows/.test(ua) ? "Windows" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad/.test(ua) ? "iOS" :
    /Linux/.test(ua) ? "Linux" :
    "";
  return os ? `${browser} · ${os}` : browser;
}
