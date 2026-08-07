import Link from "next/link";

export const metadata = {
  title: "Privacy Policy • ZyncoAI",
  description:
    "How ZyncoAI collects, stores, and protects personal information under the Australian Privacy Act 1988, the My Health Records Act 2012, and related healthcare regulations.",
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

export default function PrivacyPage() {
  const updated = "August 7, 2026";

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

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">Privacy Policy</h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
            ZyncoAI (“ZyncoAI”, “we”, “us”) provides an AI voice receptionist for healthcare and other service
            businesses in Australia. This policy explains what personal information we collect, why, and how it is
            protected, in accordance with the <strong>Privacy Act 1988 (Cth)</strong> and the Australian Privacy
            Principles (APPs).
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/terms" className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
              Terms of Service
            </Link>
            <Link href="/legal/dpa" className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
              Data Processing Agreement
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
                  ["what-we-collect", "What we collect"],
                  ["health-records", "Clinical & health records"],
                  ["identifiers", "Healthcare identifiers"],
                  ["how-we-use", "How we use information"],
                  ["adm", "Automated decision-making"],
                  ["consent", "Consent"],
                  ["access-correction", "Access & correction"],
                  ["storage", "Data storage & sovereignty"],
                  ["sharing", "Disclosure to third parties"],
                  ["support-access", "Support access"],
                  ["breach", "Data breach notification"],
                  ["cyber-security", "Security practices"],
                  ["marketing", "Marketing & unsubscribe"],
                  ["calls", "Call recording"],
                  ["tga", "Administrative tool only"],
                  ["ahpra", "Practitioner information"],
                  ["contact", "Contact us"],
                ].map(([id, label]) => (
                  <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-1.5 text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-10">
            <Section id="what-we-collect" title="What we collect">
              <p>When a clinic owner signs up and uses ZyncoAI, we collect:</p>
              <ul className="mt-2 space-y-2">
                <Bullet>Business details: business name, industry, address, phone number, opening hours.</Bullet>
                <Bullet>Staff/administrative data: staff names, job titles, email addresses, and calendar availability.</Bullet>
                <Bullet>Caller/patient contact details necessary to book an appointment: name, phone number, and email (where provided).</Bullet>
                <Bullet>Call metadata and transcripts, used to operate the voice receptionist and improve service quality.</Bullet>
              </ul>
            </Section>

            <Section id="health-records" title="Clinical & health records">
              <p>
                In accordance with the <strong>My Health Records Act 2012 (Cth)</strong>, ZyncoAI never stores or
                accesses clinical health records. Staff and practice-management sync imports administrative data
                only — name, title, email, and calendar availability. If any connected system (including any FHIR
                endpoint) returns clinical data such as diagnoses, medications, or test results, that data is
                rejected and not stored, and the rejected attempt is recorded in our audit log.
              </p>
            </Section>

            <Section id="identifiers" title="Healthcare identifiers">
              <p>
                In accordance with the <strong>Healthcare Identifiers Act 2010 (Cth)</strong>, ZyncoAI does not
                collect or store Healthcare Provider Identifiers (HPI-I) or Individual Healthcare Identifiers (IHI).
                These are not required for scheduling and are not needed to operate the platform.
              </p>
            </Section>

            <Section id="how-we-use" title="How we use information">
              <ul className="mt-2 space-y-2">
                <Bullet>To operate the AI voice receptionist: answering calls, booking, rescheduling, and cancelling appointments.</Bullet>
                <Bullet>To sync appointments with a staff member&apos;s connected calendar.</Bullet>
                <Bullet>To send transactional notifications (booking confirmations, reminders).</Bullet>
                <Bullet>Personal information is never used for a purpose other than what is disclosed here or at the point of collection.</Bullet>
              </ul>
            </Section>

            <Section id="adm" title="Automated decision-making">
              <p>
                ZyncoAI uses AI to assist with appointment booking. No decisions significantly affecting your rights
                are made without human oversight — clinic staff review all bookings. Callers are told they are
                speaking with an AI assistant, Ella, at the start of every call. See our{" "}
                <Link href="/ai-transparency" className="text-indigo-300 underline">
                  AI Transparency page
                </Link>{" "}
                for the models we use, how they make decisions, and how to request a human instead.
              </p>
            </Section>

            <Section id="consent" title="Consent">
              <p>
                Before any OAuth connection or API sync begins, clinic owners are shown a consent notice describing
                exactly what will and will not be imported, and must explicitly agree before the connection
                proceeds. Consent timestamps are recorded in our audit log.
              </p>
            </Section>

            <Section id="access-correction" title="Access & correction">
              <p>
                Staff members have the right to access the personal information ZyncoAI holds about them, and to
                request correction of inaccurate information. Requests can be made by the clinic owner via
                Settings, or directly to <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="storage" title="Data storage & sovereignty">
              <p>
                We aim to store personal information in Australian data centres wherever possible, and do not send
                personal data outside Australia without consent. If our infrastructure provider&apos;s configured region
                does not currently match this commitment, we disclose that status in your dashboard&apos;s Security &amp;
                Compliance settings.
              </p>
            </Section>

            <Section id="sharing" title="Disclosure to third parties">
              <p>
                We only share personal information with third parties you explicitly connect (e.g. Google Calendar,
                or a practice-management system you configure) and with service providers who help us operate the
                platform (e.g. hosting, email delivery), under contractual confidentiality obligations.
              </p>
            </Section>

            <Section id="support-access" title="Support access">
              <p>
                Authorised ZyncoAI personnel may access a business&apos;s account and the personal information it
                holds where necessary to provide customer support, diagnose and resolve technical issues, and
                operate the platform — for example, investigating a support request you raise, restoring service
                after an incident, or verifying a reported bug. This access is never used for any other purpose.
              </p>
              <p>
                All such access is logged in an internal, auditable trail — who accessed the account, when, and why
                — including cases where a call recording is reviewed to resolve a specific issue, which is
                separately flagged in that log. Any change made on your behalf during a support session requires
                additional authentication beyond a normal login and is recorded as performed by ZyncoAI support,
                distinguishable from your own account activity. You can request a copy of this access history for
                your account at any time by contacting{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="breach" title="Data breach notification">
              <p>
                ZyncoAI complies with the <strong>Notifiable Data Breaches (NDB) Scheme</strong>. If a data breach
                occurs that is likely to result in serious harm to affected individuals, we will notify the Office
                of the Australian Information Commissioner (OAIC) and affected individuals as required by law. Our
                incident response contact is <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="cyber-security" title="Security practices">
              <p>
                ZyncoAI maintains security practices aligned with the <strong>Australian Cyber Security Act 2024
                (Cth)</strong>, including encryption of data in transit and at rest, access controls, and incident
                response procedures. See the <a href="#breach">data breach notification</a> section above for our
                obligations if a security incident occurs.
              </p>
            </Section>

            <Section id="marketing" title="Marketing & unsubscribe">
              <p>
                In accordance with the <strong>Spam Act 2003 (Cth)</strong>, any email sent to imported staff
                includes a functioning unsubscribe link, and we never send marketing emails without explicit
                consent. Transactional emails (such as booking notifications) are exempt as they are not marketing
                communications.
              </p>
            </Section>

            <Section id="calls" title="Call recording">
              <p>
                In accordance with the <strong>Telecommunications (Interception and Access) Act 1979 (Cth)</strong>,
                callers are informed at the start of each call that the call may be recorded. This disclosure is
                logged per call in our audit log. A practice can turn this disclosure off in Settings, in which case
                it is not given and not logged for that practice&apos;s calls.
              </p>
              <p>
                Where a practice has recording enabled, audio is only ever captured for calls where the disclosure
                above was actually given, stored securely, and retained for up to 90 days before being
                automatically deleted. A practice owner can delete a recording earlier at any time from the
                dashboard.
              </p>
            </Section>

            <Section id="tga" title="Administrative tool only">
              <p>
                ZyncoAI is an administrative tool only. It does not provide medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare professional for medical concerns.
              </p>
            </Section>

            <Section id="ahpra" title="Practitioner information">
              <p>
                Where a practitioner&apos;s title (e.g. &quot;Dr&quot;) is imported from a connected practice-management system,
                that title is provided as-is by your own software and is not independently verified by ZyncoAI. We
                do not store AHPRA registration numbers and do not make claims about practitioner qualifications.
              </p>
            </Section>

            <Section id="contact" title="Contact us">
              <p>
                Questions about this policy, or requests to access or correct your personal information, can be
                sent to <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>
          </section>
        </div>
      </div>
    </main>
  );
}
