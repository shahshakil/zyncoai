"use client";

function Block({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
      <h3 className="text-xl font-bold text-zinc-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{text}</p>
    </div>
  );
}

export default function InvestorProof() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            CUSTOMER PROOF · ENTERPRISE SECURITY · WHY ZYNCOAI
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Why serious customers and future investors should care.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            A premium homepage should not only look nice. It should answer:
            why ZyncoAI, why now, why this team, why this architecture, and why this can grow.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Block
            title="Why ZyncoAI"
            text="ZyncoAI is not positioned as one more automation widget. It combines workflow execution, AgentOps, WorkflowOps, reminders, integrations, governance, and orchestration into one operating layer."
          />
          <Block
            title="Why powerful"
            text="It is powerful because the platform story is deeper than a single builder: agents plan, tools run, outputs land in real systems, failures recover, approvals gate risky actions, and execution is observable."
          />
          <Block
            title="Why enterprise-ready"
            text="Enterprise buyers want secure execution, permissions, auditability, policy control, team boundaries, and operational confidence. Your homepage should visually prove that this platform was designed with those expectations in mind."
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[34px] border border-zinc-200 bg-[#fbfaf8] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Enterprise security
            </div>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
              Secure execution fabric
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
              Policy-aware execution, org isolation, audit records, action traceability, approvals,
              and safer automation paths — this is the kind of story that makes the platform feel real.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "RBAC + role boundaries",
                "Approval checkpoints",
                "Execution guardrails",
                "Secrets isolation",
                "Audit trail export",
                "Production-safe rollout patterns",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 text-sm font-semibold text-zinc-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-zinc-200 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Pricing preview
            </div>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
              Start free. Expand with control.
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-zinc-200 bg-[#faf8ff] p-5">
                <div className="text-sm font-semibold text-zinc-500">Starter</div>
                <div className="mt-2 text-3xl font-black text-zinc-950">Free</div>
                <div className="mt-2 text-sm leading-7 text-zinc-600">
                  Build workflows, test orchestration, explore templates, and validate value fast.
                </div>
              </div>

              <div className="rounded-[24px] border border-violet-200 bg-[linear-gradient(135deg,#ffffff_0%,#faf6ff_100%)] p-5 shadow-[0_15px_50px_rgba(108,71,255,0.10)]">
                <div className="text-sm font-semibold text-violet-700">Growth</div>
                <div className="mt-2 text-3xl font-black text-zinc-950">Production</div>
                <div className="mt-2 text-sm leading-7 text-zinc-600">
                  Ship monitored workflows, approval paths, reminders, connectors, and team automation.
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-[#faf8ff] p-5">
                <div className="text-sm font-semibold text-zinc-500">Enterprise</div>
                <div className="mt-2 text-3xl font-black text-zinc-950">Custom</div>
                <div className="mt-2 text-sm leading-7 text-zinc-600">
                  Governance, policy controls, org boundaries, secure execution, and enterprise review readiness.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
