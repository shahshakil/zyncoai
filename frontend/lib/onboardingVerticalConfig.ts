// Per-vertical copy for the onboarding wizard (frontend/app/onboarding/page.tsx).
// Mirrors the same vertical bucketing used elsewhere (welcomeEmail.ts's
// VERTICAL_CONTENT, integrationsCatalog.ts, server.py's VERTICAL_OVERLAYS) —
// OTHER is this codebase's real enum value for the brief's "DEFAULT" bucket.
// staffOptional must stay in sync with onboarding.ts's /activate
// staffOptionalVerticals set — only RESTAURANT and OTHER can activate with
// zero staff; every other vertical genuinely needs someone to book against.
export type VerticalConfig = {
  emoji: string;
  label: string;
  staffTitle: string;
  staffLabel: string;
  staffPlaceholder: string;
  staffOptional: boolean;
  hoursHint: string;
  welcomeMessage: string;
  features: string[];
};

const DEFAULT_HOURS_HINT = "Ella only offers appointment slots within these hours.";

export const VERTICAL_CONFIG: Record<string, VerticalConfig> = {
  MEDICAL: {
    emoji: "🏥",
    label: "Medical Clinic",
    staffTitle: "Add your practitioners",
    staffLabel: "Doctor/Practitioner name",
    staffPlaceholder: "Dr. Sarah Smith",
    staffOptional: false,
    hoursHint: "These are your consultation hours — Ella only books appointments within them.",
    welcomeMessage: "Ella is ready to answer patient calls 24/7",
    features: ["Book patient appointments", "Handle after-hours calls", "Medicare and health fund queries", "Emergency escalation"],
  },
  DENTAL: {
    emoji: "🦷",
    label: "Dental Practice",
    staffTitle: "Add your dental team",
    staffLabel: "Dentist name",
    staffPlaceholder: "Dr. James Wilson",
    staffOptional: false,
    hoursHint: "These are your consultation hours — Ella only books appointments within them.",
    welcomeMessage: "Ella is ready to handle patient enquiries 24/7",
    features: ["Book patient appointments", "Handle after-hours calls", "Insurance and payment plan queries", "Emergency escalation"],
  },
  RESTAURANT: {
    emoji: "🍔",
    label: "Restaurant",
    staffTitle: "Add your staff (optional)",
    staffLabel: "Staff member name",
    staffPlaceholder: "Alex — Floor Manager",
    staffOptional: true,
    hoursHint: "Tip: restaurants get their busiest calls Friday and Saturday evenings — double-check those hours.",
    welcomeMessage: "Ella is ready to take phone orders 24/7",
    features: ["Take phone orders", "Handle customisations (no beetroot, add pickles)", "Quote wait times based on the queue", "Manage reservations"],
  },
  MECHANIC: {
    emoji: "🔧",
    label: "Auto Repair Shop",
    staffTitle: "Add your workshop team",
    staffLabel: "Mechanic/Technician name",
    staffPlaceholder: "John Smith — Lead Mechanic",
    staffOptional: false,
    hoursHint: "Workshop hours are typically Monday–Friday — mark weekends closed if you don't take bookings then.",
    welcomeMessage: "Ella is ready to book workshop appointments 24/7",
    features: ["Book service appointments", "Handle vehicle enquiries", "Quote job times", "Parts availability queries"],
  },
  LAW: {
    emoji: "⚖️",
    label: "Law Firm",
    staffTitle: "Add your legal team",
    staffLabel: "Solicitor/Partner name",
    staffPlaceholder: "Sarah Johnson — Partner",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to handle client intake 24/7",
    features: ["Capture client details", "Schedule consultations", "Never gives legal advice", "Transfers sensitive matters to a solicitor"],
  },
  SALON: {
    emoji: "💇",
    label: "Salon / Spa",
    staffTitle: "Add your stylists",
    staffLabel: "Stylist/Therapist name",
    staffPlaceholder: "Emma Davis — Senior Stylist",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to book appointments 24/7",
    features: ["Book beauty appointments", "Match stylist preferences", "Handle cancellations", "Quote service prices"],
  },
  REAL_ESTATE: {
    emoji: "🏠",
    label: "Real Estate",
    staffTitle: "Add your agents",
    staffLabel: "Agent name",
    staffPlaceholder: "Chris Lee — Sales Agent",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to handle property enquiries 24/7",
    features: ["Handle property enquiries", "Book inspection times", "Capture buyer/seller details", "Transfer urgent matters to an agent"],
  },
  BANK: {
    emoji: "🏦",
    label: "Bank / Financial",
    staffTitle: "Add your bankers",
    staffLabel: "Banker name",
    staffPlaceholder: "Priya Patel — Branch Manager",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to handle appointment bookings 24/7",
    features: ["Book branch appointments", "Handle general enquiries", "Never discusses account details or balances", "Transfers sensitive matters to a banker"],
  },
  UNIVERSITY: {
    emoji: "🎓",
    label: "University / Education",
    staffTitle: "Add your advisors",
    staffLabel: "Advisor/Staff name",
    staffPlaceholder: "Dr. Kim — Student Advisor",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to handle student enquiries 24/7",
    features: ["Book advising sessions", "Handle enrollment enquiries", "Answer department/faculty questions", "Transfer urgent matters to staff"],
  },
  RETAIL: {
    emoji: "🛍️",
    label: "Retail Store",
    staffTitle: "Add your team",
    staffLabel: "Team member name",
    staffPlaceholder: "Jamie — Store Manager",
    staffOptional: false,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to handle your calls 24/7",
    features: ["Handle order and stock enquiries", "Book in-store appointments", "Answer product questions", "Transfer urgent matters to staff"],
  },
  OTHER: {
    emoji: "📞",
    label: "Other",
    staffTitle: "Add your team members (optional)",
    staffLabel: "Team member name",
    staffPlaceholder: "Team member name",
    staffOptional: true,
    hoursHint: DEFAULT_HOURS_HINT,
    welcomeMessage: "Ella is ready to answer your calls 24/7",
    features: ["Answer calls 24/7", "Book appointments automatically", "Handle after-hours calls", "Transfer urgent matters to a human"],
  },
};

export function getVerticalConfig(vertical: string): VerticalConfig {
  return VERTICAL_CONFIG[vertical] || VERTICAL_CONFIG.OTHER;
}
