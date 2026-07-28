"use client";

import { useState } from "react";
import { safePostJson } from "@/lib/public-api";

export default function ConnectorActions({ id }: { id: string }) {
  const [message, setMessage] = useState("");

  async function install() {
    setMessage("Starting install...");
    const res = await safePostJson(`/connectors/${id}/install`, {});
    setMessage(res?.ok ? `Install started for ${id}` : "Install failed");
  }

  async function auth() {
    setMessage("Starting auth...");
    const res = await safePostJson(`/connectors/${id}/auth/start`, {});
    setMessage(
      res?.ok
        ? `Auth started for ${id}. Redirect target: ${res.redirectUrl}`
        : "Auth start failed"
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-neutral-950">Connector Actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={install}
          className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
        >
          Start Install
        </button>
        <button
          onClick={auth}
          className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900"
        >
          Start Auth
        </button>
      </div>
      <div className="mt-4 text-sm text-neutral-600">{message}</div>
    </div>
  );
}
