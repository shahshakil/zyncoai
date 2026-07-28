"use client";

export default function HeroInvestorCopy() {
  return (
    <div className="mt-8 grid gap-3">
      {[
        "Describe → Deploy: convert business intent into controlled workflow execution",
        "AgentOps: planners, memory, decisioning, repair loops, approvals, and outcome reasoning",
        "WorkflowOps: versioning, staging, rollback, run monitoring, release safety, and runtime visibility",
        "Enterprise fabric: governance, auditability, permissions, orchestration discipline, and safer deployment",
      ].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm"
        >
          • {item}
        </div>
      ))}
    </div>
  );
}
