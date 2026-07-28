"use client";

import { useState } from "react";
import { safePostJson } from "@/lib/public-api";

export default function ExecutionActions({ id }: { id: string }) {
  const [message, setMessage] = useState("");

  async function retryRun() {
    setMessage("Retrying run...");
    const res = await safePostJson(`/executions/${id}/retry`, {});
    setMessage(res?.ok ? `Retry created: ${res.run?.id}` : "Retry failed");
  }

  async function cancelRun() {
    setMessage("Cancelling run...");
    const res = await safePostJson(`/executions/${id}/cancel`, {});
    setMessage(res?.ok ? `Run cancelled: ${res.run?.id}` : "Cancel failed");
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-neutral-950">Run Actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={retryRun}
          className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
        >
          Retry Run
        </button>
        <button
          onClick={cancelRun}
          className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900"
        >
          Cancel Run
        </button>
      </div>
      <div className="mt-4 text-sm text-neutral-600">{message}</div>
    </div>
  );
}
