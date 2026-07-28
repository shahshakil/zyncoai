import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, ShieldCheck, LifeBuoy, History, Activity, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | ZyncoAI",
  description: "Documentation, API reference, trust & security, help centre, changelog, and live system status for ZyncoAI.",
};

const CARDS = [
  { href: "/resources/docs", icon: BookOpen, title: "Documentation", desc: "How ZyncoAI works, call forwarding setup, integrations, and your dashboard." },
  { href: "/resources/api", icon: Code2, title: "API Reference", desc: "Webhooks, integration endpoints, authentication, and sample payloads." },
  { href: "/resources/trust", icon: ShieldCheck, title: "Trust & Security", desc: "How we protect patient data, encryption, and Australian compliance." },
  { href: "/resources/help", icon: LifeBuoy, title: "Help Centre", desc: "FAQs, troubleshooting, billing, staff invites, and refund policy." },
  { href: "/resources/changelog", icon: History, title: "Changelog", desc: "Version history — what's new, fixed, and improved." },
  { href: "/resources/status", icon: Activity, title: "System Status", desc: "Live platform status and uptime." },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[#030712] pt-8">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">Resources</h1>
        <p className="mt-3 text-[#94a3b8]">Documentation, API reference, trust materials, and help — everything to get the most out of ZyncoAI.</p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 px-6 pb-20 sm:grid-cols-2 lg:px-8">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="group rounded-2xl border border-white/10 bg-[#0b0f19] p-6 transition hover:border-[#4f87f0]/40">
            <c.icon className="h-6 w-6 text-[#8ab4ff]" />
            <h3 className="mt-4 text-base font-semibold text-[#f8fafc]">{c.title}</h3>
            <p className="mt-1.5 text-sm text-[#94a3b8]">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#8ab4ff]">
              Explore <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
