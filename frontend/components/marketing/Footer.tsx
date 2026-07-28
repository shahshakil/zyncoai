"use client";

import Link from "next/link";

const footerColumns = [
  {
    title: "Platform",
    items: [
      { label: "AgentOps", href: "/#agentops" },
      { label: "WorkflowOps", href: "/#workflowops" },
      { label: "Templates", href: "/#templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { label: "Marketing", href: "/solutions/marketing" },
      { label: "Support", href: "/solutions/support" },
      { label: "SaaS", href: "/solutions/saas" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "AI Brain", href: "/#ai-brain" },
      { label: "Use cases", href: "/#use-cases" },
      { label: "Customer proof", href: "/#customer-proof" },
      { label: "Security", href: "/enterprise" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#070710] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(124,58,237,0.18),transparent_20%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.10),transparent_20%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="text-2xl font-semibold tracking-tight">ZyncoAI</div>
            <p className="mt-4 text-base leading-8 text-zinc-300">
              AI-native automation platform for workflows, agents, operations,
              observability, orchestration, and enterprise execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Workflows",
                "Agents",
                "Runtime controls",
                "Connectors",
                "Enterprise",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <div className="text-sm font-semibold text-white">{col.title}</div>
                <div className="mt-4 space-y-3">
                  {col.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block text-sm text-zinc-400 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} ZyncoAI. Built for serious automation.</div>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/enterprise" className="hover:text-white">
              Enterprise
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
