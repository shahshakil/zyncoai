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
  features: string[];
  // A real paragraph of unique body copy, not just bullet points — SEO
  // aside, a bare feature-bullet page reads as thin to a human too.
  overview: string;
  faqs: IndustryFaq[];
  // 2026-08-15 richer-vertical-page pass. Each pain point maps to a REAL
  // feature already listed above (or a real platform capability) — never a
  // problem invented to justify a feature, and never a feature invented to
  // answer a problem. Three per industry, matching the brief.
  painPoints: { problem: string; solution: string }[];
  // Role-based use cases — real job titles for this vertical, each paired
  // with what Ella/the dashboard actually does for that role (not a
  // generic "saves time" line repeated with a different job title).
  roles: { role: string; description: string }[];
  // 2026-08-16 — vertical-appropriate sample-data LABELS for the
  // "See it live" dashboard preview (LiveDashboardScene). The preview
  // itself is unchanged real UI (Card/CountUp/BookingCard primitives,
  // still stamped "Simulated preview — sample data") — only the words on
  // it change per vertical, and every label is grounded in that
  // industry's real `features` above (booking noun + real distinct
  // second capability where one exists, e.g. restaurants really do take
  // phone orders separately from table bookings — see the
  // restaurant_order_lost alert rule and RESTAURANT's real features).
  // recordNoun is the singular noun used in the scripted live-feed rows
  // ("Booked <noun>") and the booking-card label ("New <noun>").
  dashboardPreview: { stat1Label: string; stat2Label: string; recordNoun: string };
  // Which real Vertical enum + integrations-catalog key this industry maps
  // to (see INDUSTRY_VERTICAL_MAP below) — kept per-industry so a new
  // Industry entry can't forget to wire it up.
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Medical",
    navLabel: "Healthcare & Medical",
    tagline: "Never miss a patient call again",
    greeting: "Good morning, thanks for calling — this is Ella, how can I help?",
    callerLine: "Hi, I need to book in with Dr Johnson for a check-up",
    features: ["Books appointments against real provider calendars", "Understands Medicare, private health, DVA and WorkCover questions", "Flags emergency symptoms and escalates instantly", "Syncs with Cliniko, plus CSV import for Best Practice"],
    painPoints: [
      { problem: "Reception can only take one call at a time, so overlapping calls during a busy morning go to voicemail.", solution: "Ella answers every call simultaneously — no queue, no voicemail, ever." },
      { problem: "A caller unsure if Medicare or their private health fund covers a service often gets put on hold while staff check.", solution: "Ella answers Medicare, private health, DVA and WorkCover questions directly, in the same call." },
      { problem: "A symptom that actually needs urgent attention can get quietly booked in for \"next Tuesday\" by an overloaded desk.", solution: "Anything that sounds like it needs urgent clinical attention is flagged and escalated instantly, not just booked." },
    ],
    roles: [
      { role: "Practice Manager", description: "Sees every call, booking, and escalation in one dashboard instead of chasing reception staff for a verbal handover." },
      { role: "GP / Practice Owner", description: "Never loses a new-patient enquiry to a competing clinic that happened to pick up first." },
      { role: "Front Desk / Reception", description: "Ella absorbs the overlapping-call load so reception can focus on the patient standing in front of them." },
    ],
    dashboardPreview: { stat1Label: "Appointments Booked", stat2Label: "Calls Answered Today", recordNoun: "appointment" },
    overview:
      "A medical clinic's phone line carries genuine urgency — a parent calling about a sick child, a patient chasing test results, someone trying to book before symptoms get worse. Every one of those calls competing for the same one or two reception staff means some of them go to voicemail, and a caller who hits voicemail when they're worried rarely leaves a message; they just call the next clinic. Ella answers every single call instantly, day or night, and checks each provider's real calendar before offering a time, so there's no double-booking and no back-and-forth. Medicare, private health fund, DVA and WorkCover questions are handled in the same conversation, and anything that sounds like it needs urgent clinical attention is flagged and escalated immediately rather than quietly booked in for next Tuesday.",
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
    features: ["Triages urgent dental pain vs routine bookings", "Handles recalls for 6-monthly checkups automatically", "Answers insurance and payment-plan questions", "Books hygienist and dentist appointments separately"],
    painPoints: [
      { problem: "A routine 6-monthly recall call going to voicemail means an empty chair that never gets rebooked.", solution: "Recall calls are handled the same as any booking request, checked against real hygienist/dentist availability." },
      { problem: "A patient in real pain who can't get through calls the next clinic instead.", solution: "Ella triages acute pain toward the next available urgent slot, immediately." },
      { problem: "Insurance and payment-plan questions get deferred to a callback, slowing the booking down.", solution: "Insurance and payment-plan questions are answered in the same call, not deferred." },
    ],
    roles: [
      { role: "Practice Manager", description: "Tracks recall and no-show patterns across the whole practice from one dashboard instead of a paper recall list." },
      { role: "Principal Dentist", description: "Keeps chairs filled without personally fielding routine booking calls between patients." },
      { role: "Front Desk", description: "Hands off routine recall and booking calls to Ella, freeing time for patients physically in the practice." },
    ],
    dashboardPreview: { stat1Label: "Appointments Booked", stat2Label: "Calls Answered Today", recordNoun: "appointment" },
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
    features: ["Screens new matters before they reach a solicitor", "Books consultations across multiple practice areas", "Captures urgent WorkCover/CTP details accurately", "Never discusses legal advice — routes to a human for that"],
    painPoints: [
      { problem: "A prospective client's first call is often the only chance to capture a new matter — an unanswered call is a lost client.", solution: "Ella answers every enquiry and screens the basics (matter type, urgency, practice area) before booking a consultation." },
      { problem: "Solicitors lose billable time re-asking questions the caller already answered on intake.", solution: "New matters are screened up front, so the first real conversation isn't starting from zero." },
      { problem: "A time-sensitive detail — a CTP/WorkCover claim, a deadline mentioned in passing — gets lost in a rushed phone note.", solution: "Time-sensitive details are captured accurately, not paraphrased from memory." },
    ],
    roles: [
      { role: "Practice Manager", description: "Sees every new-matter enquiry and its screening detail in one place instead of relying on handwritten phone messages." },
      { role: "Principal / Partner", description: "Never loses a new client relationship to a firm that happened to answer first." },
      { role: "Front Desk / Legal Secretary", description: "Consultations arrive pre-screened and booked against the right solicitor's calendar, not routed by guesswork." },
    ],
    dashboardPreview: { stat1Label: "Consultations Booked", stat2Label: "New Matters Screened", recordNoun: "consultation" },
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
    features: ["Books service bays and quotes turnaround times", "Captures the vehicle make, model and the issue upfront", "Handles parts-availability and pricing questions", "Sends job confirmations by SMS automatically"],
    painPoints: [
      { problem: "A mechanic mid-job can't stop to answer the phone, so the call goes to whichever workshop does pick up.", solution: "Ella answers every time, even while your whole team is under a car." },
      { problem: "A technician calls a customer back just to ask the make, model and issue a second time.", solution: "Vehicle make, model and the actual problem are captured upfront, on the call." },
      { problem: "Double-booked bays because bookings weren't checked against real availability.", solution: "Jobs are booked against real bay availability, not guessed." },
    ],
    roles: [
      { role: "Workshop Manager", description: "Sees every booked job and its captured vehicle details before the car even arrives." },
      { role: "Shop Owner", description: "Stops losing jobs to a competitor's busy line during peak hours." },
      { role: "Service Advisor / Front Desk", description: "Confirmations go out by SMS automatically, cutting down \"what time was my booking again\" calls." },
    ],
    dashboardPreview: { stat1Label: "Jobs Booked", stat2Label: "Calls Answered Today", recordNoun: "job" },
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
    features: ["Takes bookings without pulling staff off the floor", "Handles dietary requirements and large-group requests", "Answers opening-hours and menu questions instantly", "Never puts a caller on hold during dinner rush"],
    painPoints: [
      { problem: "Friday/Saturday dinner service is exactly when booking calls peak and staff are least free to answer them.", solution: "Ella takes the booking without pulling a waiter off the floor." },
      { problem: "A phone order can misquote a price or invent a menu item that doesn't exist.", solution: "Every item and modification is read back and confirmed before the order is placed — never an invented item or price." },
      { problem: "Large-group and dietary-requirement requests get left for staff to chase up separately.", solution: "Group size and dietary requirements are captured as part of the booking itself." },
    ],
    roles: [
      { role: "Venue Manager", description: "Reviews every booking and phone order in one place instead of scattered handwritten notes by the till." },
      { role: "Owner", description: "Keeps tables and phone orders full during dinner rush without adding phone-answering headcount." },
      { role: "Front of House", description: "Ella absorbs the booking-call load during service so staff stay on the floor." },
    ],
    dashboardPreview: { stat1Label: "Tables Booked", stat2Label: "Orders Taken", recordNoun: "table" },
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
    features: ["Books appointments with the right banker or advisor", "Screens and routes enquiries by product type", "Never handles account numbers or transactions — routes securely", "Available after-hours for members in every timezone"],
    painPoints: [
      { problem: "Members calling outside branch hours get a queue or a voicemail today.", solution: "Ella answers 24/7 and books an appointment with the right banker based on what the member actually needs." },
      { problem: "A home-loan enquiry and a general account question need different specialists, but often get routed the same way.", solution: "Enquiries are screened by product type and booked against the right banker or advisor's calendar." },
      { problem: "Any AI touching account numbers, balances or PINs would be an unacceptable risk.", solution: "Ella never discusses account details, balances, transactions or card/PIN numbers — any of those, the call transfers to a human banker immediately, a hard rule enforced in the AI itself." },
    ],
    roles: [
      { role: "Branch / Operations Manager", description: "After-hours member enquiries are booked and routed by product type, visible in one dashboard the next morning." },
      { role: "Member / Business Owner", description: "Captures every after-hours enquiry that would otherwise just be a missed call." },
      { role: "Banker / Advisor", description: "Appointments arrive pre-screened by product type, not routed by guesswork." },
    ],
    dashboardPreview: { stat1Label: "Meetings Booked", stat2Label: "Calls Answered Today", recordNoun: "meeting" },
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
    features: ["Answers enrolment, fees and semester-date questions", "Books appointments with student advisors and faculty", "Routes urgent welfare calls to the right support line", "Handles the enrolment-period call surge without hiring casuals"],
    painPoints: [
      { problem: "Enrolment week produces a call spike most teams can only cover by hiring casual staff for a few weeks a year.", solution: "Ella absorbs the surge without any extra hiring — every call answered, regardless of volume." },
      { problem: "Students get transferred around because reception doesn't know which faculty handles their question.", solution: "Anything needing a real advisor is booked directly against the right faculty's calendar." },
      { problem: "A genuine student welfare concern can get treated as a routine enquiry by an overloaded line.", solution: "Calls that sound like a welfare concern are routed to the appropriate support line immediately, not queued as routine." },
    ],
    roles: [
      { role: "Student Services Manager", description: "Enrolment-week volume is absorbed automatically instead of needing a casual-staff hiring push every year." },
      { role: "Faculty Administrator", description: "Advisor bookings land directly on the right faculty's calendar, not transferred in from a generic switchboard." },
      { role: "Front-Line Student Services Staff", description: "Routine deadline and fee questions are answered directly, freeing staff for enquiries that actually need a person." },
    ],
    dashboardPreview: { stat1Label: "Advisor Appointments", stat2Label: "Calls Answered Today", recordNoun: "appointment" },
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
    features: ["Books against each stylist's real availability", "Handles service-length and pricing questions", "Sends automatic reminder calls to cut no-shows", "Rebooks clients for their next appointment on the spot"],
    painPoints: [
      { problem: "A stylist mid-colour can't answer the phone, and a one-person reception desk is constantly torn between the desk and the floor.", solution: "Ella takes the booking instead, checking the specific stylist's real availability." },
      { problem: "No-shows cost more in a salon than almost any other vertical, given how much of the day's revenue one empty chair represents.", solution: "Automatic reminder calls are sent ahead of appointments to cut down no-shows." },
      { problem: "Clients forget to rebook their next appointment and the chair sits empty six weeks later.", solution: "Clients are offered their next rebooking on the spot, at the end of the call." },
    ],
    roles: [
      { role: "Salon Manager", description: "Sees stylist-level bookings and no-show trends in one dashboard instead of a paper appointment book." },
      { role: "Salon Owner", description: "Keeps chairs filled without a dedicated full-time reception hire." },
      { role: "Stylist / Front Desk", description: "Bookings check each stylist's own calendar, not a generic salon-wide slot guessed at by whoever answers." },
    ],
    dashboardPreview: { stat1Label: "Appointments Booked", stat2Label: "Calls Answered Today", recordNoun: "appointment" },
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
    features: ["Books client review meetings automatically", "Screens new-client enquiries before they reach an adviser", "Never gives financial advice — always routes to a human for that", "Captures urgent compliance-sensitive calls correctly"],
    painPoints: [
      { problem: "A missed call from a prospective client is a missed relationship — and advisers can't take calls mid-meeting.", solution: "Ella books client review meetings and screens new-client enquiries even when every adviser is unavailable." },
      { problem: "Any AI discussing specific account or portfolio detail would be a compliance risk this practice can't take.", solution: "Ella never gives financial advice or discusses account/portfolio detail — anything substantive routes straight to a human adviser." },
      { problem: "New-client calls often start from zero because nothing was captured before the first real conversation.", solution: "New-client enquiries are screened for basic context before being booked in with an adviser." },
    ],
    roles: [
      { role: "Practice Manager", description: "Every client review booking and new-enquiry screening note lands in one dashboard, not a phone-message pad." },
      { role: "Adviser / Practice Owner", description: "Captures every enquiry that would otherwise be a missed relationship, without any advice-compliance risk." },
      { role: "Front Desk / Client Services", description: "Client review meetings arrive pre-booked and screened, not routed by guesswork." },
    ],
    dashboardPreview: { stat1Label: "Client Meetings Booked", stat2Label: "Calls Answered Today", recordNoun: "meeting" },
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
    features: ["Triages urgent call-outs from routine bookings", "Captures the job address and issue before dispatch", "Books tradespeople against real-time availability", "Answers after-hours when emergencies actually happen"],
    painPoints: [
      { problem: "Home-service emergencies — a burst pipe, no hot water — don't happen during business hours, and after-hours calls usually just go unanswered.", solution: "Ella answers every time, day or night, and tells a genuine emergency apart from a routine booking." },
      { problem: "A tradesperson calls back just to ask the job address and issue a second time before they can dispatch anyone.", solution: "The job address and issue are captured upfront, so a tradesperson can be dispatched straight away." },
      { problem: "A job gets promised for a time slot that's already taken.", solution: "Bookings are checked against real-time tradesperson availability, not guessed at." },
    ],
    roles: [
      { role: "Office Manager / Dispatcher", description: "Every call-out is captured with address and issue detail before a tradesperson is even dispatched." },
      { role: "Owner / Tradesperson", description: "Stops losing after-hours emergency jobs to whoever else picks up the phone." },
      { role: "Front Desk / Booking Coordinator", description: "Routine bookings and genuine emergencies arrive already triaged, not mixed together in one queue." },
    ],
    dashboardPreview: { stat1Label: "Jobs Booked", stat2Label: "Calls Answered Today", recordNoun: "job" },
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
  { slug: "inbound-answering", name: "Inbound Call Answering", navLabel: "Inbound Call Answering", tagline: "Every call answered instantly, 24/7", description: "Ella answers every inbound call instantly — no hold music, no voicemail, no missed calls." },
  { slug: "after-hours", name: "After-Hours & Overflow", navLabel: "After-Hours & Overflow", tagline: "Coverage when your team can't", description: "Nights, weekends, lunch breaks and call spikes — Ella picks up every call your team can't." },
  { slug: "appointment-scheduling", name: "Appointment Scheduling", navLabel: "Appointment Scheduling", tagline: "Bookings made without lifting a finger", description: "Ella checks real availability and books directly into your calendar — no back-and-forth." },
  { slug: "intake", name: "Patient & Client Intake", navLabel: "Patient & Client Intake", tagline: "Capture the details right, every time", description: "New patient or client details are captured accurately and pushed straight into your system." },
  { slug: "recalls", name: "Outbound Recalls", navLabel: "Outbound Recalls", tagline: "Fill gaps in your calendar automatically", description: "Ella calls overdue patients and clients to rebook them — no manual call list required." },
  // "Bilingual Call Answering" removed 2026-08-17 — its "responds fluently
  // in 15+ languages" claim was false. The real voice pipeline's speech-to-
  // text is hardcoded to language="en-AU" (backend/src/voice/pipecat/
  // server.py), no detection/switching exists anywhere, and every
  // per-vertical "Custom Multilingual Support" add-on in addOnCatalog.ts is
  // explicitly comingSoon:true. Found while sourcing a truthful answer to
  // "what languages does ZyncoAI support" for the FAQ page.
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
  // 2026-08-15 — a service-level guarantee claim was removed here: no plan
  // carries one (our Terms explicitly offer none), so this line was
  // contradicting our own contract. Caught by
  // scripts/marketing-fabrication-check.mjs. Audit trails and at-scale
  // integrations are real (AdminAuditLog + the integrations catalog), so
  // those stay.
  { slug: "enterprise", name: "Enterprise (50+ staff)", navLabel: "Enterprise (50+ staff)", tagline: "Enterprise-grade call handling, fully auditable", description: "Reliable availability, full audit trails, and integrations built for scale — without a call-centre headcount." },
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
  // Numeric twin of minutesIncluded (null = unlimited) — lets derived
  // sitewide stats (e.g. the ROI calculator) compute real minute ranges
  // instead of parsing the display string.
  minutesIncludedRaw: number | null;
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
    minutesIncludedRaw: 800,
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
    minutesIncludedRaw: 1500,
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
    minutesIncludedRaw: 2000,
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
    minutesIncludedRaw: null,
    perMinute: "From AUD $1,499/month · AUD $1,999 setup fee",
    locations: "1 location",
    support: "Email support",
    cta: "Contact sales",
  },
];

// Derived, not hardcoded a second time — the exact bug this fixes (2026-08-05):
// marketing copy elsewhere on the site (final CTA, ROI comparison) had its own
// separate "$299/month" literal that drifted out of sync with PRICING_PLANS
// after Starter was repriced to $399. Enterprise's priceMonthly is 0 (custom/
// "Contact sales", not literally free) so it's excluded from the min.
export const CHEAPEST_PLAN_PRICE = Math.min(...PRICING_PLANS.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly));

export interface IndustryPricingGroup {
  slug: string;
  label: string;
  plans: PricingPlan[];
}

const TIER_STYLE: { key: string; borderColor: string; popular?: boolean; cta: string }[] = [
  { key: "starter", borderColor: "#16a34a", cta: "Start free trial" },
  { key: "growth", borderColor: "#6366f1", popular: true, cta: "Start free trial" },
  { key: "max", borderColor: "#06b6d4", cta: "Start free trial" },
  { key: "enterprise", borderColor: "#f59e0b", cta: "Contact sales" },
];

// 2026-08-05 — the pricing page used to only ever show Medical & Dental
// (PRICING_PLANS above), while the page's own <title>/meta claimed a
// $149/month price that belongs to Restaurant — a real number, just never
// surfaced anywhere a visitor could actually see it. These mirror
// backend/src/lib/platformSettings.ts's DEFAULT_*_PLANS tuples exactly
// ([tierName, priceCents, setupFeeCents, minuteAllowance]) — the same real
// numbers actually used to bill a business on that vertical, not invented
// for marketing. Manual mirror, not a live fetch, same approach the
// pre-existing Medical/Dental PRICING_PLANS above already used — if the
// backend defaults ever change, this needs a matching update here.
function buildIndustryPlans(prefix: string, overageCentsPerMinute: number, tiers: [string, number, number, number | null][]): PricingPlan[] {
  return tiers.map(([name, priceCents, setupFeeCents, minuteAllowance], i) => {
    const style = TIER_STYLE[i];
    const priceMonthly = minuteAllowance === null ? 0 : Math.round(priceCents / 100);
    return {
      // Matches backend/src/lib/platformSettings.ts's planGroup() key format
      // EXACTLY (`${prefix}_${name.toLowerCase()}`, using the tier's own
      // name) — not the fixed tier-position label from TIER_STYLE, which
      // would silently mismatch for a vertical whose 3rd tier isn't named
      // "Max" (Restaurant's is "Busy"). This key flows into /signup?plan=
      // and eventually business.manualPlan, which the backend looks up by
      // exact key match — a mismatched key here would silently fail to
      // resolve to a real plan.
      key: `${prefix}_${name.toLowerCase()}`,
      name,
      priceMonthly,
      priceAnnualMonthly: priceMonthly ? Math.floor(priceMonthly * 0.8) : 0,
      borderColor: style.borderColor,
      popular: style.popular,
      minutesIncluded: minuteAllowance === null ? "Unlimited minutes" : `${minuteAllowance.toLocaleString()} minutes/month`,
      minutesIncludedRaw: minuteAllowance,
      perMinute:
        minuteAllowance === null
          ? `From AUD $${Math.round(priceCents / 100).toLocaleString()}/month · AUD $${Math.round(setupFeeCents / 100).toLocaleString()} setup fee`
          : `AUD $${(overageCentsPerMinute / 100).toFixed(2)} per extra minute · AUD $${Math.round(setupFeeCents / 100)} setup fee`,
      locations: "1 location",
      support: "Email support",
      cta: style.cta,
    };
  });
}

export const INDUSTRY_PRICING: IndustryPricingGroup[] = [
  { slug: "medical", label: "Medical & Dental", plans: PRICING_PLANS },
  {
    slug: "restaurant",
    label: "Restaurant",
    plans: buildIndustryPlans("restaurant", 30, [
      ["Starter", 14900, 19900, 400],
      ["Growth", 24900, 29900, 600],
      ["Busy", 39900, 49900, 900],
      ["Enterprise", 69900, 99900, null],
    ]),
  },
  {
    slug: "mechanic",
    label: "Mechanic & Auto Shop",
    plans: buildIndustryPlans("mechanic", 30, [
      ["Starter", 19900, 19900, 400],
      ["Growth", 32900, 29900, 600],
      ["Max", 52900, 49900, 900],
      ["Enterprise", 92900, 99900, null],
    ]),
  },
  {
    slug: "salon",
    label: "Salon & Retail",
    plans: buildIndustryPlans("salon", 25, [
      ["Starter", 9900, 14900, 300],
      ["Growth", 19900, 19900, 600],
      ["Max", 29900, 29900, 900],
      ["Enterprise", 49900, 69900, null],
    ]),
  },
  {
    slug: "law",
    label: "Law",
    plans: buildIndustryPlans("law", 60, [
      ["Starter", 34900, 59900, 800],
      ["Growth", 48900, 79900, 1500],
      ["Max", 69900, 99900, 2000],
      ["Enterprise", 139900, 249900, null],
    ]),
  },
  {
    slug: "bank",
    label: "Banking & Finance",
    plans: buildIndustryPlans("bank", 60, [
      ["Starter", 39900, 69900, 800],
      ["Growth", 59900, 89900, 1500],
      ["Max", 86900, 129900, 2000],
      ["Enterprise", 166900, 299900, null],
    ]),
  },
  {
    slug: "realestate",
    label: "Real Estate",
    plans: buildIndustryPlans("realestate", 40, [
      ["Starter", 24900, 39900, 600],
      ["Growth", 41900, 49900, 1000],
      ["Max", 57900, 69900, 1500],
      ["Enterprise", 107900, 149900, null],
    ]),
  },
  {
    slug: "university",
    label: "University",
    plans: buildIndustryPlans("university", 40, [
      ["Starter", 49900, 39900, 600],
      ["Growth", 82900, 49900, 1000],
      ["Max", 116900, 69900, 1500],
      ["Enterprise", 166900, 99900, null],
    ]),
  },
];

// The real, true sitewide "from" price — Salon at $99/month, not Medical's
// $399 (the previous default tab) or the old stale $299 literal. Used by
// the pricing page's own <title>/meta so that claim can never drift from
// what a visitor can actually select and see again.
export const SITEWIDE_CHEAPEST_PLAN_PRICE = Math.min(
  ...INDUSTRY_PRICING.flatMap((g) => g.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly))
);

// 2026-08-15 — moved here from RoiSection.tsx (was a local const) so the
// new interactive per-vertical ROI calculator (InteractiveRoiCalculator.tsx)
// reads the exact same assumption instead of a second, driftable copy.
// The only figures on the ROI-related sections with no real source: a
// full-time receptionist's wage. Stated as a NAMED, on-screen assumption
// (typical Australian admin/reception award-wage range), never presented
// as fact — every other number in these sections is computed from real
// INDUSTRY_PRICING plan data.
export const TRADITIONAL_RECEPTIONIST_ANNUAL_LOW = 65000;
export const TRADITIONAL_RECEPTIONIST_ANNUAL_HIGH = 75000;

// Same real-data pattern as SITEWIDE_CHEAPEST_PLAN_PRICE, for the ROI
// calculator's "what a real plan actually costs" range — the $0
// custom/"Contact sales" Enterprise tiers are excluded the same way.
export const SITEWIDE_MOST_EXPENSIVE_PLAN_PRICE = Math.max(
  ...INDUSTRY_PRICING.flatMap((g) => g.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly))
);

// 2026-08-16 — homepage-level example call for ExampleCallScene.tsx. Every
// other use of that component (SolutionTemplate.tsx) shows the CURRENT
// vertical's real per-industry greeting/callerLine from INDUSTRIES above —
// the homepage isn't scoped to one vertical, so picking any single
// industry's script there would misrepresent the product as narrower than
// it is. This is genuinely generic phrasing (no industry-specific booking
// type, no named business), not a stand-in for a real transcript.
export const SITEWIDE_EXAMPLE_CALL = {
  greeting: "Thanks for calling, this is Ella — how can I help?",
  callerLine: "Hi, I'd like to book an appointment for later this week.",
};

// Real minute allowances across every metered plan (Enterprise's "Unlimited"
// tiers excluded, same as above) — used so the ROI calculator's minutes
// claim is pulled from plan-settings data instead of typed by hand.
const METERED_MINUTE_ALLOWANCES = INDUSTRY_PRICING.flatMap((g) =>
  g.plans.map((p) => p.minutesIncludedRaw).filter((m): m is number => m !== null)
);
export const SITEWIDE_MIN_MINUTES_INCLUDED = Math.min(...METERED_MINUTE_ALLOWANCES);
export const SITEWIDE_MAX_MINUTES_INCLUDED = Math.max(...METERED_MINUTE_ALLOWANCES);

// 2026-08-06 — INDUSTRIES.slug doesn't map 1:1 to INDUSTRY_PRICING.slug
// (dental/healthcare share MEDICAL's pricing, legal is named "law" in
// pricing, financial-services/home-services have no dedicated pricing
// group at all and are explicitly written as reusing another vertical's
// tier — "same compliance-focused plan tier as banks" / "standard plan
// tier" in their own overview copy below). This is that mapping, single
// source of truth for both SolutionTemplate's pricing-tab default and the
// FAQ-answer patch right below it.
export const INDUSTRY_PRICING_SLUG_MAP: Record<string, string> = {
  healthcare: "medical",
  dental: "medical",
  legal: "law",
  mechanic: "mechanic",
  restaurant: "restaurant",
  bank: "bank",
  university: "university",
  salon: "salon",
  "financial-services": "bank",
  "home-services": "mechanic",
};

// 2026-08-17 — five of ten industries' hardcoded "How much does ZyncoAI
// cost for a X?" FAQ answers had drifted out of sync with the real
// INDUSTRY_PRICING numbers (found while sourcing a real price for a new
// blog post): Legal claimed $499 (real: $349), Mechanic claimed $149
// (real: $199), Bank claimed $599 (real: $399), University claimed $299
// (real: $499), and Financial Services inherited Bank's wrong $599. Live,
// user-facing, on the same page as the real pricing table that showed the
// correct number — exactly the "two different numbers for the same
// question" inconsistency this site has been getting rigorously purged of.
// Rewriting every one of these ten answers here, once, driven by the real
// data, rather than patching the five wrong literals — a literal fix would
// leave the other five one accidental edit away from drifting the same way.
// Mutates the FAQ arrays already embedded in the INDUSTRIES literal above;
// safe because INDUSTRIES itself is a plain array of objects (only the
// `const` *binding* is immutable, not its contents), and this runs once at
// module load, after both INDUSTRIES and INDUSTRY_PRICING already exist.
// Explicit, not inferred: which industries borrow another's pricing tier
// rather than having their own INDUSTRY_PRICING group, and which real
// industry they should be described as matching. Only 3 today (dental
// piggybacks on the medical group's own name "healthcare", financial-
// services and home-services explicitly say so in their own FAQ already) —
// inferring this from INDUSTRY_PRICING_SLUG_MAP's shape got the direction
// backwards for bank/mechanic (whichever industry happened to be found
// first was arbitrarily treated as "primary").
const SHARES_PRICING_WITH: Record<string, string> = {
  dental: "healthcare",
  "financial-services": "bank",
  "home-services": "mechanic",
};

for (const industry of INDUSTRIES) {
  const pricingSlug = INDUSTRY_PRICING_SLUG_MAP[industry.slug];
  const group = INDUSTRY_PRICING.find((g) => g.slug === pricingSlug);
  if (!group) continue;
  const cheapest = Math.min(...group.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly));
  const sharesWithSlug = SHARES_PRICING_WITH[industry.slug];
  const sharesWith = sharesWithSlug ? INDUSTRIES.find((i) => i.slug === sharesWithSlug) : undefined;
  const faq = industry.faqs.find((f) => f.question.startsWith("How much does ZyncoAI cost"));
  if (!faq) continue;
  faq.answer = sharesWith
    ? `${industry.name} plans use the same pricing as ${sharesWith.name.toLowerCase()}, starting from AUD $${cheapest}/month with a 7-day free trial.`
    : `${industry.name} plans start from AUD $${cheapest}/month, with a 7-day free trial.`;
}

// 2026-08-15 — same-shaped mapping as above, but to the real Vertical enum
// key used by lib/integrationsCatalog.ts's CATALOG (getIntegrationsCatalog),
// for the new per-vertical integrations content block. Distinct from
// INDUSTRY_PRICING_SLUG_MAP because the integrations catalog and the
// pricing groups are keyed differently (pricing groups nest dental under
// "medical"; the integrations catalog keys them separately since they get
// different real integrations lists — DENTAL: [GOOGLE_CALENDAR] on its own,
// not merged with MEDICAL's). financial-services has no dedicated catalog
// entry (reuses bank's compliance-focused tier, same as its pricing
// convention above); home-services has no dedicated catalog entry either —
// mapped to OTHER, which is an honest fallback (Google Calendar only, no
// invented trade-specific integrations that don't exist in the product).
export const INDUSTRY_VERTICAL_MAP: Record<string, string> = {
  healthcare: "MEDICAL",
  dental: "DENTAL",
  legal: "LAW",
  mechanic: "MECHANIC",
  restaurant: "RESTAURANT",
  bank: "BANK",
  university: "UNIVERSITY",
  salon: "SALON",
  "financial-services": "BANK",
  "home-services": "OTHER",
};

// Mirrors frontend/components/dashboard/settings/IntegrationsTab.tsx's real
// PROVIDERS list exactly (2026-08-15) — hasDirectSync means a real
// practitioner-fetch adapter exists (backend/src/lib/staffSync/providers/*),
// wired into connect-time auto-sync, the 24h sweep, and manual "Sync now".
// This is STAFF/PRACTITIONER sync only, never appointment/booking sync —
// the marketing copy referencing this list must not blur that distinction
// (booking/availability sync is Google Calendar's job, per
// integrationsCatalog.ts). Medical & Dental only.
export const MEDICAL_PMS_PROVIDERS: { name: string; hasDirectSync: boolean }[] = [
  { name: "Cliniko", hasDirectSync: true },
  { name: "Nookal", hasDirectSync: true },
  { name: "Halaxy", hasDirectSync: true },
  { name: "Zanda (Power Diary)", hasDirectSync: true },
  { name: "Power Diary", hasDirectSync: true },
  { name: "Jane App", hasDirectSync: true },
  { name: "Core Plus", hasDirectSync: true },
  { name: "Pabau", hasDirectSync: false },
  { name: "Best Practice", hasDirectSync: false },
  { name: "Medical Director", hasDirectSync: false },
];

// The real signup -> live flow (backend/src/api/routes/business/onboarding.ts,
// lib/voice/numberProvisioning.ts), traced 2026-08-15 — identical for every
// vertical, so this is shared, not per-industry. The last step deliberately
// makes no timing promise (no SLA/guarantee language, per this rebuild's
// hard rule) — automatic AU number purchase can fail (a known Twilio-region
// constraint) and fall back to a manual step; that's disclosed honestly
// instead of papered over with an invented "within X hours" claim.
export interface OnboardingStep {
  title: string;
  detail: string;
}
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { title: "Sign up", detail: "Create your account and verify your email address." },
  { title: "Tell us about your business", detail: "Business name, industry, hours and address — a short setup wizard." },
  { title: "Add your staff", detail: "Import or add the people whose calendars Ella will book against." },
  { title: "Activate your voice line", detail: "Click Activate — a real Australian phone number is purchased and configured for your business." },
  { title: "Ella goes live", detail: "The moment a real number is assigned, Ella starts answering. Automatic number purchase is usually immediate; on the rare occasion it needs a manual step on our side, we're notified automatically and follow up directly." },
];

// 2026-08-15 richer-vertical-page pass — one more real FAQ per industry, on
// the two questions the new onboarding-roadmap block raises but doesn't
// fully answer on its own: how fast setup actually is, and what "sample
// data" in the analytics preview means. Generic wording (industry name
// substituted) rather than 20 hand-written near-duplicates, since the
// underlying facts (the onboarding flow, the dashboard preview) are
// identical for every vertical — see ONBOARDING_STEPS above.
for (const industry of INDUSTRIES) {
  industry.faqs.push(
    {
      question: "How quickly can we get set up?",
      answer: `Sign up, complete the short setup wizard, and click Activate — that queues a real Australian phone number for your ${industry.name.toLowerCase()} business. Number purchase is usually immediate; on the rare occasion it needs a manual step on our side, we're notified automatically and follow up directly rather than leaving you waiting.`,
    },
    {
      question: "Is the dashboard preview on this page real data?",
      answer: "The analytics preview shows the real ZyncoAI dashboard interface with sample data, clearly labelled as such. Once you're live, every number reflects your business's actual calls and bookings.",
    }
  );
}

// Identical on every plan — the whole point being that pricing scales with
// call volume, not with which parts of the product you get.
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
//  - Insurance claims: reworded to "tracking dashboard" — real feature is
//    manual dashboard entry (claims.ts); Ella's voice pipeline has no
//    create_claim tool, so nothing from a phone call auto-populates this.
//  - Patient files: description kept as-is — backend storage/upload route
//    is genuinely real (multer + GCS/local disk, ClinicDocument model).
//    Known follow-up (not urgent, tracked separately): the dashboard
//    documents page has view/download/delete but no upload UI yet, so a
//    business can't actually upload a file through the product today.
//
// Third pass, 2026-08-10 (landing-page honesty rebuild) — two corrections
// to claims the 2026-08-04 passes above got right AT THE TIME but which
// have since changed in the actual product, plus one real claim added:
//  - Calendar sync: Microsoft/Outlook calendar sync is now REAL —
//    microsoftGraph.ts gained createMicrosoftCalendarEvent/
//    deleteMicrosoftCalendarEvent on 2026-08-06 (Calendars.ReadWrite
//    scope), wired into bookAppointment/cancelAppointment the same way
//    Google's is. The 2026-08-04 "Google-only" claim was accurate when
//    written and is stale now — updated to name both.
//  - SMS confirmations: dropped from "Email and SMS confirmations" — SMS
//    is genuinely blocked account-wide today (no working SMS provider
//    key, no ACMA Sender ID Register approval; see lib/sms.ts's own
//    header comment). Claiming it's included when a caller literally
//    cannot receive one is exactly the kind of claim this file exists to
//    catch.
//  - Australian compliance: the 2026-08-04 note above (dataResidency.
//    compliant: false, DB in Singapore) is now RESOLVED — the 2026-08-06
//    Neon cutover moved the database to ap-southeast-2 (Sydney), and
//    GET /api/business/compliance now reports compliant: true, verified
//    live. Database/storage residency is genuinely true and named
//    explicitly. Reworded 2026-08-10 (legal docs elite rebuild) to scope
//    the claim to storage specifically — voice processing (OpenAI,
//    Deepgram, Cartesia) and telephony (Twilio) are real-time overseas
//    subprocessors disclosed at /privacy#subprocessors; a blanket "your
//    data is hosted in Australia, not offshore" line would overclaim.
// 2026-08-17 — this list is rendered identically under EVERY plan card
// regardless of which industry tab is selected (PricingSection.tsx doesn't
// filter it per vertical), but four of the original fifteen items were
// medical-only in reality: "Patient files", "Insurance claim tracking...
// Medicare, DVA, WorkCover, NDIS", and "Cliniko integration, Best Practice
// CSV import" — a restaurant or salon owner expanding "All features
// included" saw those listed as part of their own plan. Reworded the
// genuinely universal capabilities to vertical-neutral wording (Documents
// is real for every vertical via Industry.documentsLabel in
// lib/verticalOps.ts; claims/incident tracking is real but NOT present for
// every vertical there, so it's described honestly as "where available"
// rather than claimed as common to all); dropped the PMS-integration line
// entirely since Cliniko/Best Practice aren't real for non-medical plans
// and calendar sync (the integration that IS universal) is already its
// own line below.
export const COMMON_FEATURES: string[] = [
  "AI receptionist 24/7 — Ella voice",
  "Full business management dashboard",
  "Document storage and management",
  "Claims/incident tracking dashboard, where available for your industry",
  "Financial and revenue dashboard",
  "Call history with full transcripts",
  "Appointment booking and management",
  "Email confirmations (SMS coming soon)",
  "Google & Microsoft Outlook Calendar sync",
  "Staff management and roles",
  "Analytics (AI voice + business metrics)",
  "Export and print all data",
  "Sydney-hosted database, Privacy Act disclosure & compliance tools",
  "Urgent-call handling — genuine emergencies are told to hang up and dial Triple Zero (000) directly; other urgent calls are transferred to your staff",
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

// 2026-08-10 — removed a fabricated TESTIMONIALS array (invented names,
// invented businesses, invented quotes — "Dr. Priya Nair, Riverside
// Medical", etc.) that was rendering on every /solutions/<industry> page.
// ZyncoAI has zero real customers as of this date. This constant, and the
// UI slot it fills (see SolutionTemplate.tsx and IndustriesSection.tsx),
// is what stands in its place — real, checkable claims only. A real
// Testimonial type/array should only ever be reintroduced once a real
// customer has actually said real words that can be attributed to them.
//
// Sydney residency: verified true via GET /api/business/compliance
// (backend/src/api/routes/business/compliance.ts derives the region live
// from DATABASE_URL — ap-southeast-2 since the 2026-08-06 Neon cutover,
// dataResidency.compliant: true). AI disclosure: every call that's
// recorded discloses it — see lib/recordingDisclosure. Privacy Act:
// real NDB Scheme incident-response contact + consent tracking, same
// compliance endpoint. Support: support@zyncoai.com is a real, monitored
// inbox (app/contact/page.tsx), not a tiered/SLA claim nothing backs.
export interface Differentiator {
  title: string;
  detail: string;
}

export const REAL_DIFFERENTIATORS: Differentiator[] = [
  { title: "Sydney-hosted database", detail: "Your business, appointment, and call records are stored in Australia (ap-southeast-2). Voice processing involves overseas AI providers, disclosed in full at /privacy#subprocessors." },
  { title: "AI disclosure by design", detail: "Every caller is told they're speaking with an AI, every time — not buried in fine print." },
  { title: "Privacy Act 1988 compliance", detail: "Real incident-response contact and consent tracking, not a badge we haven't earned." },
  // 2026-08-15 — same exact claim already made in MarketingMegaFooter.tsx
  // and SquarePaymentMethodCard.tsx (verified: saveCard() only ever stores
  // a Square-tokenized sourceId — no raw card number touches our servers or
  // database), added here so the /solutions pages' honesty section covers
  // payment security too, not just data/AI/privacy.
  { title: "PCI DSS compliant payments", detail: "Card payments are processed by Square, a PCI DSS compliant processor — your card details never touch our servers." },
  { title: "Transparent support access", detail: "A real, monitored inbox — support@zyncoai.com — not a chatbot wall." },
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

// 2026-08-11 — this number and CallEllaButton.tsx each carried a different
// number with a comment claiming the OTHER one was fake. Re-verified
// directly against the DB rather than trusting either stale comment: BOTH
// numbers are real, live, ACTIVE Business.phoneNumber records with genuine
// completed call history (+61 2 5747 4612 = Bright Smile Dental, +61 2 5747
// 4792 = shahs clinic). Standardized on 4792 — shahs clinic is the
// deliberately-designated internal test/demo business and has the more
// recently verified live completed call.
//
// 2026-08-17 — moved here from LiveDemoSection.tsx (a "use client" file).
// app/(marketing)/demo/page.tsx (a Server Component) was importing this
// constant directly from that client-boundary module and calling
// .replace() on it at build time — Next.js wraps non-component exports of
// a "use client" file in a Client Reference when accessed from server
// code, so that .replace() call was actually hitting a proxy standing in
// for a browser-only value, not the real string. Deterministically broke
// static generation of /demo once the app's module graph shifted enough
// for the bundler to stop resolving it "by accident." Living in this plain
// data module (no "use client") is what makes it safe to import from both
// server and client code.
export const DEMO_NUMBER = "+61 2 5747 4792";
