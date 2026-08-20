import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Docs & Help",
  description:
    "Find ZyncoAI's product documentation, help centre, and API reference — call forwarding setup, connecting your practice software, webhooks, and troubleshooting.",
  alternates: { canonical: "/docs", languages: { "en-AU": "/docs", en: "/docs" } },
};

const SECTIONS = [
  {
    title: "Documentation",
    body: "How ZyncoAI works end to end: call forwarding setup, connecting your practice or booking software, and using your dashboard.",
    href: "/resources/docs",
    linkLabel: "Read the docs",
  },
  {
    title: "Help Centre",
    body: "FAQs, troubleshooting, billing questions, staff invites, and the cancellation and refund policy.",
    href: "/resources/help",
    linkLabel: "Visit the Help Centre",
  },
  {
    title: "API Reference",
    body: "Webhook events, HMAC signature verification, retry policy, and sample payloads for building against ZyncoAI directly.",
    href: "/resources/api",
    linkLabel: "View the API reference",
  },
];

export default function DocsPage() {
  return (
    <>
      <SimplePage title="Docs & Help" subtitle="Documentation, the Help Centre, and the API reference, all in one place." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-3">
          {SECTIONS.map((s) => (
            <div key={s.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{s.body}</p>
              <Link href={s.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0f172a] hover:text-brand">
                {s.linkLabel} <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          Can&apos;t find what you&apos;re after in one of the three sections above? Reach the team directly on the{" "}
          <Link href="/contact" className="font-medium text-[#0f172a] underline underline-offset-2">
            Contact
          </Link>{" "}
          page — support@zyncoai.com typically replies within four business hours.
        </p>
      </section>
    </>
  );
}
