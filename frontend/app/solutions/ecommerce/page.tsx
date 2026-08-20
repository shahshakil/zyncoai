import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

// 2026-08-19 — see the matching comment on app/solutions/sales-ops/page.tsx:
// this app/solutions/* tree is pre-pivot, orphaned from live nav, deindexed
// rather than deleted.
export const metadata = {
  title: "Ecommerce Solutions",
  description: "Orders in, ops automatic — connect your commerce stack and automate order processing end to end.",
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

export default function EcommerceSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>E-commerce</Pill>
          <Pill>Orders</Pill>
          <Pill>Returns</Pill>
          <Pill>Fraud signals</Pill>
          <Pill>Customer updates</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Orders in. Ops automatic.
            </h1>

            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              ZyncoAI automates fulfillment signals, refund workflows, support context, and inventory updates —
              with approvals and audit trails.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* Primary CTA (HubSpot orange) */}
              <Link
                href="/signup"
                className="rounded-xl bg-[rgb(var(--brand))] px-5 py-3 text-sm font-semibold text-white hover:bg-[rgb(var(--brand-hover))]"
              >
                Start free
              </Link>

              {/* Secondary CTA (outline orange) */}
              <Link
                href="/templates"
                className="rounded-xl border border-[rgb(var(--brand))] bg-transparent px-5 py-3 text-sm font-semibold text-[rgb(var(--brand))] hover:bg-[rgb(var(--brand-soft))]"
              >
                E-commerce templates →
              </Link>

              {/* Tertiary link */}
              <Link
                href="/governance"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
              >
                Governance
              </Link>
            </div>
          </div>

          {/* Workflow example card */}
          <div className="hub-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
              Workflow example
            </div>

            <div className="mt-3 space-y-2">
              {[
                "Order placed → validate address + risk score",
                "If high-risk → require approval to ship",
                "Create shipping label → notify customer",
                "Update inventory + warehouse system",
                "Return request → auto-approve under policy",
                "Refund executed → audit log + CRM update",
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
            title="Fulfillment automation"
            desc="Keep shipping and inventory consistent."
            steps={["Create labels", "Update WMS", "Notify customer + CRM sync"]}
          />
          <Box
            title="Returns & refunds"
            desc="Policy-based approvals to protect margin."
            steps={["Auto-approve low-risk returns", "Approval thresholds", "Audit & reconciliation"]}
          />
          <Box
            title="Fraud + risk controls"
            desc="Stop losses with safe gates."
            steps={["Risk scoring", "Manual review triggers", "Blocklist & alerts"]}
          />
        </section>

        <section className="mt-16 hub-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">Connect your commerce stack</div>
              <div className="mt-2 text-sm text-[rgb(var(--text-3))]">Storefront + payments + support + warehouse.</div>
            </div>

            <Link
              href="/integrations"
              className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
            >
              View integrations →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Shopify", "Stripe", "Klaviyo", "Zendesk", "Postgres", "Slack", "Gmail", "Google Sheets"].map((x) => (
              <div key={x} className="hub-card-soft px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                {x}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA (remove purple gradient; use clean HubSpot card) */}
        <section className="mt-16">
          <div className="hub-card p-8">
            <div className="text-xl font-semibold text-[rgb(var(--text))]">Run commerce ops like a system</div>
            <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
              Automate the boring parts. Approve the risky ones. Track everything.
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
