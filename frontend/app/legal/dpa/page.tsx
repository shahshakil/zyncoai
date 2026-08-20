import Link from "next/link";
import { getLegalEntity, formatLegalParty } from "@/lib/legalEntity";

export const metadata = {
  // absolute — this title already contains "ZyncoAI"; the root layout's
  // "%s | ZyncoAI" template would otherwise repeat the brand.
  title: { absolute: "Data Processing Agreement • ZyncoAI" },
  description:
    "The Data Processing Agreement between ZyncoAI and clinic owners — what data is processed by the AI voice receptionist service and each party's obligations.",
  alternates: { canonical: "/legal/dpa" },
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-6 text-[#475569]">{children}</div>
  </section>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,.10)]" />
    <span>{children}</span>
  </li>
);

export default async function DpaPage() {
  const updated = "August 10, 2026";
  const legalParty = formatLegalParty(await getLegalEntity());

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-[#e2e8f0]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,.10),transparent_60%)]" />
          <div className="absolute -right-44 -bottom-44 h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,.10),transparent_60%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
            <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-2.5 py-1">Legal</span>
            <span>•</span>
            <span>Last updated: {updated}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">Data Processing Agreement</h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
            This Data Processing Agreement (&quot;DPA&quot;) forms part of the agreement between {legalParty}
            (&quot;Processor&quot;) and the clinic or business (&quot;Controller&quot;) using the ZyncoAI platform, and
            describes how personal information is processed on the Controller&apos;s behalf.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/privacy" className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
              <div className="text-sm font-extrabold text-[#0f172a]">On this page</div>
              <nav className="mt-3 space-y-2 text-sm">
                {[
                  ["scope", "Scope & roles"],
                  ["categories", "Categories of data processed"],
                  ["exclusions", "What is never processed"],
                  ["obligations", "Processor obligations"],
                  ["support-access", "Support access"],
                  ["controller-obligations", "Controller obligations"],
                  ["subprocessors", "Subprocessors"],
                  ["residency", "Data residency"],
                  ["breach", "Breach notification"],
                  ["deletion", "Data return & deletion"],
                  ["contact", "Contact"],
                ].map(([id, label]) => (
                  <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-1.5 text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-10">
            <Section id="scope" title="Scope & roles">
              <p>
                The Controller determines the purposes and means of processing personal information collected
                through its use of ZyncoAI. ZyncoAI acts as Processor, handling that information solely to provide
                the AI voice receptionist service, in accordance with the Controller&apos;s instructions and this DPA.
              </p>
            </Section>

            <Section id="categories" title="Categories of data processed">
              <ul className="mt-2 space-y-2">
                <Bullet>Business profile data: name, address, phone number, hours, industry.</Bullet>
                <Bullet>Staff/administrative data: names, titles, email addresses, calendar availability.</Bullet>
                <Bullet>Caller/patient contact details necessary for scheduling: name, phone number, email.</Bullet>
                <Bullet>
                  Call audio and transcripts. Audio is automatically deleted 90 days after the call where recording
                  is enabled; transcripts are retained indefinitely today — see{" "}
                  <Link href="/privacy#retention" className="text-indigo-300 underline">
                    Privacy Policy → Data retention
                  </Link>{" "}
                  for the full breakdown by data type.
                </Bullet>
              </ul>
            </Section>

            <Section id="exclusions" title="What is never processed">
              <p>
                Consistent with the My Health Records Act 2012 and Healthcare Identifiers Act 2010, ZyncoAI does not
                process clinical health records (diagnoses, medications, test results), Medicare numbers, HPI-I, or
                IHI numbers. Any such data returned by a connected system is rejected and not stored.
              </p>
            </Section>

            <Section id="obligations" title="Processor obligations">
              <ul className="mt-2 space-y-2">
                <Bullet>Process personal information only as instructed by the Controller and as described in the Privacy Policy.</Bullet>
                <Bullet>Maintain reasonable technical and organisational security measures.</Bullet>
                <Bullet>Log consent and data-access events in an audit trail.</Bullet>
                <Bullet>Notify the Controller without undue delay upon becoming aware of a data breach affecting personal information.</Bullet>
              </ul>
            </Section>

            <Section id="support-access" title="Support access">
              <p>
                Authorised Processor personnel may access the Controller&apos;s account and the personal information
                it contains solely to provide support, diagnose and resolve technical issues, and operate the
                service on the Controller&apos;s behalf — never for any other purpose. This is processing carried out
                under the Controller&apos;s instructions per <a href="#scope">Scope &amp; roles</a> above, not an
                independent use of the data.
              </p>
              <p>
                All such access is logged in the audit trail described under Processor obligations — who accessed
                the account, when, and why — including cases where call audio is reviewed to resolve a specific
                issue, which is separately flagged in that log. Any change made on the Controller&apos;s behalf during
                a support session requires additional authentication beyond a normal login and is recorded as
                performed by ZyncoAI support, distinguishable from the Controller&apos;s own account activity. The
                Controller may request a copy of this access history at any time by contacting{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="controller-obligations" title="Controller obligations">
              <p>
                The Controller is responsible for the accuracy of business registration details provided during
                onboarding, for obtaining any consents required from staff and patients prior to their information
                being entered into ZyncoAI, and for ensuring its use of the platform complies with applicable law,
                including AHPRA requirements relevant to its practitioners.
              </p>
            </Section>

            <Section id="subprocessors" title="Subprocessors">
              <p>
                The full named list — provider, what it receives, and where it processes — is published at{" "}
                <Link href="/privacy#subprocessors" className="text-indigo-300 underline">
                  Privacy Policy → Subprocessors
                </Link>{" "}
                and kept in sync with this DPA. In summary: Neon (database, Sydney), Twilio (telephony), Deepgram
                (speech-to-text), OpenAI (conversational AI), Cartesia (text-to-speech), Square (payments), Resend
                (transactional email), Upstash (Redis cache/queues), and Google/Microsoft (calendar sync, only if
                the Controller connects one). Each is bound by confidentiality and data-protection obligations no
                less protective than this DPA.
              </p>
            </Section>

            <Section id="residency" title="Data residency">
              <p>
                The database and file storage underlying ZyncoAI — business records, contacts, appointments,
                invoices, and call recordings — are hosted in Sydney, Australia. Voice processing is not: to answer
                a call, audio and transcript text are sent in real time to the overseas subprocessors listed above
                (Twilio, Deepgram, OpenAI, Cartesia — all US-processed), which is necessary to provide the service
                and is disclosed here rather than covered by a blanket no-overseas-transfer promise that wouldn&apos;t
                be accurate. Current infrastructure region status is visible to the Controller in Settings →
                Security &amp; Compliance.
              </p>
            </Section>

            <Section id="breach" title="Breach notification">
              <p>
                In the event of a data breach likely to result in serious harm, ZyncoAI will notify the Controller
                promptly and assist as reasonably required to meet obligations under the Notifiable Data Breaches
                Scheme. Incident contact: <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="deletion" title="Data return & deletion">
              <p>
                The Controller can export all personal information ZyncoAI holds on its behalf at any time —
                contacts, appointments, call history, revenue records, and staff data — as CSV/Excel/JSON directly
                from the dashboard, with no request required, including after cancellation.
              </p>
              <p className="pt-2">
                <strong>Deletion on termination is not yet automated.</strong> Ending a subscription or suspending
                an account retains the Controller&apos;s data rather than deleting it — we&apos;re stating this plainly
                rather than promising an automatic purge that doesn&apos;t exist today. To request deletion, the
                Controller can email{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>{" "}
                and we will process it manually, except where retention is required by law (e.g. issued tax
                invoices).
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                Questions about this DPA can be sent to{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>
          </section>
        </div>
      </div>
    </main>
  );
}
