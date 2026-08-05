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
      "Plans start from AUD $99/month, and pricing varies by industry — visit our pricing page and select your industry to see exact plans. A one-time setup fee applies (the amount depends on your plan). No lock-in contracts.",
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
      "Yes — every appointment is booked straight into your ZyncoAI dashboard the moment a caller confirms a time, with automatic confirmation and reminder messages sent out. Direct sync into external calendars and practice-management software is on our roadmap, but not yet live for new bookings.",
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
      "Yes — you can cancel any time from your dashboard under Settings → Billing. Your plan stays active for a 30-day notice period after you cancel, and we don't offer partial-month refunds for the current billing cycle.",
    category: "Pricing & plans",
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
