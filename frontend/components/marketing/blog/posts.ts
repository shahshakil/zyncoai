// Real articles, not placeholders — every factual claim here (pricing,
// compliance, product behavior) is grounded in what ZyncoAI actually does,
// cross-checked against the real plan data and product rules elsewhere in
// this codebase. No invented statistics or fabricated citations.

import { SITEWIDE_CHEAPEST_PLAN_PRICE, INDUSTRY_PRICING } from "@/components/marketing/receptionist/data";

// Real min/max entry price across every vertical — used below instead of
// a hand-typed "$149–$399" range that went stale the moment per-vertical
// pricing changed (Salon is actually the $99 floor, University's Starter
// is now the $499 ceiling, not Medical's $399).
const MAX_ENTRY_PRICE = Math.max(...INDUSTRY_PRICING.flatMap((g) => g.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly)));

// Real per-vertical starter prices for the new posts below — read from the
// same INDUSTRY_PRICING groups the real /solutions pages render from
// (INDUSTRY_PRICING_SLUG_MAP: legal -> "law", salon -> "salon"), not
// hand-typed. A hand-typed $499 for law was exactly the kind of drift found
// and fixed in data.ts while sourcing this — the real price is $349.
function cheapestFor(pricingGroupSlug: string): number {
  const group = INDUSTRY_PRICING.find((g) => g.slug === pricingGroupSlug);
  if (!group) throw new Error(`No INDUSTRY_PRICING group for slug "${pricingGroupSlug}"`);
  return Math.min(...group.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly));
}
const SALON_STARTER_PRICE = cheapestFor("salon");
const LAW_STARTER_PRICE = cheapestFor("law");

export type BlogBlock = { type: "p"; text: string } | { type: "h2"; text: string } | { type: "ul"; items: string[] };

export interface BlogAuthor {
  slug: string;
  name: string;
  bio: string;
}

// Organization-level byline, not attributed to an individual — matches
// the Article JSON-LD's author (Organization, not Person). Still gets a
// real author page since the spec asks for one.
export const BLOG_AUTHOR: BlogAuthor = {
  slug: "zyncoai-team",
  name: "ZyncoAI Team",
  bio: "The team building ZyncoAI, out of Newcastle, NSW.",
};

export interface BlogCategory {
  slug: string;
  name: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "cost-roi", name: "Cost & ROI" },
  { slug: "industry-guides", name: "Industry Guides" },
  { slug: "comparisons", name: "Comparisons" },
  { slug: "trust-compliance", name: "Trust & Compliance" },
];

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  category: string; // BlogCategory.slug
  tags: string[];
  relatedIndustrySlugs: string[]; // Industry.slug, for internal linking
  blocks: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-receptionist-cost-savings-medical-clinics",
    title: "How AI Receptionists Can Cut Costs for Australian Medical Clinics",
    description:
      "A practical look at where a medical clinic actually loses money on the phone, and how 24/7 AI call answering changes the math.",
    publishedAt: "2026-07-15",
    readingMinutes: 6,
    category: "cost-roi",
    tags: ["medical", "healthcare", "pricing", "compliance"],
    relatedIndustrySlugs: ["healthcare", "dental"],
    blocks: [
      {
        type: "p",
        text: "A reception desk can only physically answer one call at a time. When two patients call at once, one waits or hangs up. When the clinic is closed, every call goes to voicemail — and a patient who's worried enough to call rarely leaves a message; they call the next clinic on the list instead. That's the real cost of a phone line, and it's mostly invisible, because a clinic never sees the calls it didn't answer.",
      },
      { type: "h2", text: "Where the cost actually shows up" },
      {
        type: "p",
        text: "A full-time receptionist role — wages, superannuation, leave entitlements, training, and the inevitable cost of turnover — is a genuine, ongoing line item for any clinic, and it still only covers one set of business hours. Evenings, weekends, lunch breaks, and sick days are all still uncovered unless a second person is rostered. An AI receptionist doesn't replace the judgment a human front-desk team brings to a complex situation, but it does remove the specific problem of a phone that simply isn't being answered.",
      },
      {
        type: "p",
        text: "ZyncoAI's medical plans start from AUD $399/month, with a 7-day free trial — a fraction of a single receptionist's wage, covering every hour the clinic is closed as well as the hours it's open, without replacing the team already there.",
      },
      { type: "h2", text: "What the AI actually does with a patient call" },
      {
        type: "ul",
        items: [
          "Answers instantly, 24 hours a day, checking real provider calendars before offering an appointment time — no double-bookings.",
          "Understands Medicare, private health fund, DVA, and WorkCover questions in the same call.",
          "Syncs directly with Cliniko, Best Practice, and Medical Director, so a booking made by the AI appears in the same system staff already use.",
          "Flags anything that sounds clinically urgent and escalates it immediately, rather than quietly booking it in for next week.",
        ],
      },
      { type: "h2", text: "Compliance isn't an afterthought" },
      {
        type: "p",
        text: "A medical clinic can't bolt on just any call-answering tool — patient data handling matters. ZyncoAI is built with the Australian Privacy Act 1988 and My Health Records Act 2012 in mind: sensitive patient fields are encrypted at rest, and the platform never submits claims to Medicare or a health fund on a clinic's behalf. It's an administrative tool, not a clinical one — Ella books appointments and answers logistical questions, and anything that sounds like a real clinical question goes to the clinic's own staff.",
      },
      {
        type: "p",
        text: "The math for most clinics comes down to a simple comparison: the monthly cost of never missing a call again, against the value of even a handful of patients a month who called, couldn't get through, and went elsewhere.",
      },
    ],
  },
  {
    slug: "best-ai-phone-answering-restaurants-australia",
    title: "Best AI Phone Answering Systems for Australian Restaurants (2026)",
    description:
      "What to actually look for in an AI phone system for a restaurant, and how ZyncoAI handles bookings and phone orders during a real dinner rush.",
    publishedAt: "2026-07-22",
    readingMinutes: 5,
    category: "industry-guides",
    tags: ["restaurant", "hospitality", "phone-orders"],
    relatedIndustrySlugs: ["restaurant"],
    blocks: [
      {
        type: "p",
        text: "Friday and Saturday night is exactly when a restaurant gets the most phone calls and has the least staff able to answer them. Pulling a waiter off the floor to take a booking call costs real table-turn time during the busiest hours of the week — and if nobody picks up, that booking (or that phone order) just goes to a competitor instead.",
      },
      { type: "h2", text: "What actually matters in an AI phone system for a restaurant" },
      {
        type: "ul",
        items: [
          "It has to check real table availability, not just take a message — a booking that turns out to be wrong is worse than no booking system at all.",
          "It has to handle phone orders accurately — reading the order and total back to the caller, and never inventing a menu item or price that doesn't exist.",
          "It has to handle modifications naturally mid-order (\"no beetroot\", \"make it large\") without asking the caller to repeat the whole thing.",
          "It has to quote a wait time as a real range from the actual kitchen queue, not a guess.",
        ],
      },
      {
        type: "p",
        text: "ZyncoAI's ordering flow is built around exactly this: menu items and prices are checked against the restaurant's real menu before ever being offered or confirmed, modifications are folded into the same item and read back in full as they're added, and wait times come from a real query against pending orders — never an invented estimate.",
      },
      { type: "h2", text: "Bookings and orders, handled differently but by the same call" },
      {
        type: "p",
        text: "A caller might want a table, or they might want food for pickup — Ella asks early in the call which one it is, rather than assuming. Dietary requirements and large-group requests are captured as part of the booking itself, not left for staff to chase up separately later. And because it's a real AI receptionist rather than an IVR menu, a caller can just talk naturally — \"table for six, Saturday, around 7:30\" — instead of pressing 1 for bookings, 2 for orders.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "Restaurant plans start from AUD $149/month, with a 7-day free trial and no contract. For a venue that's genuinely missing calls during service — which is most venues, most weekends — that's a small cost against the bookings and orders that would otherwise go to whichever competitor's phone got answered instead.",
      },
    ],
  },
  {
    slug: "zyncoai-vs-human-receptionist-comparison",
    title: "ZyncoAI vs a Human Receptionist: What Actually Changes",
    description:
      "An honest comparison — where an AI receptionist genuinely outperforms a human front desk, and where it doesn't try to.",
    publishedAt: "2026-07-29",
    readingMinutes: 7,
    category: "comparisons",
    tags: ["comparison", "receptionist", "roi"],
    relatedIndustrySlugs: ["healthcare", "restaurant", "salon"],
    blocks: [
      {
        type: "p",
        text: "This isn't a \"replace your receptionist\" pitch — ZyncoAI is built to work alongside a human team, not instead of one. The honest answer to \"AI vs human receptionist\" is that they're good at different things, and understanding which is which matters more than picking a side.",
      },
      { type: "h2", text: "Where an AI receptionist genuinely wins" },
      {
        type: "ul",
        items: [
          "Availability — Ella answers 24 hours a day, including nights, weekends, and lunch breaks, without a roster.",
          "Consistency — every caller gets the same accurate information about hours, pricing, and availability, not whichever answer a tired staff member remembers.",
          "No missed calls from concurrency — a human can only be on one call at a time; ZyncoAI's infrastructure handles multiple simultaneous callers without anyone waiting.",
          "A complete record — every call is transcribed, so there's never a dispute about what was or wasn't said or promised.",
          "No sick days, no turnover, no retraining every time someone leaves.",
        ],
      },
      { type: "h2", text: "Where a human still matters" },
      {
        type: "ul",
        items: [
          "Genuine emotional nuance — a distressed or upset caller often needs a human's judgment, not just a well-designed script.",
          "Complex, ambiguous situations that don't fit a defined process — the kind of call where the right answer is \"let me find out and call you back.\"",
          "Physical front-of-house tasks — greeting a walk-in, handling cash, anything that isn't actually a phone call.",
          "Building an ongoing personal relationship with a regular client where familiarity itself is part of the value.",
        ],
      },
      { type: "h2", text: "Why ZyncoAI is built to hand off, not take over" },
      {
        type: "p",
        text: "Every ZyncoAI deployment includes a transfer-to-human tool the AI uses on its own judgment — if a caller explicitly asks for a real person, raises a complaint, or brings up something outside booking, availability, or FAQs, the call is handed to staff with a short summary of why, rather than the AI trying to muddle through. The goal isn't for Ella to never transfer a call; it's for the routine 80% of calls — booking, rescheduling, hours, pricing, simple questions — to never need a human at all, so the team's time goes to the calls that actually need a person.",
      },
      { type: "h2", text: "The real comparison" },
      {
        type: "p",
        text: `A full-time receptionist covers roughly 38 hours a week, once. ZyncoAI's plans start from AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}–$${MAX_ENTRY_PRICE}/month depending on the vertical, with a 7-day free trial, and cover all 168 hours. For most businesses the realistic outcome isn't "AI instead of a human" — it's the AI catching everything the current team physically can't be on the phone for, while the team keeps doing the parts of the job that actually need a person.`,
      },
    ],
  },
  {
    slug: "is-ai-receptionist-worth-it-small-salon",
    title: "Is an AI Receptionist Worth It for a Small Hair & Beauty Salon?",
    description:
      "The honest cost math for a small salon — what a missed booking actually costs you, and what ZyncoAI's real starting price buys against it.",
    publishedAt: "2026-08-17",
    readingMinutes: 5,
    category: "cost-roi",
    tags: ["salon", "beauty", "pricing", "roi", "small-business"],
    relatedIndustrySlugs: ["salon"],
    blocks: [
      {
        type: "p",
        text: "A small salon usually runs on one or two people at the front desk — often a stylist who's also answering the phone between clients. That works fine until it doesn't: a client mid-colour can't pick up, a Saturday morning rush means every call goes unanswered for minutes at a time, and a closed sign on the door means every after-hours call goes to voicemail. The question worth asking honestly isn't \"does this happen\" — every salon knows it does — it's whether fixing it is actually worth the monthly cost.",
      },
      { type: "h2", text: "What a missed booking actually costs" },
      {
        type: "p",
        text: "This isn't a number we can honestly give you — every salon's average service price and rebooking rate is different, and any generic industry-wide statistic claiming to know exactly how much a missed call costs your specific business would be a guess dressed up as data. What we can say plainly: a missed call doesn't get a voicemail message back most of the time — a caller who wants an appointment and can't get through tends to just call the next salon on the list. The real question to ask about your own business is simple: how many appointments would you need to catch in a month, at your own average service price, before the monthly cost of not missing them stops feeling optional?",
      },
      { type: "h2", text: "What ZyncoAI actually costs" },
      {
        type: "p",
        text: `Salon and beauty plans start from AUD $${SALON_STARTER_PRICE}/month, with a 7-day free trial and no contract. That's the real starting price — not a "from" figure that jumps once you actually sign up. At that price, the math is straightforward: if the plan catches even one appointment a month that would otherwise have gone to voicemail (or straight to a competitor), it's likely already paid for itself for most salons' average service price — and a busy salon typically catches far more than one missed call a month once every phone hour, not just business hours, is actually covered.`,
      },
      { type: "h2", text: "What actually happens on the call" },
      {
        type: "ul",
        items: [
          "Ella answers instantly — no hold music, no ringing through to a stylist who can't get to the phone.",
          "Bookings check the individual stylist's real calendar, not a generic salon-wide slot that turns out to double-book someone.",
          "Service-length and pricing questions are answered on the spot, not left for a callback.",
          "Automatic reminder calls go out ahead of appointments — no-shows cost more in a salon than almost any other vertical, given how much of the day's revenue one empty chair represents.",
          "At the end of the call, a client is offered their next rebooking directly, rather than being expected to remember to call back in six weeks.",
        ],
      },
      { type: "h2", text: "Where this doesn't replace your front desk" },
      {
        type: "p",
        text: "A salon's front desk does more than answer the phone — greeting walk-ins, handling retail sales, managing the day's flow in the chair. ZyncoAI doesn't touch any of that; it's specifically the phone-answering and booking problem it solves. For a solo stylist or a small team genuinely torn between the client in the chair and the phone ringing, that's usually exactly the gap that matters most.",
      },
    ],
  },
  {
    slug: "ai-receptionist-guide-law-firms",
    title: "How Ella Handles Calls for Law Firms: A Real-World Guide",
    description:
      "What actually happens when a prospective client calls a law firm using ZyncoAI — matter screening, consultation booking, and what's deliberately off-limits.",
    publishedAt: "2026-08-17",
    readingMinutes: 6,
    category: "industry-guides",
    tags: ["legal", "law-firms", "intake", "pricing"],
    relatedIndustrySlugs: ["legal"],
    blocks: [
      {
        type: "p",
        text: "A law firm's phone line carries a specific kind of pressure a lot of other businesses don't deal with: the caller on the other end is often having the worst week of their year, and the firm's first response — answered promptly or not, professional or rushed — shapes whether they become a client at all. A missed call here isn't just a scheduling gap; for a firm that runs on new-matter intake, it's often a lost client relationship entirely.",
      },
      { type: "h2", text: "What Ella actually does on an intake call" },
      {
        type: "ul",
        items: [
          "Answers every call instantly, in a deliberately measured, professional tone — not the casual register some other verticals use.",
          "Screens the basics before booking: what kind of matter it is, how urgent it is, which practice area it falls under.",
          "Books consultations against the right solicitor's real calendar for that practice area, rather than a generic firm-wide slot.",
          "Captures time-sensitive details accurately — a CTP or WorkCover claim, a court deadline mentioned in passing — instead of a rushed handwritten phone note that loses the specifics.",
        ],
      },
      { type: "h2", text: "What Ella deliberately does not do" },
      {
        type: "p",
        text: "Ella never discusses the substance of legal advice, on any call, for any matter. Intake, screening, and scheduling are the entire scope — anything a caller asks that goes beyond \"what kind of matter is this and when can someone see you\" is routed straight to a solicitor. This isn't a limitation to work around; it's a deliberate boundary, because the whole point of first-contact screening is to get the right information to the right person, not to attempt something a law firm shouldn't want an AI doing in the first place.",
      },
      { type: "h2", text: "Why pre-screened intake actually saves billable time" },
      {
        type: "p",
        text: "A solicitor's first real conversation with a new client is more useful when it doesn't start by re-asking questions the caller already answered on the intake call. Matter type, urgency, and practice area are already captured by the time a consultation is booked — the solicitor walks in already knowing roughly what they're dealing with, rather than spending the first ten minutes of a billable consultation on discovery that a screening call could have handled.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: `Legal firm plans start from AUD $${LAW_STARTER_PRICE}/month, with a 7-day free trial. For a firm where a single new matter can be worth many multiples of that in fees, the practical comparison isn't against doing nothing — it's against the specific cost of a prospective client who called, couldn't get through, and rang the next firm on the list instead.`,
      },
    ],
  },
  {
    slug: "ai-receptionist-vs-traditional-answering-service",
    title: "AI Receptionist vs Traditional Answering Service: An Honest Comparison",
    description:
      "Where a paid human answering service still wins, and where an AI receptionist with real calendar access genuinely does something an answering service structurally can't.",
    publishedAt: "2026-08-17",
    readingMinutes: 6,
    category: "comparisons",
    tags: ["comparison", "answering-service", "roi"],
    relatedIndustrySlugs: [],
    blocks: [
      {
        type: "p",
        text: "Traditional answering services have existed for decades for a good reason — a human voice on the other end of the phone, taking a message when a business can't answer itself. They're a real, established option, and dismissing them outright wouldn't be honest. But \"someone picks up and takes a message\" and \"an appointment gets booked directly into your real calendar during the call\" are structurally different things, and the difference matters more than which one sounds more reassuring.",
      },
      { type: "h2", text: "What a traditional answering service actually does" },
      {
        type: "p",
        text: "A human agent — usually working across many unrelated businesses at once, not trained specifically on yours — answers the call and takes a message: name, number, reason for calling. That message then gets relayed to the business, usually by text or email, for someone on the business's own team to act on later. The caller gets a warm human voice, which is a real advantage for a distressed or complicated call. What they generally don't get is an actual booking made on the spot, because the agent doesn't have live access to the business's real calendar or booking system — the call ends with a message taken, not a problem solved.",
      },
      { type: "h2", text: "Where that message-relay gap actually costs you" },
      {
        type: "ul",
        items: [
          "A caller who wanted to book an appointment now has to wait for a callback — and a caller who wanted a booking, not a callback, sometimes just calls someone else in the meantime.",
          "Message relay introduces a real lag between when the call happened and when your team can act on it — minutes at best, hours if it lands after your team's own working hours.",
          "Per-minute or per-call pricing on a lot of traditional services means cost scales directly with call volume — a busy week gets expensive in a way a flat plan doesn't.",
        ],
      },
      { type: "h2", text: "Where an AI receptionist with real calendar access wins" },
      {
        type: "p",
        text: "ZyncoAI checks your real provider or staff calendars during the call itself, offers an actual available time, and books it — the call ends with a confirmed appointment already in your calendar, synced with Google Calendar or Microsoft Outlook, not a message waiting for someone to action. That's not a matter of the AI being \"smarter\" than a human agent; it's that the AI has live, direct access to your actual booking system in a way a third-party answering service, by design, doesn't.",
      },
      { type: "h2", text: "Where a human agent still has a real edge" },
      {
        type: "p",
        text: "A distressed, angry, or highly unusual call is still often better handled by a human's judgment than any script-following system, AI or otherwise — and ZyncoAI is built around that same principle, not against it: every deployment includes a transfer-to-human tool the AI uses on its own judgment for exactly these situations. The honest comparison isn't \"AI beats humans\" — it's that for the large share of calls that are genuinely routine (booking, rescheduling, hours, simple questions), direct calendar access beats message-taking, and for the calls that aren't routine, both approaches ultimately need to hand off to a real person on your team.",
      },
      {
        type: "p",
        text: `Plans start from AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}/month depending on the vertical, with a 7-day free trial — worth comparing directly against what a per-minute or per-call answering service actually costs at your real call volume, not just its advertised starting rate.`,
      },
    ],
  },
  {
    slug: "ai-receptionist-privacy-compliance-australian-businesses",
    title: "How ZyncoAI Handles Privacy, AI Disclosure, and Data Hosting for Australian Businesses",
    description:
      "The honest, specific answer to what ZyncoAI actually does with your data and callers' data — no unearned certifications, no vague reassurances.",
    publishedAt: "2026-08-17",
    readingMinutes: 6,
    category: "trust-compliance",
    tags: ["compliance", "privacy", "data-residency", "australia"],
    relatedIndustrySlugs: ["healthcare", "dental", "legal"],
    blocks: [
      {
        type: "p",
        text: "Most compliance pages are written to sound reassuring. This one is written to be accurate, which sometimes means saying \"not yet\" instead of implying \"already done.\" If a specific certification or claim isn't true today, it's not on this page — and where a claim has a real, narrow scope rather than a broad one, that scope is stated exactly.",
      },
      { type: "h2", text: "Does Ella tell callers they're talking to an AI?" },
      {
        type: "p",
        text: "Ella doesn't open every call by announcing she's an AI, in the same way a human receptionist doesn't open every call with a job title and employment status. What she does do: if a caller asks directly — \"am I talking to a real person?\" — Ella answers honestly, every time, identifying herself as a virtual receptionist rather than pretending otherwise. That's a deliberate, specific behaviour, not a vague \"we're transparent about AI\" claim — and it's worth being precise about, because \"discloses if asked\" and \"announces on every call\" are genuinely different policies, and only the first one is what actually happens today.",
      },
      { type: "h2", text: "Where your data is actually stored" },
      {
        type: "p",
        text: "Your business's database and file storage — contacts, appointments, invoices, call recordings — are hosted in Sydney, Australia. That's a real, specific, checked claim, not marketing language: it's an enforced requirement, verified against the live database connection every time the platform checks its own compliance posture. It's also a scoped claim, not a blanket one: to answer a call in real time, the audio and transcript text pass through overseas AI providers — speech-to-text, the conversational AI model, and text-to-speech — and are carried by our telephony provider. Storage is Sydney-only; the real-time voice pipeline itself necessarily involves providers outside Australia, the same way almost any modern AI voice product's does. Saying otherwise would be the fabrication.",
      },
      { type: "h2", text: "The Australian Privacy Act 1988" },
      {
        type: "p",
        text: "ZyncoAI is designed around the Australian Privacy Principles: only the data needed to run your front desk is collected, nothing is sold or shared with third parties, and every sensitive-record view, download, or send is written to an audit log your business can review. Compliance with the Privacy Act for how your specific business uses ZyncoAI is a shared responsibility, the same way it would be with any tool handling customer data — we'd recommend your own compliance process reviews your specific configuration rather than assuming a platform-level statement covers everything.",
      },
      { type: "h2", text: "Certifications we don't have yet" },
      {
        type: "p",
        text: "ZyncoAI is not currently SOC 2 certified — that's on the roadmap as the platform scales, not a claim we make today. Data-handling practices are built around GDPR principles (data minimisation, purpose limitation, encryption), but that's a design philosophy, not a formal GDPR certification, and we don't present it as one. If a business specifically needs a formal certification we don't yet hold, the honest answer is that we don't hold it yet — not a reframing that implies otherwise.",
      },
      { type: "h2", text: "Encryption and access controls, specifically" },
      {
        type: "ul",
        items: [
          "Sensitive fields (Medicare numbers, private health details, and similar) are encrypted at rest before being written to the database.",
          "TLS is used in transit for every connection to the dashboard, API, and voice platform.",
          "Role-based access is enforced on every API route server-side, not just hidden in the interface — a Staff account can't see financial or payer data regardless of what the UI shows.",
        ],
      },
      { type: "h2", text: "If something goes wrong" },
      {
        type: "p",
        text: "If a security issue affecting your data is identified, affected businesses are notified directly with a clear timeline and remediation — not left to find out independently. There's no public bug-bounty program running today; if you find a real issue, reporting it directly is the fastest way to get it looked at and fixed.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === categorySlug);
}

export function getAllTags(): string[] {
  return Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags))).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.tags.includes(tag));
}

// Browse-by-vertical — reuses the real relatedIndustrySlugs already on
// every post (see the field's own comment above) rather than introducing a
// second, parallel categorisation that could drift out of sync with it.
export function getPostsByIndustry(industrySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.relatedIndustrySlugs.includes(industrySlug));
}
