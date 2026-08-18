import Link from "next/link";
import { getLegalEntity, formatLegalParty } from "@/lib/legalEntity";

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

export default async function PrivacyPage() {
  const posted = "August 18, 2026";
  const effective = "August 18, 2026";
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
            <span>Posted: {posted}</span>
            <span>•</span>
            <span>Effective: {effective}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">Privacy Policy</h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
            ZyncoAI (“ZyncoAI”, “we”, “us”) provides an AI voice receptionist for healthcare and other service
            businesses in Australia. This policy explains what personal information we collect, why, and how it is
            protected, in accordance with the <strong>Privacy Act 1988 (Cth)</strong> and the Australian Privacy
            Principles (APPs).
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-[#94a3b8]">ZyncoAI is operated by {legalParty}.</p>

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
                  ["retention", "Data retention"],
                  ["adm", "Automated decision-making"],
                  ["consent", "Consent"],
                  ["rights", "Access, correction, deletion & export"],
                  ["storage", "Data storage & cross-border processing"],
                  ["subprocessors", "Subprocessors"],
                  ["third-party-links", "Third-party links"],
                  ["cookies", "Cookies & analytics"],
                  ["no-ad-sale", "No selling, no ad networks"],
                  ["support-messages", "Support messages & the Support Hub"],
                  ["support-access", "Support access"],
                  ["breach", "Data breach notification"],
                  ["complaints", "How to complain"],
                  ["cyber-security", "Security practices"],
                  ["marketing", "Marketing & unsubscribe"],
                  ["calls", "Call recording"],
                  ["tga", "Administrative tool only"],
                  ["ahpra", "Practitioner information"],
                  ["children", "Children's privacy"],
                  ["contact", "Contact us"],
                  ["changelog", "Change log"],
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
              <p>
                For medical and dental practices, this same data-minimisation approach is how we operate within
                state health-privacy legislation — including the <strong>Health Records and Information Privacy
                Act 2002 (NSW)</strong> and the <strong>Health Records Act 2001 (Vic)</strong> — since booking and
                calendar administration does not constitute the collection of health information under either Act.
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

            <Section id="retention" title="Data retention">
              <p>
                Retention differs by data type, and we&apos;d rather state that plainly than imply a uniform policy
                that doesn&apos;t exist yet:
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>
                  <strong>Call recordings (audio)</strong> — where a practice has recording enabled, audio is
                  automatically deleted 90 days after the call. This is enforced by a daily automated job, not a
                  manual process, and a practice owner can delete a recording earlier at any time from the dashboard.
                </Bullet>
                <Bullet>
                  <strong>Call transcripts are not covered by that same 90-day deletion</strong> — they&apos;re kept
                  indefinitely today, separately from the audio. We&apos;re calling this out explicitly because it&apos;s
                  reasonable to assume transcript and audio retention match; they currently don&apos;t.
                </Bullet>
                <Bullet>
                  <strong>Contact (caller) records, appointments, invoices, and account activity logs</strong> are
                  kept indefinitely while your account is active, and are <strong>not automatically deleted</strong>{" "}
                  when a subscription is cancelled or an account is suspended — see{" "}
                  <a href="#rights">Access, correction, deletion &amp; export</a> below for how to request deletion.
                </Bullet>
                <Bullet>
                  Individual staff can delete a specific contact record from the dashboard at any time; this removes
                  that person&apos;s appointment and note history but does not retroactively delete call recordings or
                  transcripts already linked to them (those are unlinked, not erased).
                </Bullet>
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

            <Section id="rights" title="Access, correction, deletion & export">
              <p>
                What&apos;s genuinely self-service today, and what requires contacting us directly — stated separately
                so this section doesn&apos;t overpromise either way:
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>
                  <strong>Export (self-service, works today):</strong> a clinic owner or authorised staff member can
                  export contacts, appointments, call history, revenue records, and staff data as CSV/Excel/JSON
                  directly from the relevant dashboard page, at any time, with no request needed.
                </Bullet>
                <Bullet>
                  <strong>Correction:</strong> staff can correct their own details, and clinic owners can correct
                  contact/caller details, directly in the dashboard. For anything not editable there, email{" "}
                  <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
                </Bullet>
                <Bullet>
                  <strong>Deletion of a specific contact:</strong> a clinic owner can delete an individual caller/
                  contact record from the dashboard (see <a href="#retention">Data retention</a> above for what this
                  does and doesn&apos;t remove).
                </Bullet>
                <Bullet>
                  <strong>Full account deletion / erasure requests do not yet have a self-service path.</strong> If
                  you want your account, or a specific individual&apos;s data, deleted beyond what the dashboard
                  controls above cover, email{" "}
                  <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>{" "}
                  and we will process the request manually. We&apos;re stating this plainly rather than implying an
                  automated erasure process exists — it doesn&apos;t yet.
                </Bullet>
              </ul>
            </Section>

            <Section id="storage" title="Data storage & cross-border processing">
              <p>
                Our database and file storage — business records, contacts, appointments, invoices, and call
                recordings — are hosted in Sydney, Australia (AWS/Neon region ap-southeast-2). That part is a
                straightforward, unqualified fact: your stored data sits in an Australian data centre.
              </p>
              <p>
                Voice processing does not stay in Australia, and we want to be precise about that rather than let
                the storage claim above imply otherwise. To answer a call, audio and the resulting transcript text
                are sent to overseas AI providers in real time — see{" "}
                <a href="#subprocessors">Subprocessors</a> below for exactly which ones, what each receives, and
                where they process it. Card payments, some outbound email, and our Redis cache also involve
                providers outside Australia. Current infrastructure region status is visible to you directly in
                Settings → Security &amp; Compliance.
              </p>
            </Section>

            <Section id="subprocessors" title="Subprocessors">
              <p>
                Every third party that receives personal information as part of operating ZyncoAI, what they
                receive, why, and where they process it:
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-[#e2e8f0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[#0f172a]">
                    <tr>
                      <th className="p-3 font-bold">Provider</th>
                      <th className="p-3 font-bold">What it receives</th>
                      <th className="p-3 font-bold">Purpose</th>
                      <th className="p-3 font-bold">Processing location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Neon (database)</td>
                      <td className="p-3">All account, contact, appointment, invoice, and call-record data</td>
                      <td className="p-3">Primary database</td>
                      <td className="p-3">Australia (Sydney)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Twilio</td>
                      <td className="p-3">Caller phone number, business phone number, call audio in transit</td>
                      <td className="p-3">Telephony — carries every call in and out</td>
                      <td className="p-3">United States</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Deepgram</td>
                      <td className="p-3">Raw caller audio</td>
                      <td className="p-3">Speech-to-text (converts what the caller says into text)</td>
                      <td className="p-3">United States</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">OpenAI</td>
                      <td className="p-3">Live transcript text, conversation context, relevant booking/business data, and — when you send us a support message — the content of that message</td>
                      <td className="p-3">The conversational AI that decides what Ella says and does, and (internal-only) drafts a suggested reply and language/intent tags for support messages — never sent automatically, see <a href="#support-messages">Support messages</a> below</td>
                      <td className="p-3">United States</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Cartesia</td>
                      <td className="p-3">Ella&apos;s response text</td>
                      <td className="p-3">Text-to-speech (generates Ella&apos;s voice audio)</td>
                      <td className="p-3">United States</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Square</td>
                      <td className="p-3">Billing contact details and a tokenised payment reference — never a raw card number</td>
                      <td className="p-3">Payment processing (PCI DSS compliant; card numbers are vaulted by Square, not stored by us)</td>
                      <td className="p-3">Processed via Square&apos;s network</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">PayPal</td>
                      <td className="p-3">Billing contact details and a tokenised payment reference — never a raw card number</td>
                      <td className="p-3">Payment processing (alternative to Square)</td>
                      <td className="p-3">Processed via PayPal&apos;s network</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Resend</td>
                      <td className="p-3">Recipient email address, name, and the content of transactional emails (confirmations, invoices, alerts)</td>
                      <td className="p-3">Transactional email delivery</td>
                      <td className="p-3">United States</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Upstash (Redis)</td>
                      <td className="p-3">Session tokens, job queue data, rate-limit counters</td>
                      <td className="p-3">Caching and background job infrastructure</td>
                      <td className="p-3">Region configured per deployment — see Settings → Security &amp; Compliance for the current value</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#0f172a]">Google / Microsoft</td>
                      <td className="p-3">Calendar availability and event details — only if you connect a calendar</td>
                      <td className="p-3">Calendar sync, opt-in per practice</td>
                      <td className="p-3">Google/Microsoft&apos;s own infrastructure</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Every subprocessor above is bound by confidentiality and data-protection terms in our agreement with
                them. If you connect an additional third party yourself — a practice-management system, an extra
                calendar — that connection and its data flow are covered under{" "}
                <a href="#consent">Consent</a> above, not this list, since it&apos;s a service you chose to add rather
                than one we use to run the core platform.
              </p>
            </Section>

            <Section id="third-party-links" title="Third-party links">
              <p>
                Our marketing site and Help Centre sometimes link to third parties — for example the Square or
                PayPal checkout pages during signup, or Google/Microsoft&apos;s own sign-in and consent screens when you
                connect a calendar. Those third parties have their own privacy policies, which we don&apos;t control and
                this policy doesn&apos;t cover — check their site directly before sharing information with them.
              </p>
            </Section>

            <Section id="cookies" title="Cookies & analytics">
              <p>
                Our marketing site and dashboard use PostHog for product analytics, including session recording.
                Most input fields are masked by default, with one deliberate exception: email address fields are
                not masked, so an email typed into a form (e.g. during signup) can appear in a recorded session.
                We don&apos;t currently show a cookie-consent banner, and PostHog begins collecting data when a page
                loads rather than waiting for opt-in — if you&apos;d prefer not to be tracked, most browsers let you
                block third-party cookies, which stops it. PostHog cookies are third-party (served from
                posthog.com infrastructure, not our own domain), and IP addresses are captured by default rather
                than anonymised. Google Analytics is integrated in code but not currently active on the live site.
              </p>
            </Section>

            <Section id="no-ad-sale" title="No selling, no ad networks">
              <p>
                We do not sell your personal information, and we do not share it with advertising networks.
                ZyncoAI has no Google Ads, Meta/Facebook, LinkedIn, or TikTok advertising pixels anywhere on our
                site or in our product, and we don&apos;t run retargeting or ad-audience campaigns — so there&apos;s no
                advertising data flow to disclose. The only analytics we use is PostHog (see{" "}
                <a href="#cookies">Cookies &amp; analytics</a> above), which is product analytics, not advertising.
              </p>
            </Section>

            <Section id="support-messages" title="Support messages & the Support Hub">
              <p>
                When you send us a message — through the contact form, the Help widget, or the{" "}
                <Link href="/support" className="text-indigo-300 underline">Support Hub</Link> — we collect your
                name, email, the topic you selected, the message itself, and, optionally, a screenshot you attach
                and a reference/link (like a call ID or booking) you provide to help us investigate. Every message
                gets a reference number (e.g. &quot;ZS-1042&quot;) so you and we can both track it.
              </p>
              <p>
                An attached screenshot is validated as a real image before it&apos;s stored (decoded and re-encoded,
                which also strips anything else embedded in the file) — this isn&apos;t virus scanning, and we say so
                rather than imply a stronger guarantee than what actually happens. It&apos;s stored privately and only
                visible to authorised staff.
              </p>
              <p>
                We use AI (see <a href="#subprocessors">Subprocessors</a> above) to draft an internal suggested
                reply, grounded strictly in our own published Help Centre/FAQ content, and to tag the likely topic
                (e.g. billing, urgent) for routing. That draft is for our staff&apos;s eyes only — it is never sent to
                you automatically; a real person always reviews, edits, and sends the actual reply. If your message
                isn&apos;t in English, we may also generate a machine translation of it for our internal review.
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

            <Section id="complaints" title="How to complain">
              <p>
                If you&apos;re unhappy with how we&apos;ve handled your personal information, tell us first — email{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>{" "}
                with what happened, and we&apos;ll investigate and respond.
              </p>
              <p>
                If you&apos;re not satisfied with our response, or want to escalate directly, you can lodge a
                complaint with the Office of the Australian Information Commissioner (OAIC) — 1300 363 992, or{" "}
                <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">
                  www.oaic.gov.au
                </a>
                . See <a href="#breach">Data breach notification</a> above for our own obligations if a breach occurs.
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

            <Section id="children" title="Children's privacy">
              <p>
                ZyncoAI is a business tool for clinics and other service businesses — it isn&apos;t a consumer product,
                and it isn&apos;t directed at or marketed to children. We don&apos;t knowingly collect personal information
                from anyone under 16. If you believe a child has provided us with personal information, contact us
                at <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>{" "}
                and we will delete it.
              </p>
            </Section>

            <Section id="contact" title="Contact us">
              <p>
                Questions about this policy, or requests to access or correct your personal information, can be
                sent to <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>

            <Section id="changelog" title="Change log">
              <p>
                <strong>August 18, 2026</strong> — Added: a children&apos;s privacy statement, a general complaints
                process (including the OAIC escalation path), a third-party-links note, an explicit statement that
                we don&apos;t sell personal information or share it with advertising networks, a description of
                Support Hub message data, Posted/Effective dates (replacing the single &quot;last updated&quot; label), and
                this change log. Updated the subprocessors table to add PayPal and to reflect AI Support Assist&apos;s
                use of OpenAI. Clarified that email address fields are a deliberate exception to input masking in
                session recordings. Nothing was removed.
              </p>
              <p>
                <strong>August 10, 2026</strong> — This policy&apos;s previous revision date. A change log wasn&apos;t kept
                before August 18, 2026, so earlier history isn&apos;t listed here.
              </p>
            </Section>
          </section>
        </div>
      </div>
    </main>
  );
}
