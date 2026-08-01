import Link from "next/link";

export const metadata = {
  title: "AgentOps | ZyncoAI",
  description:
    "Run multi-agent automation safely: planning, execution, self-healing retries, and a business intelligence graph for decisions — with every action logged.",
  alternates: { canonical: "/agentops" },
};

const CAPABILITIES = [
  {
    title: "Planning, separated from execution",
    body: "A planning agent breaks a request into steps before anything runs. Execution agents carry out one step each, working from that plan rather than improvising the whole task in one pass — the same reason a person writes a checklist before a complex task instead of relying on memory alone.",
  },
  {
    title: "Agent memory",
    body: "Agents keep context across a run — what's already been tried, what failed, what the plan actually says — instead of starting from a blank context on every step. That memory is scoped to the run; it doesn't leak between unrelated workflows.",
  },
  {
    title: "Self-healing workflows",
    body: "When a step fails — an API times out, a tool call returns something unexpected — a repair agent decides whether to retry, adjust the approach, or stop and flag it for a human, rather than the whole run silently failing.",
  },
  {
    title: "Business intelligence graph",
    body: "Decisions reference a structured graph of the business context relevant to that workflow — entities, relationships, prior outcomes — instead of relying purely on what's in the prompt for that one run.",
  },
];

export default function AgentOpsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">AgentOps</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          Multi-agent automation, run safely
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          Most &quot;AI automation&quot; is one model given a task and hoped for the best. AgentOps splits that up:
          planning, execution, and repair are separate agent roles, each with its own memory and its own
          constraints on what it&apos;s allowed to do. That separation is what makes it possible to trust a
          multi-agent process with something that actually matters — because a single step going wrong
          doesn&apos;t mean the whole run goes wrong silently.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">{c.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-950">How AgentOps fits with WorkflowOps</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
          <Link href="/workflowops" className="font-medium text-neutral-900 underline underline-offset-2">WorkflowOps</Link> handles
          the parts of a process that are genuinely fixed — trigger, sequence, retries, approvals. AgentOps
          takes over the steps that need judgment rather than a fixed rule. A workflow can call into an agent
          for one step and go straight back to deterministic execution for the next — you don&apos;t have to choose
          one model for an entire process. Every agent action is logged in the same run history the rest of the
          <Link href="/platform" className="font-medium text-neutral-900 underline underline-offset-2"> platform</Link> uses,
          so a run built partly from fixed steps and partly from agent decisions is still one auditable trail,
          not two systems bolted together.
        </p>
      </div>
    </main>
  );
}
