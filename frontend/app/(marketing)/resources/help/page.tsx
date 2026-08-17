import type { Metadata } from "next";
import Link from "next/link";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "Help Centre | ZyncoAI",
  description: "FAQs, troubleshooting, billing, staff invites, and the ZyncoAI cancellation and refund policy.",
};

// 2026-08-17 audit — several answers below had drifted from what the
// product actually does; each fix is cross-checked against real code, not
// assumed. "15+ languages" was flatly false: the voice pipeline's speech
// recognition is hardcoded language="en-AU" with no detection/switching
// (backend/src/voice/pipecat/server.py), same finding already corrected on
// /faq and /features. "on supported plans" for live transfer was also
// false — transferToHuman.ts's only precondition is business.transferNumber
// being set; there's no plan/tier check anywhere in that path, so it's
// available on every plan, not a paid upgrade. The call-forwarding codes
// now match the real, live dashboard component customers actually use
// (components/dashboard/settings/CallRoutingSection.tsx) — that component
// correctly distinguishes a Telstra landline's single-star *21* code from
// the double-star **21* GSM standard code used on mobiles; the old FAQ text
// used the mobile code for "Telstra and most carriers", which is wrong for
// a landline and would have sent a landline customer dialling a code that
// doesn't activate forwarding. The AI-disclosure answer was also wrong in
// the same way the /features and blog content was earlier this session — it
// implied disclosure only happens "if a patient asks", when Ella actually
// states her AI role in the opening greeting of every call.
const FAQS = [
  {
    q: "How do I set up call forwarding?",
    a: "Forward your business number to the ZyncoAI number shown in Settings → Integrations — the dial code depends on the line type, not just the carrier. A Telstra landline uses *21*[ZyncoAI number]# (single star); a mobile number on any carrier uses the standard **21*[ZyncoAI number]# GSM code (double star). Optus and TPG don't use a dial code at all — you set it from your online account instead. See the Documentation page for exact steps per line type, and use the \"Test my setup\" button once you're done to confirm it's working.",
  },
  {
    q: "Can my patients tell it's AI?",
    a: "Yes — every call opens with Ella introducing herself by name and by role, and that role always includes the word \"AI\" (an AI receptionist, or the equivalent for your industry). That's not just for if someone asks directly — it's part of the opening greeting on every single call. If a caller does ask directly, Ella always answers honestly.",
  },
  {
    q: "What happens if the AI can't answer a question?",
    a: "She takes a detailed message with the caller's name and number and notifies you immediately. If you've set a transfer number under Settings → Integrations, she also connects the live call to your team on the spot — that's available on every plan, not a paid upgrade. Before your team picks up, they hear a short spoken summary of why the caller needs them, so nobody's answering blind.",
  },
  { q: "How do I add staff members?", a: "Settings → Staff → Invite. Enter their email, choose a role, and they'll get a secure link to join." },
  {
    q: "What languages does Ella speak?",
    a: "English (Australian) only, today. Speech recognition is tuned for Australian English, with no automatic language detection or switching. Multilingual support is a genuine future add-on we're planning, not something available yet.",
  },
  { q: "Can I cancel anytime?", a: "Yes — see the full Cancellation & Refunds policy on our Terms page for the exact notice period and what happens to your data." },
  { q: "What is the setup fee?", a: "A one-time fee that varies by plan and vertical — see your industry's pricing tab on the Pricing page for the exact amount." },
  {
    q: "Do I need a new phone number for my business?",
    a: "No — you keep your existing number. ZyncoAI issues a separate dedicated number behind the scenes, and you forward your existing number to it. Callers only ever see or dial the number they already know.",
  },
  {
    q: "What if my carrier resets call forwarding, e.g. after an outage?",
    a: "Some carriers reset call forwarding after a network outage or account change, and it can happen without any notice. If calls stop reaching Ella, check that forwarding is still active under Settings → Integrations and use \"Test my setup\" to confirm — see Troubleshooting below for the full checklist.",
  },
];

export default function HelpPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="Help Centre" description="Answers to the most common questions, plus how to get more help.">
      <ResourceSection title="FAQ">
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q}>
              <p className="font-medium text-[#0f172a]">{f.q}</p>
              <p className="mt-1 text-[#475569]">{f.a}</p>
            </div>
          ))}
        </div>
      </ResourceSection>

      <ResourceSection title="Setting up your first clinic">
        <p>
          After signing up, you&apos;ll be guided through a short setup wizard: your business details (name, industry, hours), inviting your first staff
          member, and activating your voice line — which purchases a real Australian phone number for Ella to answer on. That part typically takes about
          15 minutes. From there, forwarding your existing number to it and connecting your calendar or practice software under Settings → Integrations
          are the last steps before you&apos;re fully live.
        </p>
      </ResourceSection>

      <ResourceSection title="Troubleshooting call forwarding">
        <p>
          If calls aren&apos;t reaching Ella, check: forwarding is still active with your carrier (some carriers reset it after an outage), you forwarded
          to the exact ZyncoAI number shown in Settings, and you&apos;ve used the &quot;Test my setup&quot; button to confirm end-to-end. If it still doesn&apos;t work,
          contact support with your carrier name and we&apos;ll help directly.
        </p>
      </ResourceSection>

      <ResourceSection title="Understanding your bill">
        <p>
          Your monthly charge is your plan&apos;s base price plus any minutes used beyond your included allowance, billed at your plan&apos;s per-minute overage
          rate. Add-ons appear as separate line items. Full itemised invoices are available under Settings → Billing.
        </p>
      </ResourceSection>

      <ResourceSection title="Inviting staff">
        <p>
          Go to Settings → Staff → Invite, enter their email and choose a role (Owner/Admin/Staff/Doctor). They&apos;ll get an email with a secure link to set
          their password and join your business.
        </p>
      </ResourceSection>

      <ResourceSection title="Cancellation and refund policy">
        <p>
          The full cancellation, refund, data-export, and data-retention policy now lives on our{" "}
          <Link href="/terms#cancellation" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
            Terms page
          </Link>{" "}
          — that&apos;s the canonical source. Short version: cancel any time from Settings → Billing, it takes effect at the end of your current billing period, no partial-month
          refunds, and your 7-day free trial means nothing&apos;s charged until you&apos;re sure.
        </p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
