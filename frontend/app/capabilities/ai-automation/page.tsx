import Link from "next/link";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "AI Automation | ZyncoAI",
  description:
    "Let AI plan and generate a workflow from a plain-language request, then execute it inside the same guardrails and approvals as anything built by hand.",
  alternates: { canonical: "/capabilities/ai-automation" },
};

export default function AIAutomationCapability() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16 text-[#0f172a]">
      <div className={`${MK.container} max-w-4xl`}>
        <p className="text-sm text-[#94a3b8]">Capability</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">AI Automation</h1>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          Describe what you want automated and an agent drafts the workflow — which connectors it needs, what
          order the steps run in, where an approval belongs — as a real, editable workflow definition, not just
          a suggestion in a chat window. You review and adjust it before it ever runs against real data.
        </p>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          Once it&apos;s running, it&apos;s a normal workflow: same execution engine, same retry and rollback
          behavior, same governance guardrails and approval points as one built manually in the workflow
          builder. AI-generated doesn&apos;t mean less controlled — it means less time spent on the first draft.
        </p>
        <p className="mt-6 text-sm leading-6 text-[#475569]">
          For the agent runtime that also handles judgment calls mid-workflow (not just drafting it upfront),
          see{" "}
          <Link href="/agentops" className="font-medium text-[#0f172a] underline underline-offset-2">
            AgentOps
          </Link>
          . For how tool use and constraints work generally, see{" "}
          <Link href="/ai" className="font-medium text-[#0f172a] underline underline-offset-2">
            AI
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
