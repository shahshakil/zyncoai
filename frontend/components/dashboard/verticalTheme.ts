// Per-vertical theming + copy for the dashboard shell and home page. Colors
// are plain hex values consumed as CSS custom properties (--accent-primary /
// --accent-light / --accent-border / --accent-text / --gradient etc), set
// once on a wrapper div in dashboard/layout.tsx — every themed element then
// just references `bg-[var(--accent-primary)]` etc, a fixed literal class
// name Tailwind's JIT scan always picks up. This avoids ever constructing a
// Tailwind class name dynamically (e.g. `bg-${color}-500`), which the
// content-scanner can't see and would silently purge in production builds.
//
// `accent`/`accentSoft`/`accentDark`/`badge`/`icon`/`stats`/`panels` are the
// original field names, kept as aliases (accent === accentPrimary, accentSoft
// === accentLight) so every existing consumer (DynamicAnalyticsPanel,
// AnalyticsDashboard, Topbar, contacts page, dashboard/layout.tsx) keeps
// working unchanged — only the new elite-light-theme fields were added.
// accentDark is no longer used for the sidebar (which is white now) but is
// kept for any future dark-surface use.
export type Vertical = "MEDICAL" | "DENTAL" | "LAW" | "UNIVERSITY" | "RESTAURANT" | "MECHANIC" | "RETAIL" | "SALON" | "REAL_ESTATE" | "BANK" | "OTHER";

export interface VerticalTheme {
  label: string;
  accent: string; // alias of accentPrimary
  accentSoft: string; // alias of accentLight
  accentDark: string;
  accentPrimary: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  gradient: string; // "linear-gradient(135deg, X, Y)"
  chartPrimary: string;
  chartSecondary: string;
  buttonClass: string; // solid Tailwind classes for a flat (non-gradient) accent button
  badgeClass: string; // "bg-X-50 text-X-700 border-X-200"
  badge: string; // short vertical badge shown in the dashboard header
  icon: string; // single emoji shown next to the badge
  stats: { patients: string; consultations: string; staff: string; capacity: string };
  panels: { revenue: string; payments: string; upcoming: string; staffList: string; overview: string; recordNoun: string };
}

type VerticalColorSpec = Pick<VerticalTheme, "accentPrimary" | "accentLight" | "accentBorder" | "accentText" | "gradient" | "chartPrimary" | "chartSecondary" | "buttonClass" | "badgeClass">;

const COLORS: Record<Vertical, VerticalColorSpec> = {
  MEDICAL: {
    accentPrimary: "#0d9488", accentLight: "#f0fdfa", accentBorder: "#99f6e4", accentText: "#0f766e",
    gradient: "linear-gradient(135deg, #0d9488, #0284c7)", chartPrimary: "#0d9488", chartSecondary: "#0284c7",
    buttonClass: "bg-teal-600 hover:bg-teal-700", badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
  },
  DENTAL: {
    accentPrimary: "#0284c7", accentLight: "#f0f9ff", accentBorder: "#bae6fd", accentText: "#0369a1",
    gradient: "linear-gradient(135deg, #0284c7, #0d9488)", chartPrimary: "#0284c7", chartSecondary: "#06b6d4",
    buttonClass: "bg-blue-600 hover:bg-blue-700", badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  MECHANIC: {
    accentPrimary: "#ea580c", accentLight: "#fff7ed", accentBorder: "#fed7aa", accentText: "#c2410c",
    gradient: "linear-gradient(135deg, #ea580c, #dc2626)", chartPrimary: "#ea580c", chartSecondary: "#f97316",
    buttonClass: "bg-orange-600 hover:bg-orange-700", badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  RESTAURANT: {
    accentPrimary: "#9f1239", accentLight: "#fff1f2", accentBorder: "#fecdd3", accentText: "#881337",
    gradient: "linear-gradient(135deg, #9f1239, #be123c)", chartPrimary: "#9f1239", chartSecondary: "#e11d48",
    buttonClass: "bg-rose-700 hover:bg-rose-800", badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  LAW: {
    accentPrimary: "#1e3a8a", accentLight: "#eff6ff", accentBorder: "#bfdbfe", accentText: "#1e40af",
    gradient: "linear-gradient(135deg, #1e3a8a, #1d4ed8)", chartPrimary: "#1e3a8a", chartSecondary: "#3b82f6",
    buttonClass: "bg-blue-900 hover:bg-blue-950", badgeClass: "bg-blue-50 text-blue-900 border-blue-200",
  },
  SALON: {
    accentPrimary: "#7c3aed", accentLight: "#f5f3ff", accentBorder: "#ddd6fe", accentText: "#6d28d9",
    gradient: "linear-gradient(135deg, #7c3aed, #db2777)", chartPrimary: "#7c3aed", chartSecondary: "#a855f7",
    buttonClass: "bg-violet-600 hover:bg-violet-700", badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
  REAL_ESTATE: {
    accentPrimary: "#059669", accentLight: "#ecfdf5", accentBorder: "#a7f3d0", accentText: "#047857",
    gradient: "linear-gradient(135deg, #059669, #0284c7)", chartPrimary: "#059669", chartSecondary: "#10b981",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  BANK: {
    accentPrimary: "#0f172a", accentLight: "#f8fafc", accentBorder: "#cbd5e1", accentText: "#1e293b",
    gradient: "linear-gradient(135deg, #0f172a, #1e3a8a)", chartPrimary: "#0f172a", chartSecondary: "#475569",
    buttonClass: "bg-slate-900 hover:bg-slate-950", badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
  },
  UNIVERSITY: {
    accentPrimary: "#d97706", accentLight: "#fffbeb", accentBorder: "#fde68a", accentText: "#b45309",
    gradient: "linear-gradient(135deg, #d97706, #dc2626)", chartPrimary: "#d97706", chartSecondary: "#f59e0b",
    buttonClass: "bg-amber-600 hover:bg-amber-700", badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  RETAIL: {
    accentPrimary: "#0891b2", accentLight: "#ecfeff", accentBorder: "#a5f3fc", accentText: "#0e7490",
    gradient: "linear-gradient(135deg, #0891b2, #7c3aed)", chartPrimary: "#0891b2", chartSecondary: "#06b6d4",
    buttonClass: "bg-cyan-600 hover:bg-cyan-700", badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  OTHER: {
    accentPrimary: "#6366f1", accentLight: "#eef2ff", accentBorder: "#c7d2fe", accentText: "#4f46e5",
    gradient: "linear-gradient(135deg, #6366f1, #06b6d4)", chartPrimary: "#6366f1", chartSecondary: "#8b5cf6",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};

const COPY: Record<Vertical, Pick<VerticalTheme, "label" | "accentDark" | "badge" | "icon" | "stats" | "panels">> = {
  MEDICAL: {
    label: "Medical", accentDark: "#0F172A", badge: "Clinical", icon: "🏥",
    stats: { patients: "Total Patients", consultations: "Consultations", staff: "Staff", capacity: "Total Rooms" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Appointments", staffList: "Doctor List", overview: "Appointments Overview", recordNoun: "Appointment" },
  },
  DENTAL: {
    label: "Dental", accentDark: "#0F172A", badge: "Dental", icon: "🦷",
    stats: { patients: "Total Patients", consultations: "Consultations", staff: "Staff", capacity: "Total Rooms" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Appointments", staffList: "Doctor List", overview: "Appointments Overview", recordNoun: "Appointment" },
  },
  MECHANIC: {
    label: "Mechanic", accentDark: "#1C1917", badge: "Auto", icon: "🔧",
    stats: { patients: "Vehicles In", consultations: "Jobs Today", staff: "Mechanics", capacity: "Bays" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Active Jobs", staffList: "Mechanic List", overview: "Vehicle Types", recordNoun: "Job Ticket" },
  },
  RESTAURANT: {
    label: "Restaurant", accentDark: "#1C1917", badge: "Hospitality", icon: "🍽️",
    stats: { patients: "Customers", consultations: "Orders Today", staff: "Staff", capacity: "Tables" },
    panels: { revenue: "Daily Revenue", payments: "Orders History", upcoming: "Live Orders", staffList: "Kitchen Staff", overview: "Popular Items", recordNoun: "Order" },
  },
  LAW: {
    label: "Law Firm", accentDark: "#1C1917", badge: "Legal", icon: "⚖️",
    stats: { patients: "Active Cases", consultations: "Consultations Today", staff: "Lawyers", capacity: "Pending Files" },
    panels: { revenue: "Monthly Billing", payments: "Billing History", upcoming: "Upcoming Consultations", staffList: "Lawyer List", overview: "Cases by Type", recordNoun: "Consultation" },
  },
  BANK: {
    label: "Bank", accentDark: "#0F172A", badge: "Finance", icon: "🏦",
    stats: { patients: "Customers Served", consultations: "Appointments Today", staff: "Bankers", capacity: "Branches" },
    panels: { revenue: "Daily Revenue", payments: "Service History", upcoming: "Upcoming Appointments", staffList: "Banker List", overview: "Service Types", recordNoun: "Appointment" },
  },
  UNIVERSITY: {
    label: "University", accentDark: "#1C1917", badge: "Education", icon: "🎓",
    stats: { patients: "Students Advised", consultations: "Appointments", staff: "Advisors", capacity: "Departments" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Sessions", staffList: "Advisor List", overview: "Department Breakdown", recordNoun: "Appointment" },
  },
  SALON: {
    label: "Salon", accentDark: "#1C1917", badge: "Beauty", icon: "💅",
    stats: { patients: "Customers Today", consultations: "Bookings", staff: "Staff", capacity: "Services" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Today's Timeline", staffList: "Staff Schedule", overview: "Popular Services", recordNoun: "Booking" },
  },
  RETAIL: {
    label: "Retail", accentDark: "#1C1917", badge: "Retail", icon: "🛍️",
    stats: { patients: "Customers Today", consultations: "Bookings", staff: "Staff", capacity: "Services" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Today's Timeline", staffList: "Staff Schedule", overview: "Popular Services", recordNoun: "Booking" },
  },
  REAL_ESTATE: {
    label: "Real Estate", accentDark: "#0F172A", badge: "Property", icon: "🏠",
    stats: { patients: "Clients", consultations: "Showings Today", staff: "Agents", capacity: "Listings" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Showings", staffList: "Agent List", overview: "Listings by Type", recordNoun: "Showing" },
  },
  OTHER: {
    label: "Business", accentDark: "#0F172A", badge: "Business", icon: "💼",
    stats: { patients: "Contacts", consultations: "Bookings", staff: "Staff", capacity: "Capacity" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Bookings", staffList: "Staff List", overview: "Bookings Overview", recordNoun: "Booking" },
  },
};

function buildTheme(v: Vertical): VerticalTheme {
  const c = COLORS[v];
  const copy = COPY[v];
  return { ...copy, ...c, accent: c.accentPrimary, accentSoft: c.accentLight };
}

export const VERTICAL_THEME: Record<Vertical, VerticalTheme> = {
  MEDICAL: buildTheme("MEDICAL"),
  DENTAL: buildTheme("DENTAL"),
  MECHANIC: buildTheme("MECHANIC"),
  RESTAURANT: buildTheme("RESTAURANT"),
  LAW: buildTheme("LAW"),
  BANK: buildTheme("BANK"),
  UNIVERSITY: buildTheme("UNIVERSITY"),
  SALON: buildTheme("SALON"),
  RETAIL: buildTheme("RETAIL"),
  REAL_ESTATE: buildTheme("REAL_ESTATE"),
  OTHER: buildTheme("OTHER"),
};

export function getVerticalTheme(vertical?: string | null): VerticalTheme {
  return VERTICAL_THEME[(vertical as Vertical) || "OTHER"] || VERTICAL_THEME.OTHER;
}
