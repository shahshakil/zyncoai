// Shared FAQ content + FAQPage structured data — rendered on both the
// homepage (FaqSection, above FinalCtaSection) and the standalone /faq
// page, so there's exactly one place this content can drift out of sync
// with reality. Same <script type="application/ld+json"> pattern as
// SiteJsonLd.tsx.
//
// 2026-08-05 — every answer below was checked against the actual backend/
// product before shipping (same standard as the pricing/setup-fee fixes
// elsewhere on the site). The "will callers know they're talking to an AI"
// question below was held back until server.py's greeting logic actually
// backed it up — two greeting branches (a CNAM-matched first-time caller,
// and a same-day 3rd+ repeat caller) used to skip the AI role_title
// mention entirely, and there was no instruction telling the model to
// admit it's an AI if asked directly mid-call (the base prompt even said
// "you're a real person first"). All three fixed same day this FAQ item
// was added — see build_cnam_confirm_greeting/WELCOME_BACK_TEMPLATES/
// build_system_prompt's "AI IDENTITY" section in server.py.
// 2026-08-05 — category is UI-only (FaqSection's filter pills below);
// FaqJsonLd's mapper only ever reads question/answer, so adding it here
// doesn't change the emitted schema at all. Content of every question/
// answer is unchanged from the fact-check pass — see the comment above.
// 2026-08-10 — the calendar-sync answer had gone stale in the other
// direction: it said external calendar sync was "on our roadmap", but
// Google Calendar and Microsoft Outlook/365 calendar sync are both real
// and live today (src/lib/googleCalendar.ts, src/lib/microsoftGraph.ts).
// Corrected to say so; practice-management-software sync is still
// genuinely not live, so that half of the claim is unchanged.
import { SITEWIDE_CHEAPEST_PLAN_PRICE } from "@/components/marketing/receptionist/data";

export const FAQ_CATEGORIES = ["Getting started", "Reliability", "Pricing & plans", "Privacy & data"] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

const FAQS: { question: string; answer: string; category: FaqCategory }[] = [
  {
    question: "What is ZyncoAI?",
    answer:
      "ZyncoAI is an AI-powered phone receptionist for Australian businesses. It answers your calls 24/7 in a natural voice, books appointments, takes orders and messages, and sends you the details — so you never miss a call again.",
    category: "Getting started",
  },
  {
    question: "How much does it cost?",
    answer:
      `Plans start from AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE}/month, and pricing varies by industry — visit our pricing page and select your industry to see exact plans. A one-time setup fee applies (the amount depends on your plan). No lock-in contracts.`,
    category: "Pricing & plans",
  },
  {
    question: "Do I need to change my phone number?",
    answer:
      "No. You keep your existing number and simply forward your calls to ZyncoAI — our AI answers every one, handling bookings, orders and questions, and transferring to you or your team whenever a caller asks for a real person. Setup is a couple of clicks with your phone provider, and we'll walk you through it.",
    category: "Getting started",
  },
  {
    question: "What happens if the AI can't help a caller?",
    answer:
      "It takes a detailed message with the caller's name and number and notifies you immediately, or transfers the call to you or your team if you've set up a transfer number in your dashboard. Callers are never left stuck.",
    category: "Reliability",
  },
  {
    question: "Will callers know they're talking to an AI?",
    answer:
      "Yes — we believe in transparency. Every call opens with our AI introducing itself as your business's AI receptionist (or the equivalent role for your industry), and if a caller asks directly whether they're speaking with an AI, it always answers honestly. It still sounds natural and warm, and handles calls just like a well-trained receptionist.",
    category: "Reliability",
  },
  {
    question: "Which industries does ZyncoAI support?",
    answer:
      "Medical and dental practices, restaurants, mechanics and auto shops, salons, law firms, real estate agencies, banking and finance, and universities — each with industry-specific call handling. Don't see yours? Get in touch.",
    category: "Getting started",
  },
  {
    question: "Can it book appointments into my calendar?",
    answer:
      "Yes — every appointment is booked straight into your ZyncoAI dashboard the moment a caller confirms a time, with automatic confirmation and reminder messages sent out. It also syncs two-way with your real Google Calendar or Microsoft Outlook/365 calendar. Direct sync into practice-management software is on our roadmap, but not yet live.",
    category: "Reliability",
  },
  {
    question: "Can I see what happened on my calls?",
    answer:
      "Yes. Your dashboard shows every call with a full transcript, the outcome — a booking made, an order taken, or a message left — and the caller's details, so you always know exactly what was said.",
    category: "Reliability",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes. ZyncoAI is built with Australian privacy law in mind, including the Privacy Act 1988 and Spam Act 2003, and the My Health Records Act 2012 where applicable for medical clients. See our Privacy Policy for full details.",
    category: "Privacy & data",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are live within about 15 minutes — we help you set your greeting, services or menu, and call handling, then you simply forward your number.",
    category: "Getting started",
  },
  {
    question: "Does it work after hours and on holidays?",
    answer:
      "Yes — 24/7, every day of the year. After-hours calls are often where ZyncoAI pays for itself, capturing bookings and orders your competitors miss while they're closed.",
    category: "Reliability",
  },
  {
    question: "Can I try it before I buy?",
    answer: "Yes — call our live demo line to hear ZyncoAI in action, or start a free 7-day trial from our website. No credit card required.",
    category: "Pricing & plans",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes — you can cancel any time from your dashboard under Settings → Billing. Your plan stays active until the end of your current billing period, and we don't offer partial-month refunds for the current billing cycle.",
    category: "Pricing & plans",
  },
  // 2026-08-17 expansion — 16 new questions, same standard as everything
  // above: checked against real code, not assumed. Two real findings along
  // the way, both fixed at the source rather than worked around here:
  // (1) "Bilingual Call Answering" (a whole use-case page) claimed Ella
  // "responds fluently in 15+ languages" — false. The real voice pipeline's
  // STT is hardcoded language="en-AU" (backend/src/voice/pipecat/
  // server.py), no detection/switching exists, and every vertical's
  // "Custom Multilingual Support" add-on is explicitly comingSoon:true.
  // Removed that use-case entry from data.ts's USE_CASES rather than leave
  // a fabricated page live. (2) COMMON_FEATURES (shown as "included in
  // every plan" regardless of vertical) had four medical-only items — a
  // restaurant or salon owner saw "Patient files", "Cliniko integration",
  // and Medicare/DVA/WorkCover/NDIS claim-tracking listed as part of their
  // own plan. Reworded to what's genuinely universal.
  {
    question: "How does Ella learn my business, menu, or services?",
    answer:
      "During setup you enter your services, menu, or offerings, hours, and any business-specific details through your dashboard's setup wizard — that becomes the real information Ella works from on every call, not a generic script. You can update it any time from Settings, and changes take effect on the next call.",
    category: "Getting started",
  },
  {
    question: "Can I customise what Ella says?",
    answer:
      "Yes — your dashboard has a custom-instructions field where you can adjust how Ella greets callers and handles specific situations for your business, without touching code. Every change is versioned, so you can see exactly what changed and when.",
    category: "Getting started",
  },
  {
    question: "What if I already have a receptionist — can they work together?",
    answer:
      "Yes — this is a common setup, not an edge case. You can configure a transfer number in your dashboard, and Ella hands off any call that needs a real person — a caller who asks for one, a complex situation, anything outside booking or FAQs — straight to your existing team. Ella handles the routine calls your team can't always get to; your receptionist keeps handling the rest.",
    category: "Getting started",
  },
  {
    question: "What languages does Ella speak?",
    answer:
      "English (Australian) only, today. The voice pipeline's speech recognition is currently English-only, with no language detection or switching. Multilingual support is a genuine future add-on we're planning, not something we offer yet — we won't claim otherwise until it's actually built.",
    category: "Getting started",
  },
  {
    question: "What happens if two people call at once?",
    answer:
      "Both calls are answered — ZyncoAI's voice infrastructure handles multiple simultaneous callers as a matter of how it's built, not as a special case. Neither caller waits behind the other or gets a busy signal.",
    category: "Reliability",
  },
  {
    question: "What if the caller has a strong accent or the line is bad?",
    answer:
      "Ella uses a professional speech-recognition service built for real-world callers, not a narrow demo model. When something genuinely can't be understood, Ella asks the caller to repeat themselves rather than guessing — and any call where that happens is automatically flagged in your dashboard so you can review exactly what was unclear. It isn't flawless on every accent or every bad line, and we'd rather say that plainly than promise perfection.",
    category: "Reliability",
  },
  {
    question: "Can Ella transfer a call to a human?",
    answer:
      "Yes. Every ZyncoAI deployment includes a transfer-to-human tool Ella uses on her own judgment — a caller explicitly asking for a real person, a complaint, or anything outside booking, availability, or FAQs gets handed to your configured transfer number, not left stuck with an AI that can't help.",
    category: "Reliability",
  },
  {
    question: "What happens if Ella mishears a booking?",
    answer:
      "Names are confirmed by spelling them back, phone numbers are confirmed digit by digit, and appointment details — day, date, time — are confirmed before anything is finalised. That confirmation step is a fixed part of every booking, specifically to catch a mishearing before it becomes a wrong appointment, not an optional nicety.",
    category: "Reliability",
  },
  {
    question: "What exactly counts as a \"minute\" for billing?",
    answer:
      "Real call time — the actual duration of your calls, summed across your billing period and rounded to the nearest whole minute. It's not each individual call rounded up, which would cost you more; it's your total usage rounded once.",
    category: "Pricing & plans",
  },
  {
    question: "What happens if I go over my included minutes?",
    answer:
      "You're charged a real, fixed per-minute overage rate — it ranges from AUD $0.25 to $0.60 per extra minute depending on your industry and plan tier, shown exactly on your plan's pricing card. There's no overage penalty beyond that rate, and no call ever gets cut off for being over your allowance.",
    category: "Pricing & plans",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "Yes, a one-time fee, charged once when your plan is assigned — not a recurring charge. It varies by plan, roughly AUD $149 to $2,999 depending on your industry and tier, shown exactly on the plan you select. There's no hidden second fee beyond what's shown before you sign up.",
    category: "Pricing & plans",
  },
  {
    question: "What's included in every plan?",
    answer:
      "The AI receptionist itself, your full business dashboard, call history with complete transcripts, appointment booking and management, real two-way Google and Microsoft Outlook calendar sync, staff management, analytics, document storage, a financial and revenue dashboard, and Sydney-hosted data with Privacy Act compliance tools — the same core product on every plan. What scales with a higher tier is your included minutes, not which parts of the product you get.",
    category: "Pricing & plans",
  },
  {
    question: "Where exactly is my data stored?",
    answer:
      "Your database and file storage — contacts, appointments, invoices, call recordings — are hosted in Sydney, Australia. That's a real, enforced requirement, not marketing language. It's also a scoped claim, not a blanket one: answering a call in real time necessarily routes audio and transcript text through overseas AI providers (speech-to-text, the conversational model, text-to-speech) and our telephony provider. Storage is Sydney-only; the live voice pipeline itself involves providers outside Australia, the same way any modern AI voice product's does.",
    category: "Privacy & data",
  },
  {
    question: "Are calls recorded?",
    answer:
      "Every call gets a full text transcript, always — that's core to the product, not optional. Audio recording of the call itself is a separate, business-controlled setting: it's off by default, requires you to enable it, and isn't even offered for some industries. When it is enabled, callers are told at the start of the call, and recording only happens if that disclosure is actually given.",
    category: "Privacy & data",
  },
  {
    question: "Who can access my data?",
    answer:
      "Role-based access is enforced on every request your dashboard makes, not just hidden in the interface. Staff accounts never see financial or payer data; a Doctor account only ever sees their own patients and schedule; only an Owner or Admin can manage integrations, billing, and staff. It's a genuine server-side restriction, not a UI toggle someone could work around.",
    category: "Privacy & data",
  },
  {
    question: "Is ZyncoAI Privacy Act 1988 compliant?",
    answer:
      "ZyncoAI is designed around the Australian Privacy Principles — we collect only what's needed to run your front desk, never sell or share your data with third parties, and log every sensitive-record view, download, or send for your own review. We don't hold a formal third-party privacy certification, and we won't claim one we don't have. Compliance with the Privacy Act for how your specific business uses ZyncoAI is a shared responsibility, the same way it would be with any tool handling customer data.",
    category: "Privacy & data",
  },
];

export function FaqJsonLd() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />;
}

export { FAQS };
