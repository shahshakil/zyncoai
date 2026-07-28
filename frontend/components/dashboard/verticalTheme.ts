// Per-vertical theming + copy for the dashboard shell and home page. Colors
// are plain hex values consumed as CSS custom properties (--accent /
// --accent-soft / --accent-dark), set once on a wrapper div in
// dashboard/layout.tsx — every themed element then just references
// `bg-[var(--accent)]` etc, a fixed literal class name Tailwind's JIT scan
// always picks up. This avoids ever constructing a Tailwind class name
// dynamically (e.g. `bg-${color}-500`), which the content-scanner can't see
// and would silently purge in production builds.
export type Vertical = "MEDICAL" | "DENTAL" | "LAW" | "UNIVERSITY" | "RESTAURANT" | "MECHANIC" | "RETAIL" | "SALON" | "REAL_ESTATE" | "BANK" | "OTHER";

export interface VerticalTheme {
  label: string;
  accent: string; // primary accent — buttons, active nav, chart primary series
  accentSoft: string; // tinted backgrounds (stat card icon chips, hover states)
  accentDark: string; // sidebar background
  badge: string; // short vertical badge shown in the dashboard header
  icon: string; // single emoji shown next to the badge
  stats: { patients: string; consultations: string; staff: string; capacity: string };
  panels: { revenue: string; payments: string; upcoming: string; staffList: string; overview: string; recordNoun: string };
}

export const VERTICAL_THEME: Record<Vertical, VerticalTheme> = {
  MEDICAL: {
    label: "Medical",
    accent: "#0D9488",
    accentSoft: "#F0FDFA",
    accentDark: "#0F172A",
    badge: "Clinical",
    icon: "🏥",
    stats: { patients: "Total Patients", consultations: "Consultations", staff: "Staff", capacity: "Total Rooms" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Appointments", staffList: "Doctor List", overview: "Appointments Overview", recordNoun: "Appointment" },
  },
  DENTAL: {
    label: "Dental",
    accent: "#0284C7",
    accentSoft: "#F0F9FF",
    accentDark: "#0F172A",
    badge: "Dental",
    icon: "🦷",
    stats: { patients: "Total Patients", consultations: "Consultations", staff: "Staff", capacity: "Total Rooms" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Appointments", staffList: "Doctor List", overview: "Appointments Overview", recordNoun: "Appointment" },
  },
  MECHANIC: {
    label: "Mechanic",
    accent: "#EA580C",
    accentSoft: "#FFF7ED",
    accentDark: "#1C1917",
    badge: "Auto",
    icon: "🔧",
    stats: { patients: "Vehicles In", consultations: "Jobs Today", staff: "Mechanics", capacity: "Bays" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Active Jobs", staffList: "Mechanic List", overview: "Vehicle Types", recordNoun: "Job Ticket" },
  },
  RESTAURANT: {
    label: "Restaurant",
    accent: "#9F1239",
    accentSoft: "#FFF1F2",
    accentDark: "#1C1917",
    badge: "Hospitality",
    icon: "🍽️",
    stats: { patients: "Customers", consultations: "Orders Today", staff: "Staff", capacity: "Tables" },
    panels: { revenue: "Daily Revenue", payments: "Orders History", upcoming: "Live Orders", staffList: "Kitchen Staff", overview: "Popular Items", recordNoun: "Order" },
  },
  LAW: {
    label: "Law Firm",
    accent: "#1E3A8A",
    accentSoft: "#EFF6FF",
    accentDark: "#1C1917",
    badge: "Legal",
    icon: "⚖️",
    stats: { patients: "Active Cases", consultations: "Consultations Today", staff: "Lawyers", capacity: "Pending Files" },
    panels: { revenue: "Monthly Billing", payments: "Billing History", upcoming: "Upcoming Consultations", staffList: "Lawyer List", overview: "Cases by Type", recordNoun: "Consultation" },
  },
  BANK: {
    label: "Bank",
    accent: "#1E3A8A",
    accentSoft: "#EFF6FF",
    accentDark: "#0F172A",
    badge: "Finance",
    icon: "🏦",
    stats: { patients: "Customers Served", consultations: "Appointments Today", staff: "Bankers", capacity: "Branches" },
    panels: { revenue: "Daily Revenue", payments: "Service History", upcoming: "Upcoming Appointments", staffList: "Banker List", overview: "Service Types", recordNoun: "Appointment" },
  },
  UNIVERSITY: {
    label: "University",
    accent: "#6D28D9",
    accentSoft: "#F5F3FF",
    accentDark: "#1C1917",
    badge: "Education",
    icon: "🎓",
    stats: { patients: "Students Advised", consultations: "Appointments", staff: "Advisors", capacity: "Departments" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Sessions", staffList: "Advisor List", overview: "Department Breakdown", recordNoun: "Appointment" },
  },
  SALON: {
    label: "Salon",
    accent: "#7C3AED",
    accentSoft: "#F5F3FF",
    accentDark: "#1C1917",
    badge: "Beauty",
    icon: "💅",
    stats: { patients: "Customers Today", consultations: "Bookings", staff: "Staff", capacity: "Services" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Today's Timeline", staffList: "Staff Schedule", overview: "Popular Services", recordNoun: "Booking" },
  },
  RETAIL: {
    label: "Retail",
    accent: "#D97706",
    accentSoft: "#FFFBEB",
    accentDark: "#1C1917",
    badge: "Retail",
    icon: "🛍️",
    stats: { patients: "Customers Today", consultations: "Bookings", staff: "Staff", capacity: "Services" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Today's Timeline", staffList: "Staff Schedule", overview: "Popular Services", recordNoun: "Booking" },
  },
  REAL_ESTATE: {
    label: "Real Estate",
    accent: "#059669",
    accentSoft: "#ECFDF5",
    accentDark: "#0F172A",
    badge: "Property",
    icon: "🏠",
    stats: { patients: "Clients", consultations: "Showings Today", staff: "Agents", capacity: "Listings" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Showings", staffList: "Agent List", overview: "Listings by Type", recordNoun: "Showing" },
  },
  OTHER: {
    label: "Business",
    accent: "#6366F1",
    accentSoft: "#EEF2FF",
    accentDark: "#0F172A",
    badge: "Business",
    icon: "💼",
    stats: { patients: "Contacts", consultations: "Bookings", staff: "Staff", capacity: "Capacity" },
    panels: { revenue: "Daily Revenue", payments: "Payments History", upcoming: "Upcoming Bookings", staffList: "Staff List", overview: "Bookings Overview", recordNoun: "Booking" },
  },
};

export function getVerticalTheme(vertical?: string | null): VerticalTheme {
  return VERTICAL_THEME[(vertical as Vertical) || "OTHER"] || VERTICAL_THEME.OTHER;
}
