import Link from "next/link";
import { getLegalEntity, formatLegalParty } from "@/lib/legalEntity";

export const metadata = {
  title: "Terms of Service • ZyncoAI",
  description:
    "ZyncoAI Terms of Service covering use of the platform, accounts, security, acceptable use, and legal terms.",
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

export default async function TermsPage() {
  const updated = "August 10, 2026";
  const legalParty = formatLegalParty(await getLegalEntity());

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Top hero */}
      <div className="relative overflow-hidden border-b border-[#e2e8f0]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,.10),transparent_60%)]" />
          <div className="absolute -right-44 -bottom-44 h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,.10),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,23,42,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,.05) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(circle at 30% 10%, black, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 30% 10%, black, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
            <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-2.5 py-1">
              Legal
            </span>
            <span>•</span>
            <span>Last updated: {updated}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
            Terms of Service
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
            These Terms govern your use of ZyncoAI (“ZyncoAI”, “we”, “us”) — an AI voice
            receptionist that answers calls, books appointments, and automates the follow-up
            that comes next — including the website, dashboard, and APIs. By accessing or using
            ZyncoAI, you agree to these Terms.
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-[#94a3b8]">ZyncoAI is operated by {legalParty}.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/security"
              className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition"
            >
              Security
            </Link>
            <Link
              href="/brain"
              className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition"
            >
              Status
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition"
            >
              Docs
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition"
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
              <div className="text-sm font-extrabold text-[#0f172a]">On this page</div>
              <nav className="mt-3 space-y-2 text-sm">
                {[
                  ["acceptance", "Acceptance & eligibility"],
                  ["accounts", "Accounts & access"],
                  ["usage", "Acceptable use"],
                  ["connectors", "Connectors & third-party data"],
                  ["recording-consent", "Recording & outbound-calling consent"],
                  ["ai", "How Ella works"],
                  ["adm", "Automated decision making"],
                  ["ai-transparency", "AI transparency & human handling"],
                  ["tga", "TGA disclaimer"],
                  ["billing", "Billing & plans"],
                  ["cancellation", "Cancellation & refunds"],
                  ["availability", "Service availability"],
                  ["security", "Security & incidents"],
                  ["support-access", "Support access"],
                  ["incident-reporting", "Incident reporting obligations"],
                  ["nsw-workplace", "NSW workplace digital systems"],
                  ["ip", "Intellectual property"],
                  ["warranty", "Disclaimers"],
                  ["liability", "Limitation of liability"],
                  ["termination", "Termination"],
                  ["governing-law", "Governing law"],
                  ["changes", "Changes to Terms"],
                  ["contact", "Contact"],
                ].map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block rounded-lg px-2 py-1.5 text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-5 rounded-xl border border-[#e2e8f0] bg-slate-100 p-4">
                <div className="text-sm font-bold text-[#0f172a]">Quick links</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href="/login"
                    className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 transition"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 transition"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/product"
                    className="rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-1.5 text-xs text-[#475569] hover:bg-slate-100 transition"
                  >
                    Product
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <section className="lg:col-span-8 space-y-10">
            <Section id="acceptance" title="Acceptance & eligibility">
              <p>
                You must be at least 18 years old (or the age of majority in your jurisdiction)
                to use ZyncoAI. If you use ZyncoAI on behalf of a company, you represent that
                you are authorized to bind that company to these Terms.
              </p>
            </Section>

            <Section id="accounts" title="Accounts & access">
              <ul className="mt-2 space-y-2">
                <Bullet>
                  Keep your login credentials confidential and use strong passwords.
                </Bullet>
                <Bullet>
                  You are responsible for activity on your account, including workflows you
                  create and integrations you connect.
                </Bullet>
                <Bullet>
                  If you suspect unauthorized access, rotate credentials and contact support.
                </Bullet>
              </ul>
            </Section>

            <Section id="usage" title="Acceptable use">
              <p>You agree not to misuse the platform. Prohibited conduct includes:</p>
              <ul className="mt-2 space-y-2">
                <Bullet>Breaking laws or violating third-party rights, including telemarketing and privacy law that applies to how you use ZyncoAI to contact people.</Bullet>
                <Bullet>Attempting to bypass security controls or rate limits.</Bullet>
                <Bullet>Uploading malware or using ZyncoAI to distribute malicious content.</Bullet>
                <Bullet>Intentionally degrading the service — abusive scraping, denial of service, or similar.</Bullet>
                <Bullet>Using ZyncoAI to collect, store, or process sensitive data (e.g. health information) beyond what this service is designed to handle — see our Privacy Policy&apos;s <Link href="/privacy#health-records" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">Clinical &amp; health records</Link> section for what we deliberately don&apos;t store.</Bullet>
              </ul>
            </Section>

            <Section id="connectors" title="Connectors & third-party data">
              <p>
                ZyncoAI can connect to services you choose — Google Calendar, Microsoft Outlook/365 Calendar, and
                supported practice-management systems — to sync availability and bookings. You control what you
                connect.
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>You must have permission to access and process any data you connect to ZyncoAI through a third-party integration.</Bullet>
                <Bullet>Each connected provider&apos;s own terms apply to that integration in addition to these Terms.</Bullet>
                <Bullet>You can disconnect any integration at any time from Settings.</Bullet>
              </ul>
              <p className="pt-2">
                For our security posture, see{" "}
                <Link href="/security" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /security
                </Link>
                .
              </p>
            </Section>

            <Section id="recording-consent" title="Recording & outbound-calling consent">
              <p>
                Some ZyncoAI features are regulated activity where responsibility is split between us and you —
                stated plainly here because it matters for both of us:
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>
                  <strong>Call recording:</strong> ZyncoAI provides the disclosure and recording tooling (see{" "}
                  <Link href="/privacy#calls" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                    Call recording
                  </Link>{" "}
                  in our Privacy Policy for exactly how disclosure works). <strong>You are responsible</strong> for
                  having the right to record your callers under the law that applies to your business — including
                  any state-specific surveillance/listening-device requirements — and for keeping the disclosure
                  setting on unless you have your own lawful basis for turning it off.
                </Bullet>
                <Bullet>
                  <strong>Outbound calling</strong> (e.g. recall reminders, cancellation-backfill waitlist offers):
                  ZyncoAI provides consent-capture and opt-out tooling for these features.{" "}
                  <strong>You are responsible</strong> for the accuracy of any consent you record for a contact, for
                  honouring an opt-out, and for your own compliance with the Do Not Call Register Act 2006 and the
                  ACMA Telemarketing and Research Calls Industry Standard for any outbound calling you run through
                  the platform.
                </Bullet>
              </ul>
            </Section>

            <Section id="ai" title="How Ella works">
              <p>
                Ella is ZyncoAI&apos;s AI voice receptionist. She answers calls, books/reschedules/cancels
                appointments against your real connected calendar, and answers common questions using the
                information you configure. AI outputs — what Ella says, and any booking she makes — can occasionally
                be wrong or incomplete. You are responsible for reviewing your booking/calendar data and correcting
                anything Ella got wrong, the same as you would for a human receptionist&apos;s mistake.
              </p>
            </Section>

            <Section id="adm" title="Automated decision making">
              <p>
                ZyncoAI uses AI to assist with appointment booking. No decisions significantly affecting your rights
                are made without human oversight — clinic staff review all bookings before they are treated as final.
              </p>
            </Section>

            <Section id="ai-transparency" title="AI transparency & right to request human handling">
              <p>
                Callers are informed they are speaking with an AI assistant, Ella, at the start of every call. Full
                details of the AI models we use, how they make decisions, our data retention periods, and how to
                make a complaint are published at{" "}
                <Link href="/ai-transparency" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /ai-transparency
                </Link>
                . Any caller may opt out of speaking with the AI and request a human receptionist at any time by
                saying &quot;transfer me to a person.&quot;
              </p>
            </Section>

            <Section id="tga" title="Therapeutic Goods Administration (TGA) disclaimer">
              <p>
                ZyncoAI is an administrative tool only. It does not provide medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare professional for medical concerns.
              </p>
            </Section>

            <Section id="billing" title="Billing & plans">
              <p>
                Every plan starts with a <strong>7-day free trial — no card required to start.</strong> If your
                trial ends without you choosing a plan, calling is paused (your dashboard stays fully accessible)
                until you pick one; nothing is charged automatically at trial end.
              </p>
              <p className="pt-2">
                Plans are priced per real published minute allowance (see{" "}
                <Link href="/pricing" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /pricing
                </Link>{" "}
                for your industry&apos;s current rates) — <strong>call minutes over your plan&apos;s allowance are
                billed as overage</strong> at your plan&apos;s published per-minute rate, itemised as a separate line
                on your invoice. All prices shown are <strong>GST-inclusive</strong>.
              </p>
              <p className="pt-2">
                Choosing a paid card plan <strong>charges your card immediately</strong> to activate it — activation
                is payment-first, not invoice-then-pay. Choosing to pay by bank transfer instead puts your plan in a{" "}
                <strong>pending state until we confirm the transfer has arrived</strong>; you can cancel a pending
                bank-transfer plan choice before it&apos;s confirmed.
              </p>
              <p className="pt-2">
                If an automatic card charge fails, we retry automatically on day 2 and day 7 after the failure
                (updating your card at any point triggers an immediate retry regardless of that schedule). If
                payment still hasn&apos;t succeeded 14 days after the original failure, your account moves to a{" "}
                <strong>payment hold</strong> — calling is paused, but your <strong>dashboard stays fully
                accessible</strong> so you can update your card or switch to bank transfer; calling resumes as soon
                as payment succeeds.
              </p>
              <p className="pt-2">
                Some accounts are provided on a complimentary (no-charge) plan at our discretion — for example,
                internal test or demonstration accounts. A complimentary plan is noted in your billing settings and
                doesn&apos;t generate invoices while active.
              </p>
              <div className="mt-4 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                <div className="text-sm font-extrabold text-[#0f172a]">Fair usage</div>
                <p className="mt-2 text-sm text-[#475569]">
                  To protect platform reliability, we may rate-limit abusive traffic or temporarily pause activity
                  that causes repeated failures or excessive load.
                </p>
              </div>
            </Section>

            <Section id="cancellation" title="Cancellation & refunds">
              <ul className="mt-2 space-y-2">
                <Bullet>You can <strong>cancel at any time</strong> from Settings → Billing — cancellation takes effect at the <strong>end of your current paid billing period</strong>, not immediately, and your plan stays active and billable through that period. No partial-month refund is given for the period already underway.</Bullet>
                <Bullet>You can <strong>undo a pending cancellation</strong> at any time before the period ends, from the same Settings → Billing page.</Bullet>
                <Bullet>After your current period ends, your account moves to no plan — calling pauses (same as the trial-ended/payment-hold states) until you choose a new plan; the dashboard stays accessible.</Bullet>
                <Bullet>
                  <strong>You can export your data at any time</strong>, including after cancellation — patients/contacts, appointments, call
                  history, revenue records, staff, and claims are all available as CSV/Excel exports from their respective dashboard pages, on demand,
                  with no separate request required.
                </Bullet>
                <Bullet>
                  <strong>Your data is retained after cancellation</strong>, not automatically deleted. If you want your data deleted, email{" "}
                  <a href="mailto:support@zyncoai.com" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                    support@zyncoai.com
                  </a>{" "}
                  and we&apos;ll process the request manually.
                </Bullet>
              </ul>
            </Section>

            <Section id="availability" title="Service availability">
              <p>
                We work to keep ZyncoAI available and reliable, but we do not currently offer a formal uptime
                Service Level Agreement (SLA) or guaranteed compensation for downtime. The service is provided on
                the &quot;as is&quot;/&quot;as available&quot; basis described under{" "}
                <a href="#warranty">Disclaimers</a> below.
              </p>
            </Section>

            <Section id="security" title="Security & incidents">
              <p>
                We implement reasonable measures to protect the service, but no system is
                100% secure. You are responsible for securing your own environment, connected
                systems, and account credentials.
              </p>
              <p className="pt-2">
                If you believe you&apos;ve found a security issue, or experience one, contact{" "}
                <a href="mailto:support@zyncoai.com" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  support@zyncoai.com
                </a>{" "}
                directly — see <a href="#incident-reporting">Incident reporting obligations</a> below for how we
                handle a confirmed breach.
              </p>
            </Section>

            <Section id="support-access" title="Support access">
              <p>
                Authorised ZyncoAI personnel may access your account and the data it contains solely to provide
                support, troubleshoot issues, and operate the service — never for any other purpose. All such
                access is logged and auditable. See{" "}
                <Link href="/privacy#support-access" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  Support access
                </Link>{" "}
                in our Privacy Policy for the full detail on how this works and how to request your access history.
              </p>
            </Section>

            <Section id="incident-reporting" title="Incident reporting obligations">
              <p>
                If a data breach occurs that is likely to result in serious harm to affected individuals, ZyncoAI
                will assess and, where required, notify the Office of the Australian Information Commissioner (OAIC)
                and affected individuals within 30 days, as required by the Notifiable Data Breaches (NDB) scheme
                under the Privacy Act 1988. See our{" "}
                <Link href="/privacy#breach" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  Privacy Policy
                </Link>{" "}
                for full details.
              </p>
            </Section>

            <Section id="nsw-workplace" title="NSW workplace digital systems">
              <p>
                ZyncoAI is designed to assist, not replace, clinic staff. Usage data collected by the platform is
                not used to monitor individual staff performance without consent, consistent with New South Wales
                digital workplace surveillance requirements.
              </p>
            </Section>

            <Section id="ip" title="Intellectual property">
              <p>
                ZyncoAI and its underlying software, UI, brand, and documentation are owned
                by ZyncoAI and protected by applicable laws. You retain ownership of your business
                data — contacts, appointments, call recordings and transcripts, and any configuration
                you set (greetings, services, business hours) — but you grant ZyncoAI the limited
                rights needed to host, process, and display it to operate the service on your behalf.
              </p>
            </Section>

            <Section id="warranty" title="Disclaimers">
              <p>
                ZyncoAI is provided on an “as is” and “as available” basis. We disclaim all
                warranties to the maximum extent permitted by law, including implied warranties
                of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </Section>

            <Section id="liability" title="Limitation of liability">
              <p>
                To the maximum extent permitted by law, ZyncoAI will not be liable for indirect,
                incidental, special, consequential, or punitive damages, or any loss of profits,
                revenue, data, or goodwill arising from your use of the service.
              </p>
              <p>
                ZyncoAI’s total liability for any claim will not exceed the amount you paid to
                ZyncoAI in the 3 months before the event giving rise to the claim.
              </p>
              <p className="pt-2">
                You agree to indemnify and hold ZyncoAI harmless from claims, losses, or costs (including
                reasonable legal fees) arising from your breach of these Terms, your misuse of the platform, or
                your non-compliance with the consent, recording, or outbound-calling obligations described under{" "}
                <a href="#recording-consent">Recording &amp; outbound-calling consent</a> above.
              </p>
            </Section>

            <Section id="termination" title="Termination">
              <p>
                You may stop using ZyncoAI at any time (see <a href="#cancellation">Cancellation &amp; refunds</a>{" "}
                above). We may suspend or terminate access if you violate these Terms, if required by law, or if
                necessary to protect platform integrity — separately from the automated billing-related states
                described under <a href="#billing">Billing &amp; plans</a> (trial ended, payment hold), which pause
                calling but never lock you out of your dashboard or data.
              </p>
            </Section>

            <Section id="governing-law" title="Governing law">
              <p>
                These Terms are governed by the laws of New South Wales, Australia, without regard to conflict-of-law
                principles. You agree to submit to the exclusive jurisdiction of the courts of New South Wales for
                any dispute arising from these Terms or your use of ZyncoAI.
              </p>
            </Section>

            <Section id="changes" title="Changes to Terms">
              <p>
                We may update these Terms from time to time. The “Last updated” date above shows
                the latest revision. Continued use after updates means you accept the revised terms.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                For questions about these Terms, contact ZyncoAI support through your workspace,
                or via your usual support channel. For product information, see{" "}
                <Link href="/product" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /product
                </Link>
                .
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-2xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-2 text-sm font-extrabold text-[#0f172a] hover:opacity-90 transition"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-extrabold text-[#0f172a] hover:bg-slate-50 transition"
                >
                  Login
                </Link>
              </div>
            </Section>

            {/* Bottom note */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
              <div className="text-sm font-extrabold text-[#0f172a]">Note</div>
              <p className="mt-2 text-sm text-[#475569]">
                This page is written in plain language for clarity. If your practice needs a custom agreement,
                contact <a href="mailto:support@zyncoai.com" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">support@zyncoai.com</a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
