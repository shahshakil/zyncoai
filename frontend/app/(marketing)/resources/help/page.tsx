import type { Metadata } from "next";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "Help Centre | ZyncoAI",
  description: "FAQs, troubleshooting, billing, staff invites, and the ZyncoAI cancellation and refund policy.",
};

const FAQS = [
  { q: "How do I set up call forwarding?", a: "Forward your business number to the ZyncoAI number shown in Settings. Telstra and most carriers use **21*[number]#, Optus has a \"Divert all calls\" toggle in My Account, and TPG has a Call Forwarding setting in My TPG — see the Documentation page for exact steps per carrier." },
  { q: "Can my patients tell it's AI?", a: "Ella sounds natural, and most patients don't realise until they're told. We don't recommend hiding it if a patient asks directly — she'll say so." },
  { q: "What happens if the AI can't answer a question?", a: "She transfers to a human — either by queuing a callback or, on supported plans, transferring the live call straight away." },
  { q: "How do I add staff members?", a: "Settings → Staff → Invite. Enter their email, choose a role, and they'll get a secure link to join." },
  { q: "What languages does Ella speak?", a: "15+ languages, detected automatically, including Mandarin, Hindi, Arabic, and Vietnamese." },
  { q: "Can I cancel anytime?", a: "Yes — 30 days' notice, no lock-in contract beyond that." },
  { q: "What is the setup fee?", a: "AUD $499 one-time, across every plan." },
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
          After signing up, you&apos;ll be guided through: adding your business details, inviting your first staff member, connecting your calendar or practice
          software, and setting up call forwarding. The whole process takes about 15 minutes.
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
          Cancel any time from Settings → Billing with 30 days&apos; notice — there&apos;s no lock-in contract beyond that. We don&apos;t offer partial-month
          refunds, but the 7-day free trial means you can try ZyncoAI risk-free before you&apos;re charged anything.
        </p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
