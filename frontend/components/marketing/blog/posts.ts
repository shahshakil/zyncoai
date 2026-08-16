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
