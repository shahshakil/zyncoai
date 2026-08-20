import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

// 2026-08-19 — see the matching comment on app/solutions/sales-ops/page.tsx:
// this app/solutions/* tree is pre-pivot, orphaned from live nav, deindexed
// rather than deleted.
export const metadata = {
  title: "SaaS Solutions",
  description: "Automate the full customer lifecycle — connect your SaaS stack end to end.",
  robots: { index: false, follow: false },
};

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

function Panel({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="hub-card p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-4 space-y-2">
        {steps.map((s) => (
          <div key={s} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SaaSSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>SaaS</Pill>
          <Pill>Lifecycle automation</Pill>
          <Pill>Billing</Pill>
          <Pill>Churn signals</Pill>
          <Pill>Ops</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Automate the full customer lifecycle.
            </h1>

            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              From signup → onboarding → billing → renewals → retention. ZyncoAI keeps every system
              consistent with observable workflows and safe agent actions.
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
                SaaS templates →
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

          {/* Right-side example card */}
          <div className="hub-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Lifecycle example
            </div>

            <div className="mt-3 space-y-2">
              {[
                "User signup → create org + default roles",
                "Provision workspace → generate API keys",
                "Start trial → add billing customer",
                "Activation checklist → notify success manager",
                "Usage drop → churn-risk alert + playbook",
                "Renewal window → approval for discount > 20%",
              ].map((x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-[rgb(var(--text-3))]">
              Every step is tracked with audit logs and metrics.
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Panel
            title="Activation"
            steps={["Onboarding email sequence", "Workspace setup", "In-app nudges + tasks"]}
          />
          <Panel
            title="Billing & renewals"
            steps={["Invoice events → sync CRM", "Renewal reminders", "Discount approvals"]}
          />
          <Panel
            title="Retention"
            steps={["Usage anomaly detection", "Health score updates", "Churn playbooks"]}
          />
        </section>

        {/* Bottom integrations CTA */}
        <section className="mt-16 hub-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">Connect your SaaS stack</div>
              <div className="mt-2 text-sm text-[rgb(var(--text-3))]">
                Billing + product + CRM + support + analytics.
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
            {["Stripe", "Postgres", "HubSpot", "Salesforce", "Zendesk", "Intercom", "Segment", "BigQuery"].map(
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

