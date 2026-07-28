import Link from "next/link";
import ZyncoMark from "./ZyncoMark";

type Item = { label: string; href: string; badge?: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-text-2">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
            >
              <span>{it.label}</span>
              {it.badge ? (
                <span className="rounded-full border border-border bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-text">
                  {it.badge}
                </span>
              ) : null}
              <span className="opacity-0 transition group-hover:opacity-100">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TagList({ title, tags }: { title: string; tags: Array<{ label: string; href: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-white/[0.03] p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-2">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-full border border-border bg-black/20 px-3 py-1 text-xs text-text hover:bg-white/[0.06]"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  // Core columns (REAL links you asked for)
  const product: Item[] = [
    { label: "Product overview", href: "/product" },
    { label: "AI workspace", href: "/ai", badge: "New" },
    { label: "Integrations", href: "/integrations" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
  ];

  const platform: Item[] = [
    { label: "Observability", href: "/observability" },
    { label: "Governance", href: "/governance" },
    { label: "Security", href: "/security" },
    { label: "Docs", href: "/docs" },
    { label: "Resources", href: "/resources" },
  ];

  const solutions: Item[] = [
    { label: "Sales Ops", href: "/solutions/sales-ops" },
    { label: "Support", href: "/solutions/support" },
    { label: "IT Ops", href: "/solutions/it-ops" },
    { label: "Marketing", href: "/solutions/marketing" },
    { label: "SaaS", href: "/solutions/saas" },
    { label: "E-commerce", href: "/solutions/ecommerce" },
    { label: "FinTech", href: "/solutions/fintech" },
  ];

  const company: Item[] = [
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "Docs", href: "/docs" },
    { label: "Security", href: "/security" },
  ];

  // “n8n style” lists, but mapped to your real pages
  const popularIntegrations = [
    { label: "Google Sheets", href: "/integrations" },
    { label: "Slack", href: "/integrations" },
    { label: "Discord", href: "/integrations" },
    { label: "Postgres", href: "/integrations" },
    { label: "MySQL", href: "/integrations" },
    { label: "Telegram", href: "/integrations" },
  ];

  const trendingCombinations = [
    { label: "HubSpot + Salesforce", href: "/templates" },
    { label: "GitHub + Jira", href: "/templates" },
    { label: "Asana + Slack", href: "/templates" },
    { label: "Stripe + Notion", href: "/templates" },
    { label: "Gmail + Google Sheets", href: "/templates" },
  ];

  const topIntegrationCategories = [
    { label: "Communication", href: "/integrations" },
    { label: "Development", href: "/integrations" },
    { label: "Cybersecurity", href: "/security" },
    { label: "AI", href: "/ai" },
    { label: "Data & Storage", href: "/integrations" },
    { label: "Marketing", href: "/solutions/marketing" },
  ];

  const trendingTemplates = [
    { label: "Create an AI agent endpoint", href: "/templates" },
    { label: "Scrape & summarize web pages", href: "/templates" },
    { label: "Join different databases", href: "/templates" },
    { label: "Back up your workflows", href: "/templates" },
    { label: "Very quick quickstart", href: "/docs" },
  ];

  const topGuides = [
    { label: "Open-source LLM", href: "/docs" },
    { label: "Open-source chatbot", href: "/docs" },
    { label: "Open-source low-code platform", href: "/docs" },
    { label: "Zapier alternatives", href: "/resources" },
    { label: "Make vs Zapier", href: "/resources" },
  ];

  return (
    <footer className="border-t border-border bg-bg">
      {/* Top CTA band (Zapier-like) */}
      <div className="bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,.22),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,.18),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(56,189,248,.12),transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid items-center gap-6 rounded-3xl border border-border bg-surface p-6 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2">
                <ZyncoMark className="h-8 w-8" />
                <span className="text-sm font-semibold text-white">ZyncoAI</span>
                <span className="text-xs text-zinc-400">Production-grade automation</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                Automate faster. Govern better. Observe everything.
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-2">
                Workflows + autonomous agents with approvals, audit trails, retries, logs, metrics, and security —
                built to ship to production.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Start free
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06]"
                >
                  View pricing
                </Link>
              </div>
              <div className="text-xs text-zinc-400">
                No credit card required • Upgrade anytime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega footer grid (like n8n screenshot) */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <ZyncoMark className="h-10 w-10" />
              <div className="leading-tight">
                <div className="text-base font-semibold text-white">ZyncoAI</div>
                <div className="text-xs text-zinc-400">Agents • Governance • Observability</div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
              Build multi-step workflows and AI agents you control. Add approvals, policy, audit trails, retries,
              and full run visibility — designed for serious automation.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-text hover:bg-white/[0.06]" href="/product">
                Product
              </Link>
              <Link className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-text hover:bg-white/[0.06]" href="/docs">
                Docs
              </Link>
              <Link className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-text hover:bg-white/[0.06]" href="/security">
                Security
              </Link>
              <Link className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-text hover:bg-white/[0.06]" href="/pricing">
                Pricing
              </Link>
            </div>
          </div>

          {/* Core columns */}
          <FooterCol title="Product" items={product} />
          <FooterCol title="Platform" items={platform} />
          <FooterCol title="Solutions" items={solutions} />
          <FooterCol title="Company" items={company} />
        </div>

        {/* n8n-like “directory” section */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <TagList
            title="Popular integrations"
            tags={popularIntegrations}
          />
          <TagList
            title="Trending combinations"
            tags={trendingCombinations}
          />
          <TagList
            title="Top integration categories"
            tags={topIntegrationCategories}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white/[0.03] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-2">Trending templates</div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {trendingTemplates.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block rounded-xl border border-transparent p-2 text-sm text-text-2 hover:border-border hover:bg-white/[0.04] hover:text-white"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/templates" className="text-sm font-semibold text-white hover:opacity-90">
                Show more →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white/[0.03] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-2">Top guides</div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {topGuides.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block rounded-xl border border-transparent p-2 text-sm text-text-2 hover:border-border hover:bg-white/[0.04] hover:text-white"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/docs" className="text-sm font-semibold text-white hover:opacity-90">
                Show more →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom legal bar (like your screenshot) */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} ZyncoAI. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="hover:text-white" href="/security">Security</Link>
            <Link className="hover:text-white" href="/docs">Docs</Link>
            <Link className="hover:text-white" href="/resources">Resources</Link>
            <Link className="hover:text-white" href="/about">About</Link>
            <Link className="hover:text-white" href="/pricing">Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
