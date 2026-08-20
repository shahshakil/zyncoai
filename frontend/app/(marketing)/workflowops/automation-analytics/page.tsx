import { safeGetJson } from "@/lib/public-api";

type Metric = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  note?: string;
};

type MetricsPayload = {
  metrics?: Metric[];
};

export const metadata = {
  title: "Automation Analytics",
  description: "Track workflow volume, reliability, time savings, and auto-recovery.",
  alternates: { canonical: "/workflowops/automation-analytics" },
};

export default async function AutomationAnalyticsPage() {
  const data =
    (await safeGetJson<MetricsPayload>("/marketing/metrics")) ||
    (await safeGetJson<MetricsPayload>("/api/marketing/metrics")) ||
    { metrics: [] };

  const metrics = data.metrics || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">WorkflowOps</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">Automation Analytics</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Outcome tracking for workflow execution, time savings, and reliability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="text-sm text-neutral-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {metric.value}
              {metric.suffix || ""}
            </div>
            <div className="mt-2 text-sm text-neutral-600">{metric.note || ""}</div>
          </div>
        ))}

        {!metrics.length && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-500">
            Metrics route is not returning values yet.
          </div>
        )}
      </div>
    </main>
  );
}
