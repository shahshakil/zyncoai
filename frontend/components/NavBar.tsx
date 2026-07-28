"use client";

import * as React from "react";
import Link from "next/link";
import ZyncoMark from "./ZyncoMark";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type MenuKey = "product" | "usecases" | "docs" | null;

function MenuItem({
  href,
  title,
  desc,
  onClick,
}: {
  href: string;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl border border-transparent p-2 hover:border-border hover:bg-white/[0.04]"
    >
      <div className="text-sm font-semibold text-text">{title}</div>
      <div className="mt-0.5 text-xs leading-5 text-zinc-300">{desc}</div>
    </Link>
  );
}

function MegaMenu({
  open,
  onClose,
}: {
  open: MenuKey;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const panel =
    open === "product" ? (
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-xs font-semibold text-zinc-400">Core</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/product" title="Product overview" desc="Workflows, agents, approvals, connectors." />
            <MenuItem onClick={onClose} href="/ai" title="AI workspace" desc="Build + run with agent control." />
            <MenuItem onClick={onClose} href="/integrations" title="Integrations" desc="Connect apps & services." />
            <MenuItem onClick={onClose} href="/templates" title="Templates" desc="Start fast with proven flows." />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Platform</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/governance" title="Governance" desc="Approvals, policies, audit trails." />
            <MenuItem onClick={onClose} href="/observability" title="Observability" desc="Runs, logs, metrics, retries." />
            <MenuItem onClick={onClose} href="/security" title="Security" desc="Controls, privacy, enterprise readiness." />
            <MenuItem onClick={onClose} href="/pricing" title="Pricing" desc="Plans for teams & scale." />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4">
          <div className="text-xs font-semibold text-zinc-300">Live Preview</div>
          <div className="mt-3 space-y-2 text-sm text-zinc-200">
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              Webhook received → validate payload
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              Agent: enrich lead → write CRM
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              Approval required → Slack → Approve
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              Create deal → Notify → Schedule meeting
            </div>
          </div>

          <Link
            href="/signup"
            onClick={onClose}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Start free
          </Link>
        </div>
      </div>
    ) : open === "usecases" ? (
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-xs font-semibold text-zinc-400">Solutions</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/solutions/sales-ops" title="Sales Ops" desc="Lead routing, CRM sync, approvals." />
            <MenuItem onClick={onClose} href="/solutions/support" title="Support" desc="Auto-triage, replies, ticket enrichment." />
            <MenuItem onClick={onClose} href="/solutions/it-ops" title="IT Ops" desc="Provisioning, alerts, incident flows." />
            <MenuItem onClick={onClose} href="/solutions/marketing" title="Marketing" desc="Campaign ops, analytics, content." />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Industries</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/solutions/saas" title="SaaS" desc="User lifecycle, billing, product ops." />
            <MenuItem onClick={onClose} href="/solutions/ecommerce" title="E-commerce" desc="Orders, returns, customer comms." />
            <MenuItem onClick={onClose} href="/solutions/fintech" title="FinTech" desc="Compliance-first automations." />
            <MenuItem onClick={onClose} href="/resources" title="Resources" desc="Guides, playbooks, best practices." />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-xs font-semibold text-zinc-300">Popular workflows</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Lead → Enrich → CRM",
              "Support → Classify → Reply",
              "Alert → Approve → Remediate",
              "Invoice → Review → Pay",
              "User → Onboard → Notify",
              "Churn → Detect → Winback",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>
          <Link
            href="/templates"
            onClick={onClose}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold hover:bg-white/[0.06]"
          >
            Browse templates
          </Link>
        </div>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-xs font-semibold text-zinc-400">Docs</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/docs" title="Documentation" desc="Guides, concepts, usage." />
            <MenuItem onClick={onClose} href="/security" title="Security docs" desc="Controls, privacy, posture." />
            <MenuItem onClick={onClose} href="/observability" title="Observability" desc="Runs, metrics, logs." />
            <MenuItem onClick={onClose} href="/governance" title="Governance" desc="Approvals, audit, policy." />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-400">Getting started</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/signup" title="Create account" desc="Start free in minutes." />
            <MenuItem onClick={onClose} href="/login" title="Log in" desc="Access your workspace." />
            <MenuItem onClick={onClose} href="/pricing" title="Plans & pricing" desc="Choose your plan." />
            <MenuItem onClick={onClose} href="/resources" title="Resources" desc="Playbooks & guides." />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-xs font-semibold text-zinc-300">Quick links</div>
          <div className="mt-3 space-y-2">
            <MenuItem onClick={onClose} href="/integrations" title="Integrations" desc="Browse connectors." />
            <MenuItem onClick={onClose} href="/templates" title="Templates" desc="Use proven recipes." />
            <MenuItem onClick={onClose} href="/product" title="Product" desc="Platform overview." />
            <MenuItem onClick={onClose} href="/ai" title="AI" desc="Build with agents." />
          </div>
        </div>
      </div>
    );

  return (
    <div className="absolute left-0 right-0 top-full z-50">
      <div className="fixed inset-0 bg-surface-2" onClick={onClose} />
      <div className="relative mx-auto mt-3 max-w-6xl px-4">
       <div className="overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-hubspot">
          {panel}
        </div>
      </div>
    </div>
  );
}

export default function NavBar() {
  const [openMenu, setOpenMenu] = React.useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="group inline-flex items-center gap-2">
            <ZyncoMark className="h-9 w-9" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-text">ZyncoAI</div>
              <div className="text-[11px] text-zinc-400">Automation + Agents</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 whitespace-nowrap text-sm text-zinc-300 md:flex">
            <button
              className={cn(
                "rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text",
                openMenu === "product" && "bg-white/[0.06] text-text"
              )}
              onClick={() => setOpenMenu((p) => (p === "product" ? null : "product"))}
              type="button"
            >
              Product
            </button>

            <button
              className={cn(
                "rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text",
                openMenu === "usecases" && "bg-white/[0.06] text-text"
              )}
              onClick={() => setOpenMenu((p) => (p === "usecases" ? null : "usecases"))}
              type="button"
            >
              Use cases
            </button>

            <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text" href="/integrations">
              Integrations
            </Link>

            <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text" href="/templates">
              Templates
            </Link>

            <button
              className={cn(
                "rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text",
                openMenu === "docs" && "bg-white/[0.06] text-text"
              )}
              onClick={() => setOpenMenu((p) => (p === "docs" ? null : "docs"))}
              type="button"
            >
              Docs
            </button>

            <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-text" href="/pricing">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.06] md:inline-flex">
              Log in
            </Link>
            <Link href="/signup" className="hidden rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 md:inline-flex">
              Start free
            </Link>

            {/* Mobile toggle */}
            <button
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <MegaMenu open={openMenu} onClose={() => setOpenMenu(null)} />

        {/* Mobile panel */}
        {mobileOpen ? (
          <div className="mb-3 rounded-2xl border border-border bg-surface p-4 shadow-hubspot md:hidden">
            <div className="grid gap-2 text-sm">
              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/product" onClick={() => setMobileOpen(false)}>Product</Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/integrations" onClick={() => setMobileOpen(false)}>Integrations</Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/templates" onClick={() => setMobileOpen(false)}>Templates</Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/docs" onClick={() => setMobileOpen(false)}>Docs</Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>

              <div className="my-2 h-px bg-white/10" />

              <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.06]" href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link className="rounded-xl bg-white px-3 py-2 font-semibold text-zinc-950 hover:bg-zinc-200" href="/signup" onClick={() => setMobileOpen(false)}>
                Start free
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
