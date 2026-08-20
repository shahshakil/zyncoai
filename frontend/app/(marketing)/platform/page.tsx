import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = {
  title: "Platform",
  description:
    "The ZyncoAI platform: a workflow execution engine, a connector framework, a multi-agent runtime, and the governance layer that keeps all of it auditable.",
  alternates: { canonical: "/platform", languages: { "en-AU": "/platform", en: "/platform" } },
};

const PILLARS = [
  {
    title: "Execution engine",
    body: "Every workflow run goes through the same engine — staged rollout, retries with backoff, and rollback if a step fails. Runs are versioned, so a bad deploy is a revert, not an incident.",
  },
  {
    title: "Connector framework",
    body: "Workflows read and write through a shared connector registry rather than one-off integration code per workflow. See the real connectors already built.",
    href: "/platform/connectors",
    linkLabel: "Browse connectors",
  },
  {
    title: "Multi-agent runtime",
    body: "AgentOps runs planning, execution, and repair as separate agent roles with their own memory and constraints, instead of one model trying to do everything in a single pass.",
    href: "/agentops",
    linkLabel: "How AgentOps works",
  },
  {
    title: "Governance & observability",
    body: "Every run, tool call, and approval is logged. SSO, SCIM provisioning, and RBAC control who can change what; audit logs and SIEM export cover the compliance side.",
    href: "/enterprise",
    linkLabel: "Enterprise controls",
  },
];

export default function PlatformPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Platform", href: "/platform" }]} />
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Platform</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          One system underneath every workflow
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          ZyncoAI isn&apos;t a single automation — it&apos;s the infrastructure a team stands up once and then
          builds every workflow on top of. The same execution engine, connector registry, and governance layer
          back a two-step Slack notification and a multi-agent process that touches a dozen systems. Nothing
          about how a workflow runs changes as it gets more complex; only the workflow definition does.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{p.body}</p>
            {p.href && (
              <Link href={p.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-brand">
                {p.linkLabel} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-950">Where it fits together</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
          A typical setup starts with a workflow built in <Link href="/workflowops" className="font-medium text-neutral-900 underline underline-offset-2">WorkflowOps</Link>,
          pulling data through the connector framework above. Where a step needs judgment rather than a fixed
          rule — deciding how to route a lead, summarizing a support thread, deciding what to retry versus
          escalate — that step hands off to an agent through <Link href="/agentops" className="font-medium text-neutral-900 underline underline-offset-2">AgentOps</Link>.
          Everything either one does is visible in the same run history, with the same audit trail.
        </p>
      </div>
    </main>
  );
}
