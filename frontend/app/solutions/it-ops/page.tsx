import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center rounded-full
        border border-[rgb(var(--border))]
        bg-[rgb(var(--surface))]
        px-3 py-1 text-xs
        text-[rgb(var(--text-2))]
      "
    >
      {children}
    </span>
  );
}

function Block({ title, desc, items }: { title: string; desc: string; items: string[] }) {
  return (
    <div className="hub-card p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-2 text-sm text-[rgb(var(--text-2))]">{desc}</div>

      <div className="mt-4 space-y-2">
        {items.map((x) => (
          <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ItOpsSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>IT Ops</Pill>
          <Pill>Provisioning</Pill>
          <Pill>Incident automation</Pill>
          <Pill>Approvals</Pill>
          <Pill>Audit</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              IT automation with governance, not chaos.
            </h1>

            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              Onboard/offboard employees, manage access, automate incidents, and keep audit trails clean —
              all from one production-grade automation layer.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* Primary CTA (HubSpot orange) */}
              <Link
                href="/signup"
                className="
                  rounded-xl
                  bg-[rgb(var(--brand))]
                  px-5 py-3
                  text-sm font-semibold text-white
                  hover:bg-[rgb(var(--brand-hover))]
                "
              >
                Start free
              </Link>

              {/* Secondary CTA (outline orange) */}
              <Link
                href="/templates"
                className="
                  rounded-xl
                  border border-[rgb(var(--brand))]
                  bg-transparent
                  px-5 py-3
                  text-sm font-semibold
                  text-[rgb(var(--brand))]
                  hover:bg-[rgb(var(--brand-soft))]
                "
              >
                See IT templates →
              </Link>

              {/* Tertiary link */}
              <Link
                href="/observability"
                className="
                  rounded-xl
                  px-5 py-3
                  text-sm font-semibold
                  text-[rgb(var(--text-2))]
                  hover:text-[rgb(var(--text))]
                "
              >
                Observability
              </Link>
            </div>
          </div>

          {/* Example workflow card (clean white like HubSpot) */}
          <div className="hub-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Example workflow
            </div>

            <div className="mt-3 space-y-2">
              {[
                "New hire created in HRIS → validate info",
                "Create Google Workspace + Slack account",
                "Provision app access (role-based)",
                "Require manager approval for admin tools",
                "Post onboarding checklist to ticketing",
                "Emit metrics + audit logs, alert if step fails",
              ].map((x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-[rgb(var(--text-3))]">
              Reliable runs: retries, idempotency, and safe agent actions.
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Block
            title="Onboarding / Offboarding"
            desc="Automate employee lifecycle with clean approvals."
            items={["Create accounts", "Grant access by role", "Revoke access & archive data"]}
          />
          <Block
            title="Incident automation"
            desc="Detect, route, and resolve with observable runs."
            items={["Alert → triage", "Runbooks executed safely", "Postmortem draft + timeline"]}
          />
          <Block
            title="Access governance"
            desc="Human-in-the-loop for high-risk permissions."
            items={["Admin approvals", "Audit exports", "Policy rules + exceptions"]}
          />
        </section>

        <section className="mt-16 hub-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">Connect your IT stack</div>
              <div className="mt-2 text-sm text-[rgb(var(--text-3))]">
                Slack, Google Workspace, Jira, Okta, Azure AD, ServiceNow, and your internal APIs.
              </div>
            </div>

            <Link
              href="/integrations"
              className="
                rounded-xl
                border border-[rgb(var(--border-strong))]
                bg-[rgb(var(--surface))]
                px-5 py-3
                text-sm font-semibold
                text-[rgb(var(--text))]
                hover:bg-[rgb(var(--surface-2))]
              "
            >
              View integrations →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Slack", "Google Workspace", "Jira", "Okta", "Azure AD", "ServiceNow", "PagerDuty", "Sentry"].map(
              (x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
