import type { Metadata } from "next";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "Documentation | ZyncoAI",
  description: "How ZyncoAI works, call forwarding setup, connecting your practice software, and using your dashboard.",
};

export default function DocsPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="Documentation" description="Plain-English guides to setting up and running ZyncoAI.">
      <ResourceSection title="How ZyncoAI works">
        <p>
          ZyncoAI answers your business phone line with an AI receptionist called Ella. When someone calls your existing number, the call is routed to
          ZyncoAI, Ella answers instantly, understands what the caller needs in natural conversation, and — depending on your setup — books an
          appointment directly into your calendar, answers a common question, or takes a message and flags it for your team.
        </p>
        <p>
          Every call is logged with a transcript in your dashboard, so nothing is a black box: you can always see exactly what was said and what Ella
          did as a result.
        </p>
      </ResourceSection>

      <ResourceSection title="The voice technology behind Ella">
        <p>
          ZyncoAI is built on <span className="font-medium text-[#0f172a]">Pipecat</span>, an open-source real-time voice AI framework, orchestrating
          four specialist services rather than one general-purpose model trying to do everything:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-medium text-[#0f172a]">Twilio Media Streams</span> carries the call audio in real time — this is also how ZyncoAI answers on your existing business number without you needing any new hardware.</li>
          <li><span className="font-medium text-[#0f172a]">Deepgram</span> (Nova-2) turns the caller&apos;s speech into text, tuned for Australian English so accents and local place names are recognised correctly.</li>
          <li>An LLM reasons over that text — deciding whether to answer a question, check availability, or book an appointment — and calls the relevant tool.</li>
          <li><span className="font-medium text-[#0f172a]">Cartesia</span> converts the response back into natural-sounding Australian speech, with Deepgram Aura as an automatic fallback voice if Cartesia is ever unavailable.</li>
        </ul>
        <p>
          Every leg of that pipeline is monitored in real time, and the whole system runs across multiple concurrent call workers load-balanced behind
          the scenes — so Ella keeps answering even if one component has a bad moment, and multiple callers can reach your business at once.
        </p>
      </ResourceSection>

      <ResourceSection title="Setting up call forwarding">
        <p>ZyncoAI issues you a dedicated number. To have your existing business number ring through to it, set up call forwarding with your carrier:</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#0f172a]">Telstra</p>
            <p className="mt-1 text-xs text-[#475569]">Dial <span className="text-[#0f172a]">**21*[ZyncoAI number]#</span> then call to activate unconditional forwarding.</p>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#0f172a]">Optus</p>
            <p className="mt-1 text-xs text-[#475569]">Enable &quot;Divert all calls&quot; in the Optus My Account app, or dial the same **21* code on most plans.</p>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#0f172a]">TPG</p>
            <p className="mt-1 text-xs text-[#475569]">Log in to My TPG → Phone → Call Forwarding, and set the ZyncoAI number as the forward-to destination.</p>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#0f172a]">Mobile (any carrier)</p>
            <p className="mt-1 text-xs text-[#475569]">Use your phone&apos;s Settings → Calls → Call Forwarding to forward always, or only when busy/unanswered.</p>
          </div>
        </div>
        <p>
          Once forwarding is active, use the &quot;Test my setup&quot; button in Settings → Integrations → Call Routing to place a real test call and confirm it
          reaches ZyncoAI correctly.
        </p>
      </ResourceSection>

      <ResourceSection title="Connecting your practice software">
        <p>
          Under Settings → Integrations, you can connect Cliniko, Best Practice, Medical Director, Nookal, Zanda/Power Diary, Mindbody, Jane App, Core
          Plus, a generic FHIR endpoint, or a generic outbound webhook. Credentials are encrypted at rest and only used to keep staff and booking data in
          sync — never shared with a third party.
        </p>
      </ResourceSection>

      <ResourceSection title="Understanding your dashboard">
        <p>Every plan includes the same three-tab dashboard:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-medium text-[#0f172a]">Overview</span> — today&apos;s appointments, AI call activity, and patient status at a glance.</li>
          <li><span className="font-medium text-[#0f172a]">AI Voice Operations</span> — live calls, AI performance metrics, and transfer/escalation analytics.</li>
          <li><span className="font-medium text-[#0f172a]">Clinical & Billing</span> — triage flags, patient pipeline, documents, claims, and revenue reporting.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="Managing staff and roles">
        <p>Invite staff from Settings → Staff. Each person gets one of four roles:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-medium text-[#0f172a]">Owner / Admin</span> — full access, including financials and integrations.</li>
          <li><span className="font-medium text-[#0f172a]">Staff</span> — appointments and patient records, no financial data.</li>
          <li><span className="font-medium text-[#0f172a]">Doctor</span> — their own schedule and patients only.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="Booking and appointment guide">
        <p>
          Ella checks real-time availability against each provider&apos;s working hours before offering a slot, so double-bookings aren&apos;t possible. Every
          booking Ella makes appears instantly in your dashboard and, if connected, in your practice software.
        </p>
      </ResourceSection>

      <ResourceSection title="Understanding your invoices and billing">
        <p>
          Your monthly invoice is your plan&apos;s base price plus any minutes used beyond your included allowance, billed at your plan&apos;s overage rate,
          plus any add-ons as separate line items. Full itemised invoices are available under Settings → Billing, alongside your payment method and
          billing history.
        </p>
      </ResourceSection>

      <ResourceSection title="Australian compliance guide">
        <p>
          ZyncoAI is built with the Australian Privacy Act 1988 in mind — patient data handled by the platform stays within the scope you configure, and
          sensitive fields are encrypted at rest. For Medicare, DVA, and private health billing, ZyncoAI tracks the information you enter but never submits
          claims directly to Medicare or a health fund on your behalf. AHPRA&apos;s guidance on advertising and patient communication applies to how your
          practice uses ZyncoAI, the same as it would to any receptionist — we recommend reviewing your own obligations with your practice&apos;s compliance
          officer.
        </p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
