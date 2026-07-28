"use client";

const ITEMS = [
  {
    title: "Versioning",
    text: "Ship new workflow revisions with clear operational visibility and safer rollout discipline.",
  },
  {
    title: "Staging",
    text: "Test new logic before production paths touch real customers, real CRM records, or real operations.",
  },
  {
    title: "Monitoring",
    text: "Track run health, latency, recovery, and workflow quality instead of flying blind after deployment.",
  },
  {
    title: "Rollback",
    text: "Reverse risky changes quickly when production conditions shift or a new release underperforms.",
  },
  {
    title: "Approvals",
    text: "Keep high-trust actions behind human review when the workflow needs policy or operational sign-off.",
  },
  {
    title: "Auditability",
    text: "Every serious platform needs execution evidence, outcome tracking, and traceable actions.",
  },
];

export default function WorkflowOpsSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            WORKFLOWOPS
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Build, stage, observe, rollback.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            This section should make ZyncoAI look like a serious execution system,
            not just a pretty builder. WorkflowOps is what makes enterprise buyers trust automation.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(60,30,140,0.10)]"
            >
              <h3 className="text-xl font-bold text-zinc-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[34px] border border-zinc-200 bg-[#fbfaf8] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Release flow
              </div>

              <div className="mt-5 space-y-4">
                {[
                  "Draft workflow revision",
                  "Stage against safe environments",
                  "Validate outputs and approval rules",
                  "Deploy to production",
                  "Monitor runs and recovery",
                  "Rollback instantly if needed",
                ].map((step, i) => (
                  <div
                    key={step}
                    className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 text-sm font-semibold text-zinc-800"
                  >
                    Step {i + 1} · {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Why it matters
              </div>
              <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
                Reliability becomes visible.
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                Better WorkflowOps makes your homepage feel stronger because it shows that ZyncoAI
                is built for real execution quality — not just one-off experiments or shallow demos.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  "Safer releases",
                  "Less operational fear",
                  "Better team trust",
                  "Clearer production story",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[linear-gradient(135deg,#f9f5ff,#ffffff)] px-4 py-3 text-sm font-semibold text-zinc-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
