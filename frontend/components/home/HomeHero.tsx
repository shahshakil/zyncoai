import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Enterprise automation, powered by multi-agent orchestration
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-900">
              Build workflows.
              <span className="block text-brand"> Control outcomes.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
              ZyncoAI designs, deploys, and monitors automation with governance, reliability,
              and observability built in—so teams can ship faster without losing control.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Start free
              </Link>
              <Link
                href="/enterprise"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Talk to sales
              </Link>
              <Link
                href="/platform"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                See the platform
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                SOC2-ready patterns
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Audit logs & SIEM export
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                RBAC, SSO, SCIM
              </span>
            </div>
          </div>

          {/* Right panel (Zapier-like visual placeholder) */}
          <div className="relative">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Live automation control plane</div>
              <div className="mt-1 text-xs text-zinc-600">
                Orchestrate agents, workflows, connectors, and governance in one place.
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs text-zinc-500">AgentOps</div>
                  <div className="mt-1 font-semibold text-zinc-900">
                    Multi-agent system • Memory • Self-healing
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs text-zinc-500">WorkflowOps</div>
                  <div className="mt-1 font-semibold text-zinc-900">
                    Versioning • Staging • Monitoring • Rollback
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs text-zinc-500">Enterprise</div>
                  <div className="mt-1 font-semibold text-zinc-900">
                    SSO/SCIM • Audit/SIEM • Data residency
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand/15 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
