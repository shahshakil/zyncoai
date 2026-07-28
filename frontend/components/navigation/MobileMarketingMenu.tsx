"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

const groups = [
  {
    title: "AgentOps",
    items: [
      { label: "AI Planner", href: "/#ai-brain" },
      { label: "Agent memory", href: "/#ai-brain" },
      { label: "Repair loops", href: "/#workflow-animation" },
      { label: "Approvals", href: "/enterprise" },
    ],
  },
  {
    title: "WorkflowOps",
    items: [
      { label: "Builder", href: "/#workflow-animation" },
      { label: "Monitoring", href: "/#customer-proof" },
      { label: "Versioning", href: "/enterprise" },
      { label: "Rollback", href: "/enterprise" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Connectors cloud", href: "/#connectors-cloud" },
      { label: "AI Brain", href: "/#ai-brain" },
      { label: "Templates", href: "/#templates" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
];

export default function MobileMarketingMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#090910] text-white shadow-[0_0_80px_rgba(0,0,0,0.35)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="text-2xl font-semibold tracking-tight">ZyncoAI</div>
              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.28),rgba(9,9,16,1)_65%)] p-5 shadow-[0_20px_60px_rgba(124,58,237,0.20)]">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                  AI-native automation
                </div>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
                  Bigger workflow, agent, and enterprise surface.
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Run workflows, planners, connectors, and control layers from one premium platform.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href="/app"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 px-5 text-sm font-semibold text-white"
                  >
                    Start free
                  </Link>
                  <Link
                    href="/enterprise"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white"
                  >
                    Enterprise
                  </Link>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {groups.map((group) => (
                  <div key={group.title}>
                    <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {group.title}
                    </div>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-200"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-zinc-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Direct links
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Use cases", href: "/#use-cases" },
                      { label: "Templates gallery", href: "/#templates" },
                      { label: "Customer proof", href: "/#customer-proof" },
                      { label: "Pricing", href: "/pricing" },
                      { label: "Sign in", href: "/sign-in" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-200"
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
