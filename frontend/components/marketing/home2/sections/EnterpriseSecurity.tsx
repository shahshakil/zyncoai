"use client";

export default function EnterpriseSecurity() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              ENTERPRISE SECURITY
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              A secure execution fabric for AI and automation.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              Identity, policy, approvals, secrets isolation, audit trails, and export-ready logs —
              built into the platform instead of bolted on later.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "RBAC + org isolation",
                "SSO / SCIM ready",
                "Secrets isolation",
                "Approval checkpoints",
                "Audit log export",
                "Policy-based execution",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 text-sm font-semibold text-zinc-800 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-zinc-200 bg-[#fbfaf8] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.06)] md:p-5">
            <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(112,76,255,0.20),rgba(9,9,16,1)_72%)] p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/60">Identity</div>
                  <div className="mt-3 text-lg font-bold">User / Org / Role</div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/60">Policy</div>
                  <div className="mt-3 text-lg font-bold">Approve / deny / limit</div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/60">Audit</div>
                  <div className="mt-3 text-lg font-bold">Trace every action</div>
                </div>
              </div>

              <div className="relative mt-6 overflow-hidden rounded-[26px] border border-white/12 bg-white/6 p-5">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center text-sm font-semibold text-white">
                    Request enters
                  </div>
                  <div className="text-center text-2xl text-violet-300">→</div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center text-sm font-semibold text-white">
                    Policy evaluated
                  </div>
                  <div className="text-center text-2xl text-violet-300">→</div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center text-sm font-semibold text-white">
                    Action executed + logged
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  {["Approval", "Secrets", "Rate limit", "SIEM export"].map((tag) => (
                    <div
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-center text-xs font-semibold text-white/85"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 text-white">
                  <div className="text-sm font-semibold">Zero-trust pathing</div>
                  <div className="mt-2 text-xs leading-6 text-white/70">
                    Requests are evaluated before tool execution.
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 text-white">
                  <div className="text-sm font-semibold">Execution controls</div>
                  <div className="mt-2 text-xs leading-6 text-white/70">
                    Isolation, retries, backoff, and action guardrails.
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 text-white">
                  <div className="text-sm font-semibold">Audit evidence</div>
                  <div className="mt-2 text-xs leading-6 text-white/70">
                    Exportable trails for enterprise review.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
