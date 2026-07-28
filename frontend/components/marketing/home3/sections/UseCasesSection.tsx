const CASES = [
  {
    title: "Sales operations",
    text: "Lead intake, qualification, routing, enrichment, CRM updates, and team notification workflows.",
  },
  {
    title: "Support automation",
    text: "Classify tickets, draft replies, escalate issues, tag priorities, and keep SLA paths cleaner.",
  },
  {
    title: "IT operations",
    text: "Run request workflows, approvals, onboarding tasks, environment updates, and internal execution paths.",
  },
  {
    title: "Finance ops",
    text: "Handle reminders, approval chains, follow-ups, reconciliation tasks, and structured workflow records.",
  },
  {
    title: "Reminders + scheduling",
    text: "Meeting reminders, no-show recovery, calendar actions, notifications, and operational follow-ups.",
  },
  {
    title: "Enterprise workflows",
    text: "Approval logic, audit logging, policy-aware execution, and controlled outcomes across teams.",
  },
];

export default function UseCasesSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            USE CASES
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Workflows that make sense immediately.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            The homepage should help buyers and users instantly imagine where ZyncoAI fits
            inside their real business operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CASES.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
            >
              <h3 className="text-xl font-bold text-zinc-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
