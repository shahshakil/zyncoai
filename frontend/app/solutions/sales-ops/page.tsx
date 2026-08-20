import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

export const metadata = {
  title: "Sales Ops",
  description:
    "ZyncoAI automates lead capture, enrichment, routing, and CRM updates — with approval thresholds and a full audit trail.",
  alternates: { canonical: "/solutions/sales-ops", languages: { "en-AU": "/solutions/sales-ops", en: "/solutions/sales-ops" } },
  // 2026-08-19 — this whole app/solutions/* tree (distinct from the real,
  // live app/(marketing)/solutions/[slug] industry pages) is pre-pivot
  // SaaS-workflow content, orphaned from the live nav/footer (confirmed:
  // only self-referential, not reachable from MainHeader/MarketingMegaFooter)
  // yet still publicly reachable and previously listed in sitemap.ts.
  // Deindexed rather than deleted — content stays reachable by direct URL,
  // just not offered to search engines as if it described the current
  // product.
  robots: { index: false, follow: false },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs text-[rgb(var(--text-2))]">
      {children}
    </span>
  );
}

function Box({ title, desc, steps }: { title: string; desc: string; steps: string[] }) {
  return (
    <div className="hub-card p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-2 text-sm text-[rgb(var(--text-2))]">{desc}</div>
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

export default function SalesOpsSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>Sales Ops</Pill>
          <Pill>Lead routing</Pill>
          <Pill>Enrichment</Pill>
          <Pill>CRM updates</Pill>
          <Pill>Approvals</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Leads in. Pipeline consistent.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              ZyncoAI captures leads the moment they arrive, enriches them, routes them to the right rep, and
              keeps the CRM in sync — with approval thresholds for anything that needs a human sign-off.
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
                Sales ops templates →
              </Link>
              <Link
                href="/governance"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
              >
                Governance
              </Link>
            </div>
          </div>

          <div className="hub-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Workflow example
            </div>
            <div className="mt-3 space-y-2">
              {[
                "Form submitted → enrich company + contact data",
                "Score lead → route to the right rep by territory",
                "If enterprise deal size → require manager approval",
                "Create CRM record → assign owner + next step",
                "No response in 3 days → auto follow-up sequence",
                "Deal stage changes → notify team + update forecast",
              ].map((x) => (
                <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-[rgb(var(--text-3))]">Stable automations: retries, dedupe, and event trails.</div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Box
            title="Lead capture & enrichment"
            desc="Every lead arrives with the context a rep actually needs."
            steps={["Form + webhook capture", "Company + contact enrichment", "De-dupe against existing records"]}
          />
          <Box
            title="Routing & assignment"
            desc="The right lead reaches the right rep, automatically."
            steps={["Territory & round-robin rules", "Deal-size approval thresholds", "Escalation on no response"]}
          />
          <Box
            title="CRM & forecast sync"
            desc="Pipeline data stays accurate without manual entry."
            steps={["Two-way CRM sync", "Stage-change notifications", "Audit trail on every update"]}
          />
        </section>

        <section className="mt-16 hub-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">Connect your sales stack</div>
              <div className="mt-2 text-sm text-[rgb(var(--text-3))]">CRM + forms + enrichment + messaging.</div>
            </div>
            <Link
              href="/integrations"
              className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
            >
              View integrations →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Salesforce", "HubSpot", "Clearbit", "Slack", "Gmail", "Google Sheets", "Postgres", "Zendesk"].map((x) => (
              <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                {x}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="hub-card p-8">
            <div className="text-xl font-semibold text-[rgb(var(--text))]">Run sales ops like a system</div>
            <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
              Automate the routing. Approve the exceptions. Keep the pipeline honest.
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
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
