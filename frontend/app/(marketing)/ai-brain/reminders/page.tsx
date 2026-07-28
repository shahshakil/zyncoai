import { safeGetJson } from "@/lib/public-api";

type ReminderMetric = {
  label: string;
  value: number;
  note?: string;
};

type ReminderPayload = {
  ok?: boolean;
  items?: ReminderMetric[];
  features?: string[];
};

export const metadata = {
  title: "Smart Reminders & Appointments | ZyncoAI",
  description: "Calendar, email, app notifications, and reminder intelligence.",
};

export default async function AiBrainRemindersPage() {
  const data =
    (await safeGetJson<ReminderPayload>("/ai-brain/reminders/public")) ||
    (await safeGetJson<ReminderPayload>("/api/ai-brain/reminders/public")) ||
    {
      ok: true,
      items: [
        { label: "Reminder channels", value: 3, note: "email, app, calendar" },
        { label: "Scheduling status", value: 1, note: "enabled" },
        { label: "Automation depth", value: 4, note: "alerts, appointments, follow-ups, escalations" },
      ],
      features: [
        "Doctor appointment reminders",
        "Meeting follow-up reminders",
        "Calendar-linked prompts",
        "Pre-event notifications",
        "Missed task escalation",
      ],
    };

  const items = data.items || [];
  const features = data.features || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">AI Brain</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">Smart Reminders & Appointments</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Real reminder intelligence across calendar, email, app notifications, and assistant workflows.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-neutral-500">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold text-neutral-950">{item.value}</div>
            <div className="mt-2 text-sm text-neutral-600">{item.note || ""}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-950">Reminder capabilities</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
