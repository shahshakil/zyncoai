"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import PremiumNavDropdown from "@/components/navigation/PremiumNavDropdown";
import MobileMarketingMenu from "@/components/navigation/MobileMarketingMenu";

const dropdowns = {
  agentops: {
    title: "AgentOps",
    items: [
      {
        label: "AI Planner",
        href: "/#ai-brain",
        desc: "Plan actions, choose tools, and coordinate execution logic.",
      },
      {
        label: "Agent memory",
        href: "/#ai-brain",
        desc: "Keep context, state, and operational reasoning attached to runs.",
      },
      {
        label: "Repair loops",
        href: "/#workflow-animation",
        desc: "Retry, recover, and continue execution with safer runtime paths.",
      },
      {
        label: "Approvals",
        href: "/enterprise",
        desc: "Bring people into the loop when policy or business logic requires it.",
      },
    ],
  },
  workflowops: {
    title: "WorkflowOps",
    items: [
      {
        label: "Builder",
        href: "/#workflow-animation",
        desc: "Compose execution flows visually with a premium workflow surface.",
      },
      {
        label: "Versioning",
        href: "/enterprise",
        desc: "Track release changes and move workflows forward with more control.",
      },
      {
        label: "Rollback",
        href: "/enterprise",
        desc: "Recover safer when a release or change needs to be reverted.",
      },
      {
        label: "Monitoring",
        href: "/#customer-proof",
        desc: "See outcomes, retries, health, and execution confidence signals.",
      },
    ],
  },
  platform: {
    title: "Platform",
    items: [
      {
        label: "Connectors cloud",
        href: "/#connectors-cloud",
        desc: "Link apps, tools, APIs, and internal systems into one orchestration layer.",
      },
      {
        label: "AI Brain",
        href: "/#ai-brain",
        desc: "One intelligent core across workflows, agents, and runtime decisions.",
      },
      {
        label: "Templates",
        href: "/#templates",
        desc: "Start from pre-built operational patterns and reusable workflow structures.",
      },
      {
        label: "Enterprise",
        href: "/enterprise",
        desc: "Govern automation with runtime controls, visibility, and deployment discipline.",
      },
    ],
  },
  useCases: {
    title: "Use cases",
    items: [
      {
        label: "Marketing",
        href: "/solutions/marketing",
        desc: "Route leads, campaigns, approvals, and follow-up execution.",
      },
      {
        label: "Support",
        href: "/solutions/support",
        desc: "Classify, enrich, escalate, and resolve customer operations faster.",
      },
      {
        label: "SaaS",
        href: "/solutions/saas",
        desc: "Run product, revenue, onboarding, and lifecycle automations at scale.",
      },
      {
        label: "Enterprise ops",
        href: "/enterprise",
        desc: "Coordinate internal operations with better trust and control.",
      },
    ],
  },
  resources: {
    title: "Resources",
    items: [
      {
        label: "Templates gallery",
        href: "/#templates",
        desc: "See reusable workflow starting points and launch-ready surfaces.",
      },
      {
        label: "Customer proof",
        href: "/#customer-proof",
        desc: "Show buyers why the product feels credible and enterprise-ready.",
      },
      {
        label: "Pricing preview",
        href: "/#pricing",
        desc: "Move users toward subscription with a stronger commercial story.",
      },
      {
        label: "Enterprise security",
        href: "/enterprise",
        desc: "Position governance, access, deployment, and security with clarity.",
      },
    ],
  },
};

type DropdownKey = keyof typeof dropdowns | null;

export default function MarketingNavbar() {
  const [open, setOpen] = useState<DropdownKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onClose = () => setOpen(null);
    window.addEventListener("scroll", onClose);
    return () => window.removeEventListener("scroll", onClose);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#f6f1ee]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-zinc-950">
            ZyncoAI
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              ["agentops", "AgentOps"],
              ["workflowops", "WorkflowOps"],
              ["platform", "Platform"],
              ["useCases", "Use Cases"],
              ["resources", "Resources"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setOpen(key as DropdownKey)}
                onMouseLeave={() => setOpen(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-zinc-700 transition hover:text-zinc-950">
                  {label}
                  <ChevronDown className="h-4 w-4" />
                </button>

                <PremiumNavDropdown
                  open={open === key}
                  title={dropdowns[key as keyof typeof dropdowns].title}
                  items={dropdowns[key as keyof typeof dropdowns].items}
                />
              </div>
            ))}

            <Link href="/enterprise" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">
              Enterprise
            </Link>

            <Link href="/#ai-brain" className="text-sm font-medium text-violet-600 hover:text-violet-700">
              AI Brain
            </Link>

            <Link href="/pricing" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">
              Pricing
            </Link>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/sign-in" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">
              Sign in
            </Link>
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.24)]"
            >
              Start free
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMarketingMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
