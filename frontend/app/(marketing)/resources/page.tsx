import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, ShieldCheck, LifeBuoy, History, Activity, ArrowRight, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Blog, documentation, API reference, trust & security, help centre, changelog, and live system status for ZyncoAI.",
  alternates: { canonical: "/resources" },
};

const CARDS = [
  { href: "/resources/blog", icon: Newspaper, title: "Blog", desc: "Guides on AI call answering, industry breakdowns, and honest comparisons." },
  { href: "/resources/docs", icon: BookOpen, title: "Documentation", desc: "How ZyncoAI works, call forwarding setup, integrations, and your dashboard." },
  { href: "/resources/api", icon: Code2, title: "API Reference", desc: "Webhooks, integration endpoints, authentication, and sample payloads." },
  { href: "/resources/trust", icon: ShieldCheck, title: "Trust & Security", desc: "How we protect patient data, encryption, and Australian compliance." },
  { href: "/resources/help", icon: LifeBuoy, title: "Help Centre", desc: "FAQs, troubleshooting, billing, staff invites, and refund policy." },
  { href: "/resources/changelog", icon: History, title: "Changelog", desc: "Version history — what's new, fixed, and improved." },
  { href: "/resources/status", icon: Activity, title: "System Status", desc: "Live platform status and uptime." },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Resources</h1>
        <p className="mt-3 text-[#475569]">Documentation, API reference, trust materials, and help — everything to get the most out of ZyncoAI.</p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 px-6 pb-20 sm:grid-cols-2 lg:px-8">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:border-[#6366f1]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          >
            <c.icon className="h-6 w-6 text-[#6366f1]" />
            <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{c.title}</h3>
            <p className="mt-1.5 text-sm text-[#475569]">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#6366f1]">
              Explore <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
