import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ContactForm } from "@/components/marketing/receptionist/ContactForm";
import { SupportSearchHero } from "@/components/marketing/receptionist/SupportSearchHero";
import { SupportStatusStrip } from "@/components/marketing/receptionist/SupportStatusStrip";
import { HELP_CATEGORIES } from "@/lib/verifiedHelpContent";
import { getStatusLive, type StatusComponent } from "@/lib/marketing-api";

export const metadata: Metadata = {
  title: "Support Hub",
  description: "Search our verified Help Centre, check live system status, or message the founder directly — no ticket queue, no AI-generated answers.",
  alternates: { canonical: "/support" },
};

// getStatusLive() already caches its own fetch for 30s (see lib/marketing-api.ts).
// Setting the same window here via ISR means the status strip on this page
// is never more than 30s stale without paying force-dynamic's full
// per-request server-render cost on what's otherwise a mostly-static hub.
export const revalidate = 30;

const FALLBACK_COMPONENTS: StatusComponent[] = [
  { component: "api", label: "API", status: "down", detail: "unreachable" },
  { component: "database", label: "Database", status: "down", detail: "unreachable" },
  { component: "redis", label: "Redis", status: "down", detail: "unreachable" },
  { component: "voice", label: "Voice platform", status: "down", detail: "unreachable" },
  { component: "billing_webhooks", label: "Billing webhooks", status: "down", detail: "unreachable" },
];

const DIFFERENTIATORS = [
  "Every answer here is verified by us, word for word — not AI-generated.",
  "Your message is read by the founder — usually same day.",
  "Same support on every plan — we don't paywall help.",
];

const FOOTER_LINKS = [
  { label: "Help Centre", href: "/resources/help" },
  { label: "API Reference", href: "/resources/api" },
  { label: "Status", href: "/resources/status" },
  { label: "Terms", href: "/terms" },
];

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max).trimEnd() + "…";
}

export default async function SupportHubPage() {
  const live = await getStatusLive();
  const components = live?.components?.length ? live.components : FALLBACK_COMPONENTS;
  const checkedAt = live?.checkedAt || new Date().toISOString();
  const liveDataAvailable = Boolean(live?.ok);

  // One representative article per Help Centre category — data-driven so
  // this stays in sync with lib/verifiedHelpContent.ts automatically
  // instead of a hand-picked list that can go stale.
  const recommended = HELP_CATEGORIES.map((c) => ({ category: c.name, item: c.items[0] })).filter((r) => r.item);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Support", href: "/support" }]} />

      <section className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
        <SupportSearchHero />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 lg:px-8">
        <h2 className="text-xl font-bold text-[#0f172a]">Recommended articles</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map(({ category, item }) => (
            <Link
              key={item.slug}
              href={`/resources/help#${item.slug}`}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">{category}</span>
              <p className="mt-1.5 font-semibold text-[#0f172a]">{item.question}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{truncate(item.answer, 120)}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6366f1]">
                Read more <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:p-8">
            <h2 className="text-xl font-bold text-[#0f172a]">Still need help? Message us directly</h2>
            <p className="mt-1.5 text-sm text-[#475569]">A real person reads and replies to every message — no ticket queue, no auto-responder.</p>
            <div className="mt-6">
              <ContactForm source="support_hub" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-[#0f172a]">Live status</h2>
              <div className="mt-3">
                {!liveDataAvailable && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Live status data is temporarily unavailable — showing the last known state.
                  </div>
                )}
                <SupportStatusStrip components={components} checkedAt={checkedAt} liveDataAvailable={liveDataAvailable} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <h2 className="text-sm font-semibold text-[#0f172a]">Why our support is different</h2>
              <ul className="mt-3 space-y-3">
                {DIFFERENTIATORS.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-[#475569]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#e2e8f0] pt-6 text-sm">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium text-[#475569] hover:text-[#0f172a]">
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
