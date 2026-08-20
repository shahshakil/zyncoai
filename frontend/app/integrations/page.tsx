import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Integrations",
  description:
    "Connect apps, databases, and services through the ZyncoAI connector registry — credentials stored encrypted and scoped to the workflows that need them.",
  alternates: { canonical: "/integrations", languages: { "en-AU": "/integrations", en: "/integrations" } },
};

const CATEGORIES = [
  { title: "Messaging & notifications", body: "Slack, email, and SMS connectors for alerts, approvals, and status updates without leaving the tool your team already checks." },
  { title: "CRM & data", body: "Read and write records without hand-rolled API code per workflow — the same connector backs every workflow that touches that system." },
  { title: "Databases & storage", body: "Query and write directly, with credentials stored encrypted and scoped to only the workflows that actually need them." },
  { title: "Webhooks & custom APIs", body: "Anything without a pre-built connector yet can still connect through a generic webhook or HTTP step." },
];

export default function IntegrationsPage() {
  return (
    <>
      <SimplePage title="Integrations" subtitle="Connect apps, databases, and services securely." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <div key={c.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{c.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          Every connector lives in one registry shared across workflows — see what&apos;s already built on the{" "}
          <Link href="/platform/connectors" className="font-medium text-[#0f172a] underline underline-offset-2">
            connector framework
          </Link>{" "}
          page, or read how credentials and access are protected on{" "}
          <Link href="/security" className="font-medium text-[#0f172a] underline underline-offset-2">
            Security
          </Link>
          .
        </p>
      </section>
    </>
  );
}
