import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Governance | ZyncoAI",
  description:
    "Approvals, policy guardrails, and change tracking for automation — how ZyncoAI keeps agent and workflow actions inside the boundaries a team actually agreed to.",
  alternates: { canonical: "/governance", languages: { "en-AU": "/governance", en: "/governance" } },
};

const CONTROLS = [
  {
    title: "Approvals",
    body: "A workflow step can be marked as requiring sign-off before it proceeds — a refund over a threshold, a message going out to a customer list, a change to a live workflow. The run pauses and waits for a named approver rather than going ahead by default.",
  },
  {
    title: "Policy guardrails",
    body: "Constraints on what an agent or workflow is allowed to do are set once and enforced on every run — which tools it can call, what data it can touch, what actions need a human regardless of how confident the agent is.",
  },
  {
    title: "Change tracking",
    body: "Every edit to a workflow or policy is a versioned change with an author and a timestamp, not an in-place overwrite. Reviewing what changed between two versions is a diff, not a guess.",
  },
];

export default function GovernancePage() {
  return (
    <>
      <SimplePage title="Governance" subtitle="Approvals, policies, guardrails, and change tracking." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-3">
          {CONTROLS.map((c) => (
            <div key={c.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{c.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          Governance is what makes it reasonable to let{" "}
          <Link href="/agentops" className="font-medium text-[#0f172a] underline underline-offset-2">
            AgentOps
          </Link>{" "}
          agents make real decisions instead of only ever proposing them — the guardrails and approval points
          are the same regardless of whether a step ran automatically or an agent decided it. For access
          control and audit logging specifically, see{" "}
          <Link href="/security" className="font-medium text-[#0f172a] underline underline-offset-2">
            Security
          </Link>
          .
        </p>
      </section>
    </>
  );
}
