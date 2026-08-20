import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "AI",
  description:
    "ZyncoAI's approach to AI: agents that call real tools inside real constraints, with approvals for what matters and an audit log of what happened.",
  alternates: { canonical: "/ai", languages: { "en-AU": "/ai", en: "/ai" } },
};

const PRINCIPLES = [
  {
    title: "Tool use, not free-form generation",
    body: "An agent's job is to call the right tool with the right arguments — check availability, look up a record, send a message — not to generate an answer from memory. That's what makes its actions checkable: a tool call has a name and arguments, not just a paragraph of text to trust.",
  },
  {
    title: "Constraints set by you",
    body: "Which tools an agent can call, what data it can touch, and what it's never allowed to do are configured per workflow, not left to the model's judgment alone. A guardrail is enforced in code before a tool call runs, not just suggested in a prompt.",
  },
  {
    title: "Approvals for anything that matters",
    body: "Anything above a threshold you set — a refund, an external message, a policy exception — pauses for a named human to approve, regardless of how confident the agent is.",
  },
  {
    title: "An audit log, not a black box",
    body: "Every tool call an agent makes is logged with its inputs and outputs. When something goes wrong, the question is never 'what did the AI do' — it's already answered in the run history.",
  },
];

export default function AIPage() {
  return (
    <>
      <SimplePage title="AI" subtitle="Agents with tools, constraints, approvals, and audit logs." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{p.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          For the multi-agent runtime that plans, executes, and repairs workflow steps, see{" "}
          <Link href="/agentops" className="font-medium text-[#0f172a] underline underline-offset-2">
            AgentOps
          </Link>
          . For the approval rules and policy guardrails agents run inside, see{" "}
          <Link href="/governance" className="font-medium text-[#0f172a] underline underline-offset-2">
            Governance
          </Link>
          . For the assistant that handles calendar, reminders, and booking directly, see{" "}
          <Link href="/ai-brain/live-voice-assistant" className="font-medium text-[#0f172a] underline underline-offset-2">
            AI Brain
          </Link>
          .
        </p>
      </section>
    </>
  );
}
