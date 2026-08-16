import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs text-[rgb(var(--text-2))]">
      {children}
    </span>
  );
}

function Card({ title, desc, bullets }: { title: string; desc: string; bullets: string[] }) {
  return (
    <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
      <div className="mt-2 text-sm text-[rgb(var(--text-2))]">{desc}</div>
      <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--text-2))]">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--brand))]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-[rgb(var(--text))]">{left}</div>
      <div className="text-xs text-[rgb(var(--text-3))]">{right}</div>
    </div>
  );
}

export default function SupportSolutionPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--page))] text-[rgb(var(--text))]">
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-wrap gap-2">
          <Pill>Support</Pill>
          <Pill>Agent assist</Pill>
          <Pill>Approvals</Pill>
          <Pill>Observability</Pill>
          <Pill>Audit logs</Pill>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[rgb(var(--text))]">
              Automate support without losing control.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[rgb(var(--text-2))]">
              ZyncoAI helps support teams deflect tickets, summarize threads, route escalations,
              and keep systems in sync — with governance and observability by default.
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
                Browse templates →
              </Link>
              <Link
                href="/security"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
              >
                Security & controls
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
                <div className="text-xs text-[rgb(var(--text))]">Example workflow preview</div>
                <div className="text-[11px] text-[rgb(var(--text-3))]">ticket-triage • approvals • logs</div>
              </div>

              <div className="space-y-2 p-4">
                <FlowRow left="New ticket → classify intent + sentiment" right="Agent tool: NLP + rules" />
                <FlowRow left="Fetch order/user context → enrich ticket" right="DB + API integration" />
                <FlowRow left="Draft response → propose macro + links" right="Agent generation" />
                <FlowRow left="If refund > $100 → require approval" right="Governance policy" />
                <FlowRow left="Post update to Zendesk/Intercom + Slack" right="Multi-app sync" />
                <FlowRow left="Emit metrics → alert on SLA risk" right="Observability" />
              </div>

              <div className="border-t border-[rgb(var(--border))] p-4 text-xs text-[rgb(var(--text-3))]">
                Built for production: retries, idempotency, audit trail, PII-safe controls.
              </div>
            </div>
          </div>
        </div>

        {/* CAPABILITIES */}
        <section className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
            Capabilities
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">
            Support workflows that actually hold up
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[rgb(var(--text-2))]">
            Combine automation and AI safely: let agents draft, while ZyncoAI enforces approvals, policies,
            and rich telemetry.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card
              title="AI triage + smart routing"
              desc="Tag issues, detect VIPs, identify churn-risk, and route to the right queue."
              bullets={["Intent + sentiment detection", "VIP / SLA routing", "Auto-assign and notify"]}
            />
            <Card
              title="Agent-assisted replies"
              desc="Generate response drafts with approved knowledge sources and citations."
              bullets={["KB/Docs retrieval", "Brand-safe style", "One-click approval"]}
            />
            <Card
              title="Escalation governance"
              desc="Human-in-the-loop controls for refunds, account changes, and risky actions."
              bullets={["Refund thresholds", "Role-based approvals", "Full audit history"]}
            />
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section className="mt-16">
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-3))]">
                  Integrations used
                </div>
                <h3 className="mt-2 text-xl font-semibold text-[rgb(var(--text))]">
                  Plug into your current support stack
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-[rgb(var(--text-2))]">
                  Keep Zendesk/Intercom/Slack/Email in sync. Enrich tickets with DB + billing + product telemetry.
                </p>
              </div>
              <Link
                href="/integrations"
                className="rounded-xl border border-[rgb(var(--border-strong))] bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
              >
                View integrations →
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Zendesk", "Intercom", "Slack", "Gmail", "Stripe", "Postgres", "Shopify", "Jira"].map((x) => (
                <div key={x} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3 text-sm text-[rgb(var(--text-2))]">
                  {x}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">
                Ready to upgrade your support ops?
              </div>
              <div className="mt-2 text-sm text-[rgb(var(--text-2))]">
                Start with templates, then connect your real backend and enforce controls.
              </div>
            </div>
            <div className="flex gap-2">
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
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
