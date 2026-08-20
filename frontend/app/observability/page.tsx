import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Observability",
  description:
    "Run history, retries, metrics, logs, and tracing for every workflow — so a failure is something you can diagnose, not just something you notice happened.",
  alternates: { canonical: "/observability", languages: { "en-AU": "/observability", en: "/observability" } },
};

const SIGNALS = [
  {
    title: "Run history",
    body: "Every run is recorded with what triggered it, what each step did, and how long it took — searchable after the fact, not just visible while it's happening.",
  },
  {
    title: "Retries & failures",
    body: "When a step fails, the retry attempts, the error each one hit, and whether it eventually succeeded or gave up are all part of the same record — not just a final pass/fail flag.",
  },
  {
    title: "Metrics",
    body: "Volume, reliability, and time-savings numbers roll up from real run data on Automation Analytics, so 'is this workflow actually working' has an answer beyond checking that it hasn't been reported broken.",
  },
  {
    title: "Tracing",
    body: "For a run that touched several systems and possibly an agent decision, tracing shows the order things actually happened in — useful for the runs that don't fail cleanly, just produce a result nobody expected.",
  },
];

export default function ObservabilityPage() {
  return (
    <>
      <SimplePage title="Observability" subtitle="Runs, retries, metrics, logs, and tracing." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {SIGNALS.map((s) => (
            <div key={s.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          Observability is what makes the rest of the{" "}
          <Link href="/platform" className="font-medium text-[#0f172a] underline underline-offset-2">
            platform
          </Link>{" "}
          trustworthy at scale — see the real numbers on{" "}
          <Link href="/workflowops/automation-analytics" className="font-medium text-[#0f172a] underline underline-offset-2">
            Automation Analytics
          </Link>
          .
        </p>
      </section>
    </>
  );
}
