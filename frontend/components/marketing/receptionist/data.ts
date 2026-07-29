// Shared content for the ZyncoAI receptionist marketing site: nav mega-menu,
// homepage sections, and the /solutions/[slug], /solutions/use-case/[slug],
// /solutions/size/[slug] template pages all read from here so copy stays in
// one place. Industry slugs map 1:1 to the real Vertical enum the backend
// already supports (MEDICAL/DENTAL/MECHANIC/RESTAURANT/LAW/BANK/UNIVERSITY/
// SALON) — these aren't hypothetical markets, the product already runs them.

export interface Industry {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  greeting: string;
  callerLine: string;
  callsHandledToday: number;
  features: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Medical",
    navLabel: "Healthcare & Medical",
    tagline: "Never miss a patient call again",
    greeting: "Good morning, Riverside Medical, this is Charlotte — how can I help?",
    callerLine: "Hi, I need to book in with Dr Johnson for a check-up",
    callsHandledToday: 1204,
    features: ["Books appointments against real provider calendars", "Understands Medicare, private health, DVA and WorkCover questions", "Flags emergency symptoms and escalates instantly", "Syncs with Cliniko, Best Practice and Medical Director"],
  },
  {
    slug: "dental",
    name: "Dental Practices",
    navLabel: "Dental Practices",
    tagline: "Fill every chair, every day",
    greeting: "Thanks for calling Smile Dental, this is Charlotte speaking!",
    callerLine: "I chipped a tooth, can someone see me today?",
    callsHandledToday: 863,
    features: ["Triages urgent dental pain vs routine bookings", "Handles recalls for 6-monthly checkups automatically", "Answers insurance and payment-plan questions", "Books hygienist and dentist appointments separately"],
  },
  {
    slug: "legal",
    name: "Legal Firms",
    navLabel: "Legal Firms",
    tagline: "Every enquiry, professionally handled",
    greeting: "Good afternoon, Hartley & Associates, this is Charlotte.",
    callerLine: "I was in a car accident and need to speak to your solicitor about a claim",
    callsHandledToday: 412,
    features: ["Screens new matters before they reach a solicitor", "Books consultations across multiple practice areas", "Captures urgent WorkCover/CTP details accurately", "Never discusses legal advice — routes to a human for that"],
  },
  {
    slug: "mechanic",
    name: "Mechanic Shops",
    navLabel: "Mechanic Shops",
    tagline: "Stop losing jobs to a busy line",
    greeting: "G'day, you've reached Precision Auto, this is Charlotte.",
    callerLine: "My car's making a grinding noise — can our technician take a look this week?",
    callsHandledToday: 578,
    features: ["Books service bays and quotes turnaround times", "Captures the vehicle make, model and the issue upfront", "Handles parts-availability and pricing questions", "Sends job confirmations by SMS automatically"],
  },
  {
    slug: "restaurant",
    name: "Restaurants",
    navLabel: "Restaurants",
    tagline: "Answer every table booking, every time",
    greeting: "Thanks for calling Bella Vista, this is Charlotte!",
    callerLine: "Could our team fit in a table for 6 this Saturday at 7:30pm?",
    callsHandledToday: 991,
    features: ["Takes bookings without pulling staff off the floor", "Handles dietary requirements and large-group requests", "Answers opening-hours and menu questions instantly", "Never puts a caller on hold during dinner rush"],
  },
  {
    slug: "bank",
    name: "Banks & Credit Unions",
    navLabel: "Banks & Credit Unions",
    tagline: "24/7 member service without the wait times",
    greeting: "Thank you for calling Coastal Credit Union, this is Charlotte.",
    callerLine: "I'd like to book a time to talk to your banker about a home loan",
    callsHandledToday: 1530,
    features: ["Books appointments with the right banker or advisor", "Screens and routes enquiries by product type", "Never handles account numbers or transactions — routes securely", "Available after-hours for members in every timezone"],
  },
  {
    slug: "university",
    name: "Universities",
    navLabel: "Universities",
    tagline: "One line, every faculty covered",
    greeting: "Hello, you've reached Student Services, this is Charlotte.",
    callerLine: "I need to know the enrolment deadline for semester two",
    callsHandledToday: 2140,
    features: ["Answers enrolment, fees and semester-date questions", "Books appointments with student advisors and faculty", "Routes urgent welfare calls to the right support line", "Handles the enrolment-period call surge without hiring casuals"],
  },
  {
    slug: "salon",
    name: "Beauty & Wellness",
    navLabel: "Beauty & Wellness",
    tagline: "Keep the books full without answering the phone mid-appointment",
    greeting: "Hi, thanks for calling Lumen Beauty, this is Charlotte.",
    callerLine: "Can I book a colour and cut for next Tuesday afternoon?",
    callsHandledToday: 704,
    features: ["Books against each stylist's real availability", "Handles service-length and pricing questions", "Sends automatic reminder calls to cut no-shows", "Rebooks clients for their next appointment on the spot"],
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    navLabel: "Financial Services",
    tagline: "Professional call handling for every client enquiry",
    greeting: "Good morning, Ashford Financial, this is Charlotte.",
    callerLine: "I'd like to book a review of my super with my adviser",
    callsHandledToday: 356,
    features: ["Books client review meetings automatically", "Screens new-client enquiries before they reach an adviser", "Never gives financial advice — always routes to a human for that", "Captures urgent compliance-sensitive calls correctly"],
  },
  {
    slug: "home-services",
    name: "Home Services",
    navLabel: "Home Services",
    tagline: "Never lose a job to voicemail again",
    greeting: "Thanks for calling Bright Plumbing, this is Charlotte.",
    callerLine: "I've got a burst pipe, I need someone urgently",
    callsHandledToday: 1042,
    features: ["Triages urgent call-outs from routine bookings", "Captures the job address and issue before dispatch", "Books tradespeople against real-time availability", "Answers after-hours when emergencies actually happen"],
  },
];

export interface UseCase {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  description: string;
}

export const USE_CASES: UseCase[] = [
  { slug: "inbound-answering", name: "Inbound Call Answering", navLabel: "Inbound Call Answering", tagline: "Every call answered in under a second", description: "Charlotte answers every inbound call instantly — no hold music, no voicemail, no missed calls." },
  { slug: "after-hours", name: "After-Hours & Overflow", navLabel: "After-Hours & Overflow", tagline: "Coverage when your team can't", description: "Nights, weekends, lunch breaks and call spikes — Charlotte picks up every call your team can't." },
  { slug: "appointment-scheduling", name: "Appointment Scheduling", navLabel: "Appointment Scheduling", tagline: "Bookings made without lifting a finger", description: "Charlotte checks real availability and books directly into your calendar — no back-and-forth." },
  { slug: "intake", name: "Patient & Client Intake", navLabel: "Patient & Client Intake", tagline: "Capture the details right, every time", description: "New patient or client details are captured accurately and pushed straight into your system." },
  { slug: "recalls", name: "Outbound Recalls", navLabel: "Outbound Recalls", tagline: "Fill gaps in your calendar automatically", description: "Charlotte calls overdue patients and clients to rebook them — no manual call list required." },
  { slug: "bilingual", name: "Bilingual Call Answering", navLabel: "Bilingual Call Answering", tagline: "Serve every caller in their own language", description: "Charlotte detects the caller's language automatically and responds fluently in 15+ languages." },
  { slug: "virtual-receptionist", name: "Virtual Receptionist", navLabel: "Virtual Receptionist", tagline: "A full-time receptionist, without the headcount", description: "Everything a front-desk receptionist does — answering, booking, screening — without a salary." },
  { slug: "24-7-answering", name: "24/7 Call Answering", navLabel: "24/7 Call Answering", tagline: "Your business never closes the phone line", description: "Charlotte works every hour of every day — no shifts, no sick days, no burnout." },
  { slug: "human-ai-together", name: "Human + AI Together", navLabel: "Human + AI Together", tagline: "AI handles the routine, your team handles the rest", description: "Charlotte filters and books the routine calls, then transfers anything complex straight to your team." },
];

export interface CompanySize {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  description: string;
}

export const COMPANY_SIZES: CompanySize[] = [
  { slug: "solo", name: "Solo Practitioner", navLabel: "Solo Practitioner", tagline: "Your own receptionist, from day one", description: "Running the business and answering the phone at the same time doesn't scale. Charlotte does both jobs so you don't have to." },
  { slug: "small-business", name: "Small Business (2-10 staff)", navLabel: "Small Business (2-10 staff)", tagline: "Stop pulling staff off the floor to answer the phone", description: "Every missed call is a missed booking. Charlotte frees your team to focus on the people already in front of them." },
  { slug: "mid-market", name: "Mid-Market (10-50 staff)", navLabel: "Mid-Market (10-50 staff)", tagline: "Consistent call handling across a growing team", description: "As call volume grows, so does the cost of inconsistency. Charlotte answers every call the same way, every time." },
  { slug: "enterprise", name: "Enterprise (50+ staff)", navLabel: "Enterprise (50+ staff)", tagline: "Enterprise-grade call handling, fully auditable", description: "SLA-backed availability, full audit trails, and integrations built for scale — without a call-centre headcount." },
  { slug: "franchise", name: "Franchise & Multi-location", navLabel: "Franchise & Multi-location", tagline: "One consistent front desk, every location", description: "Every location answers calls the same way, books into the right calendar, and reports into one dashboard." },
];

export interface PricingPlan {
  key: string;
  name: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  borderColor: string;
  popular?: boolean;
  minutesIncluded: string;
  perMinute: string;
  locations: string;
  support: string;
  cta: string;
}

// Every plan gets the exact same full ZyncoAI platform. Plans only ever
// differ on minutes included, number of locations, and support tier — never
// on which features are unlocked. COMMON_FEATURES below is rendered
// identically under every plan card (collapsed behind an "All features
// included" toggle) rather than duplicated per-plan, since the list never
// changes between plans.
export const PRICING_PLANS: PricingPlan[] = [
  {
    key: "startup",
    name: "Startup",
    priceMonthly: 299,
    priceAnnualMonthly: 239,
    borderColor: "#16a34a",
    minutesIncluded: "600 minutes/month",
    perMinute: "AUD $0.50 per extra minute",
    locations: "1 location",
    support: "Email support",
    cta: "Start free trial",
  },
  {
    key: "professional",
    name: "Professional",
    priceMonthly: 399,
    priceAnnualMonthly: 319,
    borderColor: "#6366f1",
    popular: true,
    minutesIncluded: "1,000 minutes/month",
    perMinute: "AUD $0.40 per extra minute",
    locations: "1 location",
    support: "Email + chat support",
    cta: "Start free trial",
  },
  {
    key: "premium",
    name: "Premium",
    priceMonthly: 699,
    priceAnnualMonthly: 559,
    borderColor: "#06b6d4",
    minutesIncluded: "2,000 minutes/month",
    perMinute: "AUD $0.40 per extra minute",
    locations: "Multiple locations",
    support: "Email + chat + phone support",
    cta: "Start free trial",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    priceMonthly: 0,
    priceAnnualMonthly: 0,
    borderColor: "#f59e0b",
    minutesIncluded: "Unlimited minutes",
    perMinute: "SLA-backed volume pricing",
    locations: "Multiple locations",
    support: "Dedicated SLA support",
    cta: "Contact sales",
  },
];

// Identical on every plan — the whole point being that pricing scales with
// call volume and locations, not with which parts of the product you get.
// Multilingual AI is deliberately excluded — it's sold as an add-on, not a
// base-plan feature (see ADD_ONS' "multilingual" entry).
export const COMMON_FEATURES: string[] = [
  "AI receptionist 24/7 — Charlotte voice",
  "Full practice manager dashboard",
  "Patient files and document management",
  "Insurance claims (Medicare, DVA, WorkCover, NDIS)",
  "Financial and revenue dashboard",
  "Call history with full transcripts",
  "Appointment booking and management",
  "Email and SMS confirmations",
  "Cliniko, Best Practice, Medical Director integration",
  "Google and Microsoft calendar sync",
  "Staff management and roles",
  "Analytics (AI voice + clinical metrics)",
  "Export and print all data",
  "Australian compliance built in",
  "Emergency detection — 000, Lifeline, Beyond Blue",
];

export interface AddOn {
  key: string;
  name: string;
  description: string;
  priceMonthly: number;
}

export const ADD_ONS: AddOn[] = [
  { key: "telehealth", name: "Telehealth Video Appointments", description: "Book and send video-consult links automatically.", priceMonthly: 59 },
  { key: "reviews", name: "Google Reviews Autopilot", description: "Requests a review automatically after every completed booking.", priceMonthly: 39 },
  { key: "multilingual", name: "Custom Multilingual Support", description: "Priority-tuned voice and vocabulary for a specific language.", priceMonthly: 49 },
  { key: "recalls", name: "Automated Patient Recalls", description: "Outbound calls to rebook overdue patients automatically.", priceMonthly: 79 },
  { key: "comms-hub", name: "Patient Communication Hub", description: "SMS + Email + WhatsApp, all from one inbox.", priceMonthly: 179 },
  { key: "multisite", name: "Multi-Site Command Centre", description: "Roll up call and booking data across every location.", priceMonthly: 299 },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  { quote: "We stopped losing new patients to voicemail the week we switched on Charlotte. Bookings are up and my front desk finally gets a lunch break.", name: "Dr. Priya Nair", role: "Practice Owner", location: "Riverside Medical, Newcastle NSW", rating: 5 },
  { quote: "Our after-hours calls used to just disappear. Now every one of them gets answered, booked, or flagged if it's urgent.", name: "Marcus Webb", role: "Practice Manager", location: "Smile Dental, Brisbane QLD", rating: 5 },
  { quote: "It sounds like a real Australian receptionist, not a robot. Clients genuinely don't realise until we tell them.", name: "Sarah Chen", role: "Director", location: "Lumen Beauty, Melbourne VIC", rating: 5 },
];

export const INTEGRATIONS = ["Cliniko", "Best Practice", "Medical Director", "Nookal", "Google Calendar", "Microsoft 365", "Zanda"];
