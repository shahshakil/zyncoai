import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Product | ZyncoAI",
  description:
    "How ZyncoAI's workflow platform fits together: the builder, the execution engine, the connector registry, and the agent runtime that handles the steps a fixed rule can't.",
  alternates: { canonical: "/product", languages: { "en-AU": "/product", en: "/product" } },
};

const AREAS = [
  {
    title: "Build",
    body: "Workflows are assembled from steps against a shared connector registry, so a new workflow reuses existing integrations instead of one-off code. Start from a template or build from scratch.",
  },
  {
    title: "Run",
    body: "The execution engine handles retries, backoff, and rollback the same way for every workflow regardless of how it was built. Runs are versioned, so a bad change is a revert, not an incident.",
  },
  {
    title: "Decide",
    body: "Steps that need judgment instead of a fixed rule — routing, triage, summarization — hand off to an agent through AgentOps, with its own memory and constraints, then return to deterministic execution for the next step.",
  },
  {
    title: "Watch",
    body: "Every run, retry, and tool call is logged. Automation Analytics rolls that into volume, reliability, and time-savings numbers instead of leaving it as a raw log nobody checks.",
  },
];

export default function ProductPage() {
  return (
    <>
      <SimplePage title="Product" subtitle="Workflows, execution, templates, and platform capabilities." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {AREAS.map((a) => (
            <div key={a.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{a.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{a.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          These aren&apos;t four separate products bolted together — a single workflow moves through all four
          as it runs. See the full{" "}
          <Link href="/platform" className="font-medium text-[#0f172a] underline underline-offset-2">
            platform architecture
          </Link>
          , or how{" "}
          <Link href="/agentops" className="font-medium text-[#0f172a] underline underline-offset-2">
            AgentOps
          </Link>{" "}
          and{" "}
          <Link href="/workflowops" className="font-medium text-[#0f172a] underline underline-offset-2">
            WorkflowOps
          </Link>{" "}
          split the work between fixed steps and agent decisions.
        </p>
      </section>
    </>
  );
}
