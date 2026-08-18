import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

// 2026-08-19 — see the matching comment on app/solutions/sales-ops/page.tsx:
// this app/solutions/* tree is pre-pivot, orphaned from live nav, deindexed
// rather than deleted.
export const metadata = {
  title: "Marketing Solutions | ZyncoAI",
  description: "Capture every lead, everywhere — connect your marketing stack and automate lead routing.",
  robots: { index: false, follow: false },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs text-[rgb(var(--text-2))]">
      {children}
    </span>
  );
}

function Feature({ title, desc, points }: { title: string; desc: string; points: string[] }) {
  return (
    <div className="hub-card p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-2 text-sm text-[rgb(var(--text-2))]">{desc}</div>
      <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--text-2))]">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[rgb(var(--brand))]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketingSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>Marketing</Pill>
          <Pill>Attribution</Pill>
          <Pill>Lifecycle</Pill>
          <Pill>AI insights</Pill>
          <Pill>Data sync</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Capture every lead, everywhere.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              Unify forms, ads, email, CRM, and analytics. ZyncoAI automates enrichment, routing, attribution, and
              reporting — with dependable execution.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-[rgb(var(--brand))] px-5 py-3 text-sm font-semibold text-white hover:bg-[rgb(var(--brand-hover))]"
              >
                Start free
              </Link>
              <Link
                href="/templates"
                className="rounded-xl border border-[rgb(var(--brand))] bg-transparent px-5 py-3 text-sm font-semibold text-[rgb(var(--brand))] hover:bg-[rgb(var(--brand-soft))]"
              >
                Browse marketing templates →
              </Link>
              <Link
                href="/integrations"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
              >
                Integrations
              </Link>
            </div>
          </div>

          <div className="hub-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Automation playbook
            </div>
            <div className="mt-3 space-y-2">
              {[
                "New form submit → validate + dedupe lead",
                "Enrich company → firmographics + ICP score",
                "Create/update CRM → assign owner",
                "Notify Slack + schedule follow-up",
                "Attribution → write touchpoints (Markov-ready)",
                "Weekly report → auto-generate insight summary",
              ].map((x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-[rgb(var(--text-3))]">
              Built for analytics teams: consistent IDs, event trails, export-friendly runs.
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Feature
            title="Lead capture + enrichment"
            desc="Turn every inbound into clean CRM data."
            points={["Dedupe & normalize", "Firmographics enrichment", "Owner routing rules"]}
          />
          <Feature
            title="Attribution pipelines"
            desc="Track every touchpoint and export to BI."
            points={["Event & UTM tracking", "Conversion path outputs", "Scheduled exports"]}
          />
          <Feature
            title="AI insights"
            desc="Summarize performance and explain changes."
            points={["Campaign insights", "Audience clustering", "Auto narrative reporting"]}
          />
        </section>

        <section className="mt-16 hub-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">Connect your marketing stack</div>
              <div className="mt-2 text-sm text-[rgb(var(--text-3))]">Ads → forms → CRM → warehouse → dashboards.</div>
            </div>
            <Link
              href="/integrations"
              className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
            >
              View integrations →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["HubSpot", "Salesforce", "Google Sheets", "Meta Ads", "Google Ads", "Mailchimp", "Postgres", "BigQuery"].map(
              (x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              )
            )}
          </div>
        </section>

        <section className="mt-16">
          <div className="hub-card p-8">
            <div className="text-xl font-semibold text-[rgb(var(--text))]">Make marketing ops predictable</div>
            <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
              Automate pipelines with governance + observability, not fragile scripts.
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
