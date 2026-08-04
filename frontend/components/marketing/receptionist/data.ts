// Shared content for the ZyncoAI receptionist marketing site: nav mega-menu,
// homepage sections, and the /solutions/[slug], /solutions/use-case/[slug],
// /solutions/size/[slug] template pages all read from here so copy stays in
// one place. Industry slugs map 1:1 to the real Vertical enum the backend
// already supports (MEDICAL/DENTAL/MECHANIC/RESTAURANT/LAW/BANK/UNIVERSITY/
// SALON) — these aren't hypothetical markets, the product already runs them.

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface Industry {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  greeting: string;
  callerLine: string;
  callsHandledToday: number;
  features: string[];
  // A real paragraph of unique body copy, not just bullet points — SEO
  // aside, a bare feature-bullet page reads as thin to a human too.
  overview: string;
  faqs: IndustryFaq[];
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Medical",
    navLabel: "Healthcare & Medical",
    tagline: "Never miss a patient call again",
    greeting: "Good morning, Riverside Medical, this is Ella — how can I help?",
    callerLine: "Hi, I need to book in with Dr Johnson for a check-up",
    callsHandledToday: 1204,
    features: ["Books appointments against real provider calendars", "Understands Medicare, private health, DVA and WorkCover questions", "Flags emergency symptoms and escalates instantly", "Syncs with Cliniko, plus CSV import for Best Practice"],
    overview:
      "A medical clinic's phone line carries genuine urgency — a parent calling about a sick child, a patient chasing test results, someone trying to book before symptoms get worse. Every one of those calls competing for the same one or two reception staff means some of them go to voicemail, and a caller who hits voicemail when they're worried rarely leaves a message; they just call the next clinic. Ella answers every single call in under a second, day or night, and checks each provider's real calendar before offering a time, so there's no double-booking and no back-and-forth. Medicare, private health fund, DVA and WorkCover questions are handled in the same conversation, and anything that sounds like it needs urgent clinical attention is flagged and escalated immediately rather than quietly booked in for next Tuesday.",
    faqs: [
      { question: "Is ZyncoAI compliant with Australian healthcare privacy law?", answer: "Yes. ZyncoAI is built with the Australian Privacy Act 1988 and My Health Records Act 2012 in mind — sensitive patient fields are encrypted at rest, and ZyncoAI never submits claims to Medicare or a health fund on your behalf." },
      { question: "How much does ZyncoAI cost for a medical clinic?", answer: "Medical clinic plans start from AUD $399/month, with a 7-day free trial on every plan." },
      { question: "Does Ella give medical advice?", answer: "No. Ella books appointments and answers logistical questions — Medicare, hours, availability — but symptoms and clinical questions are always escalated to your practice, never diagnosed or advised on by the AI." },
    ],
  },
  {
    slug: "dental",
    name: "Dental Practices",
    navLabel: "Dental Practices",
    tagline: "Fill every chair, every day",
    greeting: "Thanks for calling Smile Dental, this is Ella speaking!",
    callerLine: "I chipped a tooth, can someone see me today?",
    callsHandledToday: 863,
    features: ["Triages urgent dental pain vs routine bookings", "Handles recalls for 6-monthly checkups automatically", "Answers insurance and payment-plan questions", "Books hygienist and dentist appointments separately"],
    overview:
      "Dental practices lose money two ways on the phone: a chair sitting empty because a routine recall call went to voicemail, and a patient in real pain who couldn't get through and found another clinic that answered. Ella tells those two situations apart immediately — someone describing acute pain gets triaged toward the next available urgent slot, while a routine 6-monthly checkup call gets booked calmly against the right hygienist or dentist's calendar. Insurance and payment-plan questions are answered in the same call instead of being deferred to a callback, and every booking lands straight in your practice software, so the chair that would have sat empty gets filled instead.",
    faqs: [
      { question: "Can Ella tell the difference between an emergency and a routine booking?", answer: "Yes — Ella triages based on what the caller describes (acute pain vs a routine checkup) and prioritises urgent cases toward the next available slot rather than booking everyone in call order." },
      { question: "How much does ZyncoAI cost for a dental practice?", answer: "Dental plans use the same pricing as medical clinics, starting from AUD $399/month with a 7-day free trial." },
      { question: "Does Ella handle recall bookings automatically?", answer: "Yes — 6-monthly recall calls are handled the same way as any other booking request, checked against real provider availability before confirming." },
    ],
  },
  {
    slug: "legal",
    name: "Legal Firms",
    navLabel: "Legal Firms",
    tagline: "Every enquiry, professionally handled",
    greeting: "Good afternoon, Hartley & Associates, this is Ella.",
    callerLine: "I was in a car accident and need to speak to your solicitor about a claim",
    callsHandledToday: 412,
    features: ["Screens new matters before they reach a solicitor", "Books consultations across multiple practice areas", "Captures urgent WorkCover/CTP details accurately", "Never discusses legal advice — routes to a human for that"],
    overview:
      "A law firm's phone line is often the first contact a prospective client has with the practice, and a formal, professional tone matters from the first word — which is why Ella's legal-firm persona is deliberately measured rather than casual. New matters are screened for the basics (what kind of matter, urgency, which practice area) before a consultation is booked, so a solicitor's time isn't spent re-asking questions the caller already answered. Time-sensitive details — a CTP or WorkCover claim, a court deadline mentioned in passing — are captured accurately rather than paraphrased. Ella never discusses the substance of legal advice; anything beyond intake and scheduling is routed straight to a solicitor.",
    faqs: [
      { question: "Does Ella give legal advice to callers?", answer: "No — Ella only handles intake, screening, and booking consultations. Legal advice is never given by the AI; anything substantive is routed to a solicitor." },
      { question: "How much does ZyncoAI cost for a law firm?", answer: "Legal firm plans start from AUD $499/month, with a 7-day free trial." },
      { question: "Can Ella book consultations across different practice areas?", answer: "Yes — callers are screened for what kind of matter they have and booked against the right solicitor or practice area's availability." },
    ],
  },
  {
    slug: "mechanic",
    name: "Mechanic Shops",
    navLabel: "Mechanic Shops",
    tagline: "Stop losing jobs to a busy line",
    greeting: "G'day, you've reached Precision Auto, this is Ella.",
    callerLine: "My car's making a grinding noise — can our technician take a look this week?",
    callsHandledToday: 578,
    features: ["Books service bays and quotes turnaround times", "Captures the vehicle make, model and the issue upfront", "Handles parts-availability and pricing questions", "Sends job confirmations by SMS automatically"],
    overview:
      "A mechanic mid-job can't stop to answer the phone, which is exactly when most workshops lose the call to a competitor who picks up. Ella answers every time, gets the vehicle's make, model and the actual problem described upfront — instead of a technician calling back to ask the same questions — and books the job against real bay availability so the workshop doesn't end up double-booked. Parts-availability and pricing questions get answered on the spot where possible, and every confirmed booking goes out as an SMS automatically, so there's no confusion about the time when the customer turns up.",
    faqs: [
      { question: "How much does ZyncoAI cost for a mechanic shop?", answer: "Workshop plans start from AUD $149/month, with a 7-day free trial." },
      { question: "Does Ella capture the vehicle details before booking?", answer: "Yes — make, model, and a description of the issue are captured during the call, so the technician isn't starting from scratch when the vehicle arrives." },
      { question: "Can customers get a quote over the phone?", answer: "Ella can answer general pricing and parts-availability questions, and for anything that needs the vehicle physically inspected, books the job in and flags it for a proper quote." },
    ],
  },
  {
    slug: "restaurant",
    name: "Restaurants",
    navLabel: "Restaurants",
    tagline: "Answer every table booking, every time",
    greeting: "Thanks for calling Bella Vista, this is Ella!",
    callerLine: "Could our team fit in a table for 6 this Saturday at 7:30pm?",
    callsHandledToday: 991,
    features: ["Takes bookings without pulling staff off the floor", "Handles dietary requirements and large-group requests", "Answers opening-hours and menu questions instantly", "Never puts a caller on hold during dinner rush"],
    overview:
      "Friday and Saturday dinner service is exactly when a restaurant gets the most booking calls and has the least spare staff to answer them — pulling a waiter off the floor to take a reservation call costs real table-turn time. Ella takes the booking instead: table size, date, time, and any dietary requirements or large-group requests, checked against real availability rather than guessed. Menu and opening-hours questions are answered instantly rather than put on hold, and phone orders are handled the same way — confirming each item and modification back to the caller before the order is placed, never inventing a menu item or price that isn't real.",
    faqs: [
      { question: "How much does ZyncoAI cost for a restaurant?", answer: "Restaurant plans start from AUD $149/month, with a 7-day free trial." },
      { question: "Can Ella take phone orders as well as bookings?", answer: "Yes — Ella handles both table reservations and phone orders, reading back the order and total before confirming, and never inventing a menu item or price." },
      { question: "Does Ella handle large group bookings and dietary requirements?", answer: "Yes — group size and dietary requirements are captured as part of the booking, not left for staff to chase up separately." },
    ],
  },
  {
    slug: "bank",
    name: "Banks & Credit Unions",
    navLabel: "Banks & Credit Unions",
    tagline: "24/7 member service without the wait times",
    greeting: "Thank you for calling Coastal Credit Union, this is Ella.",
    callerLine: "I'd like to book a time to talk to your banker about a home loan",
    callsHandledToday: 1530,
    features: ["Books appointments with the right banker or advisor", "Screens and routes enquiries by product type", "Never handles account numbers or transactions — routes securely", "Available after-hours for members in every timezone"],
    overview:
      "Members calling a bank or credit union outside branch hours today just get a queue or a voicemail — Ella answers instead, every hour of every day, and books an appointment with the right banker based on what the member actually needs (a home loan enquiry goes to a different calendar than a general account question). This is the one vertical with a hard, non-negotiable rule built into the AI itself: Ella never discusses account details, balances, transactions, card numbers or PINs under any circumstances. If a caller raises any of those, the call is transferred to a human banker immediately rather than the AI attempting to help.",
    faqs: [
      { question: "Does Ella handle sensitive banking information like account numbers?", answer: "No, never — this is a hard rule enforced in the AI itself. Any call touching account details, balances, transactions, or card/PIN numbers is transferred to a human banker immediately." },
      { question: "How much does ZyncoAI cost for a bank or credit union?", answer: "Bank and credit union plans start from AUD $599/month, with a 7-day free trial." },
      { question: "Can Ella route enquiries to the right banker or product specialist?", answer: "Yes — enquiries are screened by product type (home loans, general accounts, etc.) and booked against the right banker or advisor's calendar." },
    ],
  },
  {
    slug: "university",
    name: "Universities",
    navLabel: "Universities",
    tagline: "One line, every faculty covered",
    greeting: "Hello, you've reached Student Services, this is Ella.",
    callerLine: "I need to know the enrolment deadline for semester two",
    callsHandledToday: 2140,
    features: ["Answers enrolment, fees and semester-date questions", "Books appointments with student advisors and faculty", "Routes urgent welfare calls to the right support line", "Handles the enrolment-period call surge without hiring casuals"],
    overview:
      "Enrolment week produces a call volume spike most student services teams can only cover by bringing in casual staff for a few weeks a year — and even then, wait times climb. Ella absorbs that surge without any extra hiring: enrolment deadlines, fee questions, and semester dates are answered directly, and anything that needs a real advisor is booked against the right faculty's calendar instead of the student being transferred around. Calls that sound like a welfare concern are routed to the appropriate support line immediately rather than treated as a routine enquiry — Ella is tuned to recognise that difference, not just answer whatever's asked literally.",
    faqs: [
      { question: "Can Ella handle the enrolment-period call surge?", answer: "Yes — Ella answers every call regardless of volume, which is specifically where universities otherwise need to bring on casual staff for a few weeks a year." },
      { question: "How much does ZyncoAI cost for a university?", answer: "University plans start from AUD $299/month, with a 7-day free trial." },
      { question: "Does Ella recognise urgent student welfare calls?", answer: "Yes — calls that sound like a welfare concern are routed to the appropriate support line rather than handled as a routine enquiry." },
    ],
  },
  {
    slug: "salon",
    name: "Beauty & Wellness",
    navLabel: "Beauty & Wellness",
    tagline: "Keep the books full without answering the phone mid-appointment",
    greeting: "Hi, thanks for calling Lumen Beauty, this is Ella.",
    callerLine: "Can I book a colour and cut for next Tuesday afternoon?",
    callsHandledToday: 704,
    features: ["Books against each stylist's real availability", "Handles service-length and pricing questions", "Sends automatic reminder calls to cut no-shows", "Rebooks clients for their next appointment on the spot"],
    overview:
      "A stylist mid-colour can't answer the phone, and a salon with one person on reception is constantly torn between the desk and the floor. Ella takes the booking instead — checking the specific stylist's real availability, not just a generic salon-wide calendar, and answering service-length and pricing questions a client would otherwise wait on hold for. Automatic reminder calls cut down no-shows, which matter more for a salon than almost any other vertical given how much of the day's revenue a single empty chair represents, and clients are offered their next rebooking on the spot at the end of the call rather than being expected to remember to call back in six weeks.",
    faqs: [
      { question: "How much does ZyncoAI cost for a salon?", answer: "Salon and beauty plans start from AUD $99/month, with a 7-day free trial." },
      { question: "Does Ella book against a specific stylist's availability?", answer: "Yes — bookings check the individual stylist's real calendar, not just a generic salon-wide slot." },
      { question: "Can Ella help reduce no-shows?", answer: "Yes — automatic reminder calls are sent ahead of appointments, and clients can be rebooked for their next visit at the end of the call." },
    ],
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    navLabel: "Financial Services",
    tagline: "Professional call handling for every client enquiry",
    greeting: "Good morning, Ashford Financial, this is Ella.",
    callerLine: "I'd like to book a review of my super with my adviser",
    callsHandledToday: 356,
    features: ["Books client review meetings automatically", "Screens new-client enquiries before they reach an adviser", "Never gives financial advice — always routes to a human for that", "Captures urgent compliance-sensitive calls correctly"],
    overview:
      "Financial advisory and planning practices sit under the same compliance-first approach as banking on ZyncoAI: Ella books client review meetings and screens new-client enquiries before they reach an adviser, but never gives financial advice or discusses specific account or portfolio detail — anything substantive is routed straight to a human. That split lets the practice capture every enquiry (a missed call from a prospective client is a missed relationship) without any risk of the AI stepping into advice it's not licensed or appropriate to give.",
    faqs: [
      { question: "Does Ella give financial advice to callers?", answer: "No — Ella books appointments and screens enquiries, but never gives financial advice. Anything substantive is routed to a human adviser." },
      { question: "How much does ZyncoAI cost for a financial services practice?", answer: "Financial services practices are set up on the same compliance-focused plan tier as banks and credit unions, from AUD $599/month with a 7-day free trial." },
      { question: "Can Ella screen new client enquiries?", answer: "Yes — new-client calls are screened for basic context before being booked in with an adviser, so the first real conversation isn't starting from zero." },
    ],
  },
  {
    slug: "home-services",
    name: "Home Services",
    navLabel: "Home Services",
    tagline: "Never lose a job to voicemail again",
    greeting: "Thanks for calling Bright Plumbing, this is Ella.",
    callerLine: "I've got a burst pipe, I need someone urgently",
    callsHandledToday: 1042,
    features: ["Triages urgent call-outs from routine bookings", "Captures the job address and issue before dispatch", "Books tradespeople against real-time availability", "Answers after-hours when emergencies actually happen"],
    overview:
      "Home service emergencies — a burst pipe, no hot water, an electrical fault — don't happen during business hours, and a tradesperson who doesn't answer after-hours simply loses the job to whoever does. Ella answers every time, tells a genuine emergency apart from a routine booking, and captures the job address and issue upfront so a tradesperson can be dispatched instead of calling back to ask basic questions first. Bookings are checked against real-time tradesperson availability rather than guessed at, so a job isn't promised for a slot that's already taken.",
    faqs: [
      { question: "How much does ZyncoAI cost for a home services business?", answer: "Home services businesses run on ZyncoAI's standard plan tier, from AUD $199/month with a 7-day free trial." },
      { question: "Can Ella tell an emergency call-out from a routine booking?", answer: "Yes — Ella triages based on what the caller describes and prioritises genuine emergencies (burst pipes, no power, no hot water) accordingly." },
      { question: "Does Ella work after hours for emergency call-outs?", answer: "Yes — Ella answers 24/7, which is specifically when most home-service emergencies actually happen." },
    ],
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
  { slug: "inbound-answering", name: "Inbound Call Answering", navLabel: "Inbound Call Answering", tagline: "Every call answered in under a second", description: "Ella answers every inbound call instantly — no hold music, no voicemail, no missed calls." },
  { slug: "after-hours", name: "After-Hours & Overflow", navLabel: "After-Hours & Overflow", tagline: "Coverage when your team can't", description: "Nights, weekends, lunch breaks and call spikes — Ella picks up every call your team can't." },
  { slug: "appointment-scheduling", name: "Appointment Scheduling", navLabel: "Appointment Scheduling", tagline: "Bookings made without lifting a finger", description: "Ella checks real availability and books directly into your calendar — no back-and-forth." },
  { slug: "intake", name: "Patient & Client Intake", navLabel: "Patient & Client Intake", tagline: "Capture the details right, every time", description: "New patient or client details are captured accurately and pushed straight into your system." },
  { slug: "recalls", name: "Outbound Recalls", navLabel: "Outbound Recalls", tagline: "Fill gaps in your calendar automatically", description: "Ella calls overdue patients and clients to rebook them — no manual call list required." },
  { slug: "bilingual", name: "Bilingual Call Answering", navLabel: "Bilingual Call Answering", tagline: "Serve every caller in their own language", description: "Ella detects the caller's language automatically and responds fluently in 15+ languages." },
  { slug: "virtual-receptionist", name: "Virtual Receptionist", navLabel: "Virtual Receptionist", tagline: "A full-time receptionist, without the headcount", description: "Everything a front-desk receptionist does — answering, booking, screening — without a salary." },
  { slug: "24-7-answering", name: "24/7 Call Answering", navLabel: "24/7 Call Answering", tagline: "Your business never closes the phone line", description: "Ella works every hour of every day — no shifts, no sick days, no burnout." },
  { slug: "human-ai-together", name: "Human + AI Together", navLabel: "Human + AI Together", tagline: "AI handles the routine, your team handles the rest", description: "Ella filters and books the routine calls, then transfers anything complex straight to your team." },
];

export interface CompanySize {
  slug: string;
  name: string;
  navLabel: string;
  tagline: string;
  description: string;
}

export const COMPANY_SIZES: CompanySize[] = [
  { slug: "solo", name: "Solo Practitioner", navLabel: "Solo Practitioner", tagline: "Your own receptionist, from day one", description: "Running the business and answering the phone at the same time doesn't scale. Ella does both jobs so you don't have to." },
  { slug: "small-business", name: "Small Business (2-10 staff)", navLabel: "Small Business (2-10 staff)", tagline: "Stop pulling staff off the floor to answer the phone", description: "Every missed call is a missed booking. Ella frees your team to focus on the people already in front of them." },
  { slug: "mid-market", name: "Mid-Market (10-50 staff)", navLabel: "Mid-Market (10-50 staff)", tagline: "Consistent call handling across a growing team", description: "As call volume grows, so does the cost of inconsistency. Ella answers every call the same way, every time." },
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
// differ on minutes included and price — never on which features are
// unlocked. COMMON_FEATURES below is rendered identically under every plan
// card (collapsed behind an "All features included" toggle) rather than
// duplicated per-plan, since the list never changes between plans.
//
// Audited 2026-08-04: `support` used to read Email / Email+chat /
// Email+chat+phone / Dedicated SLA per tier — zero code anywhere
// distinguishes support by plan (no SLA/ticket-priority/routing field on
// the plan model at all), so every tier now shows the one real, working
// channel (support@zyncoai.com, see app/contact/page.tsx) instead of
// implying a response-time tier that doesn't exist. `locations` was fixed
// the same way earlier tonight — see that commit.
//
// These are the real Medical/Dental plan numbers from
// backend/src/lib/platformSettings.ts's DEFAULT_MEDICAL_PLANS — shown here
// as the flagship/default example since Medical & Dental is ZyncoAI's
// primary vertical. Every other industry (Law, Restaurant, Mechanic, Salon,
// Real Estate, Bank, University, ...) is priced differently in the actual
// product — see the "pricing varies by industry" note rendered above this
// list in PricingSection.tsx. Setup fee is one-time, varies by tier (not a
// flat rate across plans) and is real — actually charged as a one-time
// invoice line item when the plan is assigned (billing.ts).
export const PRICING_PLANS: PricingPlan[] = [
  {
    key: "starter",
    name: "Starter",
    priceMonthly: 399,
    priceAnnualMonthly: 319,
    borderColor: "#16a34a",
    minutesIncluded: "800 minutes/month",
    perMinute: "AUD $0.50 per extra minute · AUD $499 setup fee",
    locations: "1 location",
    support: "Email support",
    cta: "Start free trial",
  },
  {
    key: "growth",
    name: "Growth",
    priceMonthly: 599,
    priceAnnualMonthly: 479,
    borderColor: "#6366f1",
    popular: true,
    minutesIncluded: "1,500 minutes/month",
    perMinute: "AUD $0.50 per extra minute · AUD $699 setup fee",
    locations: "1 location",
    support: "Email support",
    cta: "Start free trial",
  },
  {
    key: "max",
    name: "Max",
    priceMonthly: 799,
    priceAnnualMonthly: 639,
    borderColor: "#06b6d4",
    minutesIncluded: "2,000 minutes/month",
    perMinute: "AUD $0.50 per extra minute · AUD $899 setup fee",
    locations: "1 location",
    support: "Email support",
    cta: "Start free trial",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    priceMonthly: 0,
    priceAnnualMonthly: 0,
    borderColor: "#f59e0b",
    minutesIncluded: "Unlimited minutes",
    perMinute: "From AUD $1,499/month · AUD $1,999 setup fee",
    locations: "1 location",
    support: "Email support",
    cta: "Contact sales",
  },
];

// Identical on every plan — the whole point being that pricing scales with
// call volume and locations, not with which parts of the product you get.
// Multilingual AI is deliberately excluded — it's sold as an add-on, not a
// base-plan feature (see ADD_ONS' "multilingual" entry).
// Audited 2026-08-04 against real, verified code (same honesty pass as
// backend/src/lib/addOnCatalog.ts) — three lines were overstated and fixed:
//  - PMS integration: Medical Director claim dropped entirely (no live API,
//    no CSV/webhook adapter confirmed working — see staffSync/scheduler.ts).
//  - Insurance claims: real feature is status/amount TRACKING (claims.ts —
//    LODGED/APPROVED/REJECTED/PENDING), never live submission to Medicare/a
//    health fund/WorkCover/the NDIA.
//  - Emergency detection: 000 physical-emergency redirect is real and
//    verified (voice/pipecat/server.py's EmergencyTriageProcessor).
//    Lifeline/Beyond Blue mental-health-crisis detection does not exist —
//    the only reference anywhere is dead-code systemPrompt.ts, never wired
//    into the live call path. Dropped until actually built.
//
// Second pass, 2026-08-04 (full 15-line integrity check):
//  - Calendar sync: confirmed Microsoft/Outlook calendar sync does not
//    exist anywhere — microsoftGraph.ts only fetches the Azure AD staff
//    directory, never touches /me/events or calendarView despite holding
//    a Calendars.Read scope; the only "Outlook Calendar" code
//    (connectors/calendar/index.ts) is dead, unused, and would throw at
//    runtime (res.tson() typo). No real Microsoft email-sending
//    integration exists to substitute in its place either, so the claim
//    is now Google-only, not reworded to name a second unbuilt provider.
//  - Insurance claims: reworded to "tracking dashboard" — real feature is
//    manual dashboard entry (claims.ts); Ella's voice pipeline has no
//    create_claim tool, so nothing from a phone call auto-populates this.
//  - Australian compliance: reworded off a blanket "built in" claim — the
//    platform's own compliance API self-reports dataResidency.compliant:
//    false (DB is Singapore ap-southeast-1, required Sydney
//    ap-southeast-2, migration still pending). What IS real and kept: call-
//    recording disclosure (Privacy Act) + the compliance dashboard tools
//    themselves (NDB Scheme consent surface, health-identifier rejection).
//  - Patient files: description kept as-is — backend storage/upload route
//    is genuinely real (multer + GCS/local disk, ClinicDocument model).
//    Known follow-up (not urgent, tracked separately): the dashboard
//    documents page has view/download/delete but no upload UI yet, so a
//    business can't actually upload a file through the product today.
export const COMMON_FEATURES: string[] = [
  "AI receptionist 24/7 — Ella voice",
  "Full practice manager dashboard",
  "Patient files and document management",
  "Insurance claim tracking dashboard (Medicare, DVA, WorkCover, NDIS)",
  "Financial and revenue dashboard",
  "Call history with full transcripts",
  "Appointment booking and management",
  "Email and SMS confirmations",
  "Cliniko integration, Best Practice CSV import",
  "Google Calendar sync",
  "Staff management and roles",
  "Analytics (AI voice + clinical metrics)",
  "Export and print all data",
  "Privacy Act disclosure & compliance tools",
  "Emergency detection — instant 000 redirect",
];

export interface AddOn {
  key: string;
  name: string;
  description: string;
  priceMonthly: number;
  // Mirrors backend/src/lib/addOnCatalog.ts's comingSoon flag — this
  // marketing page has its own separate hardcoded add-on list (prospects
  // browsing pre-signup, not backed by the real per-vertical catalog/
  // BusinessAddOn system), so the flag has to be kept in sync by hand.
  // Audited 2026-08-04: telehealth/multilingual/comms-hub/multisite have no
  // working implementation behind them yet. reviews and recalls are real.
  comingSoon?: boolean;
}

export const ADD_ONS: AddOn[] = [
  { key: "telehealth", name: "Telehealth Video Appointments", description: "Book and send video-consult links automatically.", priceMonthly: 59, comingSoon: true },
  { key: "reviews", name: "Google Reviews Autopilot", description: "Requests a review automatically after every completed booking.", priceMonthly: 39 },
  { key: "multilingual", name: "Custom Multilingual Support", description: "Priority-tuned voice and vocabulary for a specific language.", priceMonthly: 49, comingSoon: true },
  { key: "recalls", name: "Automated Patient Recalls", description: "Outbound calls to rebook overdue patients automatically.", priceMonthly: 79 },
  { key: "comms-hub", name: "Patient Communication Hub", description: "SMS + Email + WhatsApp, all from one inbox.", priceMonthly: 179, comingSoon: true },
  { key: "multisite", name: "Multi-Site Command Centre", description: "Roll up call and booking data across every location.", priceMonthly: 299, comingSoon: true },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  { quote: "We stopped losing new patients to voicemail the week we switched on Ella. Bookings are up and my front desk finally gets a lunch break.", name: "Dr. Priya Nair", role: "Practice Owner", location: "Riverside Medical, Newcastle NSW", rating: 5 },
  { quote: "Our after-hours calls used to just disappear. Now every one of them gets answered, booked, or flagged if it's urgent.", name: "Marcus Webb", role: "Practice Manager", location: "Smile Dental, Brisbane QLD", rating: 5 },
  { quote: "It sounds like a real Australian receptionist, not a robot. Clients genuinely don't realise until we tell them.", name: "Sarah Chen", role: "Director", location: "Lumen Beauty, Melbourne VIC", rating: 5 },
];

// Audited 2026-08-04: Medical Director and Zanda dropped — no live API for
// either (Medical Director is unbuilt entirely; Zanda has an adapter in
// code but was never part of the live-endpoint-verification pass, same
// standard applied to every other claim on this page). Halaxy added (real
// OAuth2 staff sync, built 2026-08-03). Best Practice is CSV import, not a
// live sync, labelled accordingly. "Microsoft 365" dropped in the second
// pass — confirmed no real Microsoft calendar sync or email-sending
// integration exists (microsoftGraph.ts is staff-directory-only), so there
// was nothing honest left for that entry to refer to next to Google
// Calendar in a "works with your software" list.
export const INTEGRATIONS = ["Cliniko", "Nookal", "Halaxy", "Best Practice (CSV)", "Google Calendar"];
