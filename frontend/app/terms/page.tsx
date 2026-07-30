import Link from "next/link";

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

export default function TermsPage() {
  const updated = "July 30, 2026";

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
            These Terms govern your use of ZyncoAI (“ZyncoAI”, “we”, “us”), including the
            website, apps, APIs, and workflow automation features. By accessing or using
            ZyncoAI, you agree to these Terms.
          </p>

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
                  ["workflows", "Workflows, connectors & data"],
                  ["ai", "AI features & outputs"],
                  ["adm", "Automated decision making"],
                  ["ai-transparency", "AI transparency & human handling"],
                  ["tga", "TGA disclaimer"],
                  ["billing", "Billing & plans"],
                  ["cancellation", "Cancellation & refunds"],
                  ["security", "Security & incidents"],
                  ["incident-reporting", "Incident reporting obligations"],
                  ["nsw-workplace", "NSW workplace digital systems"],
                  ["ip", "Intellectual property"],
                  ["warranty", "Disclaimers"],
                  ["liability", "Limitation of liability"],
                  ["termination", "Termination"],
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
                <Bullet>Breaking laws or violating third-party rights.</Bullet>
                <Bullet>Attempting to bypass security controls or rate limits.</Bullet>
                <Bullet>Uploading malware or using ZyncoAI to distribute malicious content.</Bullet>
                <Bullet>
                  Running workflows that intentionally degrade services (e.g., abusive scraping,
                  denial of service).
                </Bullet>
                <Bullet>
                  Using ZyncoAI to handle sensitive data without appropriate protections and
                  permissions.
                </Bullet>
              </ul>
            </Section>

            <Section id="workflows" title="Workflows, connectors & data">
              <p>
                ZyncoAI helps you connect services and automate workflows. You control what
                you connect and what data you send through workflows.
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>
                  You must have permission to access and process any data you use with ZyncoAI.
                </Bullet>
                <Bullet>
                  Some connectors are provided by third parties; their terms may apply.
                </Bullet>
                <Bullet>
                  Workflow execution may involve retries, queues, and background processing to
                  improve reliability.
                </Bullet>
              </ul>
              <p className="pt-2">
                For our security posture, see{" "}
                <Link href="/security" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /security
                </Link>
                .
              </p>
            </Section>

            <Section id="ai" title="AI features & outputs">
              <p>
                ZyncoAI may provide AI-assisted workflow generation, suggestions, and summaries.
                AI outputs can be incorrect or incomplete. You are responsible for reviewing
                workflows and results before relying on them.
              </p>
              <ul className="mt-2 space-y-2">
                <Bullet>Do not input confidential data unless you intend to process it.</Bullet>
                <Bullet>Validate actions (e.g., CRM updates, payments, emails) before enabling production runs.</Bullet>
                <Bullet>Use governance controls for approvals and change management where needed.</Bullet>
              </ul>
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
                If you subscribe to a paid plan, you agree to pay the fees described on{" "}
                <Link href="/pricing" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /pricing
                </Link>
                . Taxes may apply depending on your location. Plan limits may include runs,
                seats, connectors, and retention.
              </p>
              <div className="mt-4 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                <div className="text-sm font-extrabold text-[#0f172a]">Fair usage</div>
                <p className="mt-2 text-sm text-[#475569]">
                  To protect platform reliability, we may rate-limit abusive traffic or
                  temporarily pause workflows that cause repeated failures or excessive load.
                </p>
              </div>
            </Section>

            <Section id="cancellation" title="Cancellation & refunds">
              <ul className="mt-2 space-y-2">
                <Bullet>Every plan starts with a <strong>7-day free trial</strong> — you&apos;re not charged anything during this period.</Bullet>
                <Bullet>You can <strong>cancel at any time</strong> from Settings → Billing.</Bullet>
                <Bullet><strong>30 days&apos; notice is required</strong> to cancel a paid subscription — your plan remains active and billable through that notice period.</Bullet>
                <Bullet>We don&apos;t offer <strong>partial-month refunds</strong> for the current billing period once it&apos;s begun.</Bullet>
                <Bullet>
                  <strong>You can export your data at any time</strong>, including during your notice period — patients/contacts, appointments, call
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

            <Section id="security" title="Security & incidents">
              <p>
                We implement reasonable measures to protect the service, but no system is
                100% secure. You are responsible for securing your own environment, connected
                systems, and API keys.
              </p>
              <p className="pt-2">
                If you experience an incident, check{" "}
                <Link href="/brain" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  /brain
                </Link>{" "}
                and follow recommended actions in the{" "}
                <Link href="/docs" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
                  docs
                </Link>
                .
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
                by ZyncoAI and protected by applicable laws. You retain ownership of your
                content and workflow logic you create, but you grant ZyncoAI the limited rights
                needed to host, process, and display it to operate the service.
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
            </Section>

            <Section id="termination" title="Termination">
              <p>
                You may stop using ZyncoAI at any time. We may suspend or terminate access if
                you violate these Terms, if required by law, or if necessary to protect platform
                integrity.
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
                This page is written in plain language for clarity. Some sections may vary by
                jurisdiction. If your organization needs customized terms, add governance
                controls and contact us through your enterprise onboarding flow.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
