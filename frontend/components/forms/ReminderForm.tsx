"use client";

import { useState } from "react";
import { safePostJson } from "@/lib/public-api";

export default function ReminderForm() {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [channel, setChannel] = useState("app");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    setMessage("Creating reminder...");

    const res = await safePostJson("/ai-brain/reminders", {
      title,
      remindAt,
      channel,
      note,
    });

    if (!res?.ok) {
      setMessage("Failed to create reminder");
      return;
    }

    setMessage(`Reminder created: ${res.reminder?.id || "ok"}`);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-neutral-950">Create Reminder</h2>

      <div className="mt-5 grid gap-4">
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
        />

        <select
          className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="app">App</option>
          <option value="email">Email</option>
          <option value="push">Push</option>
        </select>

        <textarea
          className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={submit}
          className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
        >
          Create Reminder
        </button>

        <div className="text-sm text-neutral-600">{message}</div>
      </div>
    </div>
  );
}
