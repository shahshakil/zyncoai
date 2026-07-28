const Item = ({ title }: { title: string }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm">
    {title}
  </div>
);

export default function UseCasesGrid() {
  const items = [
    "Resolve IT tickets",
    "Onboard employees",
    "Assist customers",
    "Answer FAQs",
    "Lead routing",
    "Summarize emails",
    "Generate reports",
    "Security evidence export",
    "Compliance monitoring",
    "Finance automation",
    "CRM pipeline updates",
    "Slack + Google workflows",
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Use cases
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
              Real teams, real automation outcomes
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Start with templates, then move to governed automation. ZyncoAI is designed
              for production—where auditability, controls, and uptime matter.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((t) => (
                <Item key={t} title={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
