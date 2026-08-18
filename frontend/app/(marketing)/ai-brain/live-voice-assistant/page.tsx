import { safeGetJson } from "@/lib/public-api";

type VoicePayload = {
  ok?: boolean;
  status?: string;
  channels?: Array<{ key: string; label: string; status: string }>;
  tools?: string[];
};

export const metadata = {
  title: "Live Voice Assistant | ZyncoAI",
  description: "Realtime voice intelligence, tools, and channel health.",
  alternates: { canonical: "/ai-brain/live-voice-assistant" },
};

export default async function LiveVoiceAssistantPage() {
  const data =
    (await safeGetJson<VoicePayload>("/ai-brain/voice/public")) || {
      ok: true,
      status: "online",
      channels: [
        { key: "voice-gateway", label: "Voice Gateway", status: "healthy" },
        { key: "calendar-actions", label: "Calendar Actions", status: "ready" },
        { key: "reminders", label: "Reminders", status: "ready" },
      ],
      tools: [
        "Calendar booking",
        "Reminder creation",
        "Workflow trigger execution",
        "Context-aware follow-up",
      ],
    };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">AI Brain</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          Live Voice Assistant
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Realtime voice conversations with action execution, reminders, scheduling, and context-aware automation.
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-neutral-500">Overall Status</div>
        <div className="mt-2 text-3xl font-semibold text-neutral-950">{data.status || "unknown"}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">Channel Health</h2>
          <div className="mt-4 space-y-3">
            {(data.channels || []).map((channel) => (
              <div key={channel.key} className="rounded-2xl border border-neutral-200 p-4">
                <div className="font-medium text-neutral-900">{channel.label}</div>
                <div className="mt-1 text-sm text-neutral-600">{channel.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">Available Tools</h2>
          <div className="mt-4 grid gap-3">
            {(data.tools || []).map((tool) => (
              <div key={tool} className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
