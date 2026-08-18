import type { HelpCategory } from "@/components/marketing/receptionist/HelpCentre";

// Single source of truth for the Help Centre's locked, fact-checked
// content — moved out of app/(marketing)/resources/help/page.tsx so the
// corner help widget (HelpWidget.tsx) can import the exact same array
// instead of holding a second copy that could drift out of sync. Content
// itself is unchanged from the 2026-08-17 audit — see git history on the
// old inline array for that audit's own verification notes.
export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: "getting-started",
    name: "Getting started",
    items: [
      {
        slug: "setting-up-your-first-clinic",
        question: "Setting up your first clinic",
        answer:
          "After signing up, you'll be guided through a short setup wizard: your business details (name, industry, hours), inviting your first staff member, and activating your voice line — which purchases a real Australian phone number for Ella to answer on. That part typically takes about 15 minutes. From there, forwarding your existing number to it and connecting your calendar or practice software under Settings → Integrations are the last steps before you're fully live.",
      },
      {
        slug: "can-my-patients-tell-its-ai",
        question: "Can my patients tell it's AI?",
        answer:
          "Yes — every call opens with Ella introducing herself by name and by role, and that role always includes the word \"AI\" (an AI receptionist, or the equivalent for your industry). That's not just for if someone asks directly — it's part of the opening greeting on every single call. If a caller does ask directly, Ella always answers honestly.",
      },
      {
        slug: "what-happens-if-the-ai-cant-answer-a-question",
        question: "What happens if the AI can't answer a question?",
        answer:
          "She takes a detailed message with the caller's name and number and notifies you immediately. If you've set a transfer number under Settings → Integrations, she also connects the live call to your team on the spot — that's available on every plan, not a paid upgrade. Before your team picks up, they hear a short spoken summary of why the caller needs them, so nobody's answering blind.",
      },
      {
        slug: "what-languages-does-ella-speak",
        question: "What languages does Ella speak?",
        answer:
          "English (Australian) only, today. Speech recognition is tuned for Australian English, with no automatic language detection or switching. Multilingual support is a genuine future add-on we're planning, not something available yet.",
      },
      {
        slug: "do-i-need-a-new-phone-number-for-my-business",
        question: "Do I need a new phone number for my business?",
        answer:
          "No — you keep your existing number. ZyncoAI issues a separate dedicated number behind the scenes, and you forward your existing number to it. Callers only ever see or dial the number they already know.",
      },
    ],
  },
  {
    slug: "call-forwarding",
    name: "Call forwarding",
    items: [
      {
        slug: "how-do-i-set-up-call-forwarding",
        question: "How do I set up call forwarding?",
        answer:
          "Forward your business number to the ZyncoAI number shown in Settings → Integrations — the dial code depends on the line type, not just the carrier. A Telstra landline uses *21*[ZyncoAI number]# (single star); a mobile number on any carrier uses the standard **21*[ZyncoAI number]# GSM code (double star). Optus and TPG don't use a dial code at all — you set it from your online account instead. See the Documentation page for exact steps per line type, and use the \"Test my setup\" button once you're done to confirm it's working.",
      },
      {
        slug: "troubleshooting-call-forwarding",
        question: "Troubleshooting call forwarding",
        answer:
          "If calls aren't reaching Ella, check: forwarding is still active with your carrier (some carriers reset it after an outage), you forwarded to the exact ZyncoAI number shown in Settings, and you've used the \"Test my setup\" button to confirm end-to-end. If it still doesn't work, contact support with your carrier name and we'll help directly.",
      },
      {
        slug: "what-if-my-carrier-resets-call-forwarding",
        question: "What if my carrier resets call forwarding, e.g. after an outage?",
        answer:
          "Some carriers reset call forwarding after a network outage or account change, and it can happen without any notice. If calls stop reaching Ella, check that forwarding is still active under Settings → Integrations and use \"Test my setup\" to confirm — see Troubleshooting below for the full checklist.",
      },
    ],
  },
  {
    slug: "billing",
    name: "Billing",
    items: [
      {
        slug: "what-is-the-setup-fee",
        question: "What is the setup fee?",
        answer: "A one-time fee that varies by plan and vertical — see your industry's pricing tab on the Pricing page for the exact amount.",
      },
      {
        slug: "understanding-your-bill",
        question: "Understanding your bill",
        answer:
          "Your monthly charge is your plan's base price plus any minutes used beyond your included allowance, billed at your plan's per-minute overage rate. Add-ons appear as separate line items. Full itemised invoices are available under Settings → Billing.",
      },
    ],
  },
  {
    slug: "staff",
    name: "Staff",
    items: [
      {
        slug: "how-do-i-add-staff-members",
        question: "How do I add staff members?",
        answer: "Settings → Staff → Invite. Enter their email, choose a role, and they'll get a secure link to join.",
      },
      {
        slug: "inviting-staff",
        question: "Inviting staff",
        answer:
          "Go to Settings → Staff → Invite, enter their email and choose a role (Owner/Admin/Staff/Doctor). They'll get an email with a secure link to set their password and join your business.",
      },
    ],
  },
  {
    slug: "cancellation",
    name: "Cancellation",
    items: [
      {
        slug: "can-i-cancel-anytime",
        question: "Can I cancel anytime?",
        answer: "Yes — see the full Cancellation & Refunds policy on our Terms page for the exact notice period and what happens to your data.",
      },
      {
        slug: "cancellation-and-refund-policy",
        question: "Cancellation and refund policy",
        answer:
          "The full cancellation, refund, data-export, and data-retention policy now lives on our Terms page — that's the canonical source. Short version: cancel any time from Settings → Billing, it takes effect at the end of your current billing period, no partial-month refunds, and your 7-day free trial means nothing's charged until you're sure.",
      },
    ],
  },
];
