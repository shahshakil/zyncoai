import Link from "next/link";

const Card = ({
  title,
  desc,
  bullets,
  href,
}: {
  title: string;
  desc: string;
  bullets: string[];
  href: string;
}) => (
  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
    <div className="text-lg font-semibold text-zinc-900">{title}</div>
    <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    <ul className="mt-4 space-y-2 text-sm text-zinc-700">
      {bullets.map((b) => (
        <li key={b} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
    <Link
      href={href}
      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-brand"
    >
      Explore <span aria-hidden>→</span>
    </Link>
  </div>
);

export default function ProductPillars() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            The platform
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            One system for workflows, agents, and governance
          </h2>
          <p className="mt-4 text-base text-zinc-600">
            Built like an enterprise control plane: reliable execution, observability,
            compliance, and a multi-agent engine to automate complex operations.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card
            title="AgentOps"
            desc="Run multi-agent automation safely: planning, execution, repair, optimization."
            bullets={[
              "Multi-Agent System + agent memory",
              "Self-healing workflows and retries",
              "Business intelligence graph for decisions",
            ]}
            href="/agentops"
          />
          <Card
            title="WorkflowOps"
            desc="Developer + Ops tooling for production workflows."
            bullets={[
              "Builder + templates + connectors registry",
              "Versioning, staging, approvals, rollback",
              "Monitoring, alerts, run history and tracing",
            ]}
            href="/workflowops"
          />
          <Card
            title="Enterprise"
            desc="Security and compliance features that close big deals."
            bullets={[
              "SSO (SAML/OIDC), SCIM provisioning, RBAC",
              "Immutable audit logs + SIEM export",
              "Data residency controls + retention policies",
            ]}
            href="/enterprise"
          />
          <Card
            title="AI Brain"
            desc="An assistant that acts: reminders, booking, calendar, follow-ups."
            bullets={[
              "Voice-ready gateway for real-time assistant",
              "Calendar + notifications + reminders pipeline",
              "Task automation across apps and systems",
            ]}
            href="/brain"
          />
        </div>
      </div>
    </section>
  );
}
