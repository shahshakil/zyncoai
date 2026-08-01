"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { trackConversion } from "@/components/seo/GoogleAnalytics";

// Metadata can't be exported from a Client Component — moved to a
// sibling layout.tsx in this same route segment.
const CONTACT_NUMBER = "+61 480 738 227";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@zyncoai.com",
    href: "mailto:support@zyncoai.com",
    event: "contact_email_click",
  },
  {
    icon: Phone,
    label: "Call us",
    value: CONTACT_NUMBER,
    href: `tel:${CONTACT_NUMBER.replace(/\s/g, "")}`,
    event: "contact_phone_click",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Newcastle, NSW, Australia",
    href: undefined,
    event: undefined,
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Get in touch</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#475569]">
          Questions about pricing, a specific industry fit, or want a hand setting up your account? The team behind Ella is a call or email away —
          not an offshore support queue.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            const content = (
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <Icon className="mx-auto h-5 w-5 text-[#6366f1]" />
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[#94a3b8]">{c.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">{c.value}</p>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} onClick={() => c.event && trackConversion(c.event)}>
                {content}
              </a>
            ) : (
              <div key={c.label}>{content}</div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20 text-center lg:px-8">
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-[#0f172a]">Prefer to try it first?</h2>
          <p className="mt-2 text-sm text-[#475569]">Start a 7-day free trial — no credit card required.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
              Start free trial
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50">
              Try the live demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
