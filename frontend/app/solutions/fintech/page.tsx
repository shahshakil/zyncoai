import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

// 2026-08-19 — see the matching comment on app/solutions/sales-ops/page.tsx:
// this app/solutions/* tree is pre-pivot, orphaned from live nav, deindexed
// rather than deleted.
export const metadata = {
  title: "Fintech Solutions",
  description: "Automation with controls, approvals, and audit — for fintech workflows that need a full trail.",
  robots: { index: false, follow: false },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs text-[rgb(var(--text-2))]">
      {children}
    </span>
  );
}

function Module({ title, desc, points }: { title: string; desc: string; points: string[] }) {
  return (
    <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-2 text-sm text-[rgb(var(--text-2))]">{desc}</div>
      <div className="mt-4 space-y-2">
        {points.map((p) => (
          <div
            key={p}
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3 text-sm text-[rgb(var(--text-2))]"
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FintechSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>Fintech</Pill>
          <Pill>Compliance</Pill>
          <Pill>Approvals</Pill>
          <Pill>Audit trails</Pill>
          <Pill>Risk controls</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Automation with controls, approvals, and audit.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              Fintech workflows need guardrails. ZyncoAI adds policy gates, approvals, and immutable run history
              so teams can automate safely.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-[rgb(var(--brand))] px-5 py-3 text-sm font-semibold text-white hover:bg-[rgb(var(--brand-hover))]"
              >
                Start free
              </Link>

              <Link
                href="/security"
                className="rounded-xl border border-[rgb(var(--brand))] bg-transparent px-5 py-3 text-sm font-semibold text-[rgb(var(--brand))] hover:bg-[rgb(var(--brand-soft))]"
              >
                Security
              </Link>

              <Link
                href="/governance"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
              >
                Governance
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Controlled workflow example
            </div>

            <div className="mt-3 space-y-2">
              {[
                "KYC submitted → validate documents + score risk",
                "If score high → require compliance approval",
                "Create customer profile → write to core DB",
                "Notify ops → open review case",
                "Emit audit log + evidence snapshot",
                "Monitor SLA + alert on stuck approvals",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3 text-sm text-[rgb(var(--text-2))]"
                >
                  {x}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-[rgb(var(--text-3))]">
              Every action is logged. Policies prevent unsafe agent calls.
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Module
            title="KYC / AML automation"
            desc="Speed up onboarding with compliance gates."
            points={["Document validation", "Risk scoring + exceptions", "Approval workflows"]}
          />
          <Module
            title="Risk & controls"
            desc="Stop unsafe actions before they happen."
            points={["Policy rules", "Role-based approvals", "Evidence snapshots"]}
          />
          <Module
            title="Audit-ready operations"
            desc="Prove what happened, when, and why."
            points={["Immutable run history", "Exports & reports", "Alerting on failures"]}
          />
        </section>

        <section className="mt-16 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">
                Integrate your fintech stack
              </div>
              <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
                Core DB + ticketing + messaging + reporting — with strict access controls.
              </div>
            </div>

            <Link
              href="/integrations"
              className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
            >
              View integrations →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Postgres", "Stripe", "Slack", "Jira", "Gmail", "Google Sheets", "BigQuery", "S3"].map(
              (x) => (
                <div
                  key={x}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3 text-sm text-[rgb(var(--text-2))]"
                >
                  {x}
                </div>
              )
            )}
          </div>
        </section>

        <section className="mt-16">
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8">
            <div className="text-xl font-semibold text-[rgb(var(--text))]">
              Automate fintech safely
            </div>
            <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
              Use approvals and policies for compliance-sensitive steps — and keep full audit evidence.
            </div>
            <div className="mt-6 flex gap-2">
              <Link
                href="/signup"
                className="rounded-xl bg-[rgb(var(--brand))] px-5 py-3 text-sm font-semibold text-white hover:bg-[rgb(var(--brand-hover))]"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
              >
                Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
