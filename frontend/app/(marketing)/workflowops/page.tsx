import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = {
  title: "WorkflowOps | ZyncoAI",
  description:
    "Developer and ops tooling for production workflows — a builder, a connector registry, versioning with rollback, and monitoring with run history and tracing.",
  alternates: { canonical: "/workflowops", languages: { "en-AU": "/workflowops", en: "/workflowops" } },
};

const SECTIONS = [
  {
    title: "Builder",
    body: "Workflows are assembled from steps that read and write through the shared connector registry, not hand-rolled integration code per workflow. A step that needs judgment instead of a fixed rule can hand off to an AgentOps agent mid-run.",
    href: "/platform/connectors",
    linkLabel: "Browse the connector registry",
  },
  {
    title: "Versioning, staging, approvals, rollback",
    body: "A workflow change is a new version, not an in-place edit. Changes can go through a staging run before they're live, and a bad deploy is a rollback to the previous version — not a scramble to figure out what changed.",
  },
  {
    title: "Monitoring, alerts, run history",
    body: "Every run is recorded — what triggered it, what each step did, how long it took, whether it needed a retry. Analytics roll that up into volume, reliability, and time-savings numbers instead of leaving it as a raw log nobody reads.",
    href: "/workflowops/automation-analytics",
    linkLabel: "See Automation Analytics",
  },
];

export default function WorkflowOpsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "WorkflowOps", href: "/workflowops" }]} />
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">WorkflowOps</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          Production tooling for workflows, not just a canvas
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          A workflow that runs once in a demo and a workflow a team depends on every day need different
          tooling. WorkflowOps is built for the second case: versioned changes instead of silent edits, staged
          rollout instead of pushing straight to production, and monitoring that actually tells you when
          something&apos;s degrading instead of failing quietly until someone notices a missed booking or a stuck
          order.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">{s.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{s.body}</p>
            {s.href && (
              <Link href={s.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-brand">
                {s.linkLabel} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-950">Where a workflow needs more than fixed steps</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
          Some steps in a real process aren&apos;t a fixed rule — routing a lead based on what they actually
          said, deciding whether a failed step should retry or escalate. Those steps can call into <Link href="/agentops" className="font-medium text-neutral-900 underline underline-offset-2">AgentOps</Link>,
          run alongside the deterministic steps, and land in the same run history — see the full <Link href="/platform" className="font-medium text-neutral-900 underline underline-offset-2">platform overview</Link> for
          how the pieces connect.
        </p>
      </div>
    </main>
  );
}
