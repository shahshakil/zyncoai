import { safeGetJson } from "@/lib/public-api";

type Metric = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  note?: string;
};

type MarketingPayload = {
  metrics?: Metric[];
};

export const metadata = {
  title: "Marketing Teams | ZyncoAI",
  description: "Lead routing, campaign ops, reporting, and team automation.",
};

export default async function MarketingTeamsPage() {
  const data =
    (await safeGetJson<MarketingPayload>("/marketing/metrics")) ||
    (await safeGetJson<MarketingPayload>("/api/marketing/metrics")) ||
    { metrics: [] };

  const metrics = data.metrics || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Use Cases</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">Marketing Teams</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Real workflow patterns for lead routing, campaign operations, approvals, follow-up, reporting, and growth loops.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">What marketing teams can automate</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li>Lead capture to CRM sync</li>
            <li>Campaign handoff and sales routing</li>
            <li>Approval chains for ad assets</li>
            <li>Reminder flows for launches and renewals</li>
            <li>ROI reporting and alerting</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">Live platform signals</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {metrics.slice(0, 4).map((metric) => (
              <div key={metric.key} className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-sm text-neutral-500">{metric.label}</div>
                <div className="mt-2 text-2xl font-semibold text-neutral-950">
                  {metric.value}
                  {metric.suffix || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
