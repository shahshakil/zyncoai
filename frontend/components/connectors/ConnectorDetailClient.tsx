"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/zynco-api";

type ConnectorDetail = {
  id: string;
  name: string;
  slug: string;
  authType: string;
  category: string;
  description: string;
  status: string;
  installed: boolean;
  enabled: boolean;
  capabilities: string[];
  installStatus: string;
  connectionId: string | null;
  teamId: string | null;
  connectedAt: string | null;
  updatedAt: string | null;
  metadata: Record<string, any>;
  health: {
    status: string;
    checkedAt: string;
    lastSyncAt: string | null;
    authValid: boolean;
  };
};

export default function ConnectorDetailClient({ connectorId }: { connectorId: string }) {
  const [connector, setConnector] = useState<ConnectorDetail | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadConnector() {
    try {
      const res = await apiGet<{ ok: boolean; connector: ConnectorDetail }>(
        `/api/connectors/${connectorId}/detail`
      );
      setConnector(res.connector);
    } catch (err: any) {
      setMessage(err?.message || "Failed to load connector detail");
    }
  }

  async function startAuth() {
    try {
      setBusy(true);
      const res = await apiPost<any>(`/api/connectors/${connectorId}/auth/start`, {});
      setMessage(res?.message || `Auth started for ${connectorId}`);
      await loadConnector();
    } catch (err: any) {
      setMessage(err?.message || "Failed to start auth");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void loadConnector();
  }, [connectorId]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Connector: {connector?.name || connectorId}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Live connector detail page for auth, install state, health, and capability inspection.
        </p>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-neutral-300">
          {message}
        </div>
      ) : null}

      {!connector ? (
        <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5 text-neutral-300">
          Loading connector detail...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-medium text-white">Connector Overview</h2>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Name</div>
                  <div className="mt-1 text-white">{connector.name}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Category</div>
                  <div className="mt-1 text-white">{connector.category}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Auth Type</div>
                  <div className="mt-1 text-white">{connector.authType}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Install Status</div>
                  <div className="mt-1 text-white">{connector.installStatus}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Health</div>
                  <div className="mt-1 text-white">{connector.health.status}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">Description</div>
                  <div className="mt-1 text-white">{connector.description}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => void startAuth()}
                  disabled={busy}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
                >
                  Start Auth
                </button>

                <button
                  onClick={() => void loadConnector()}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white"
                >
                  Refresh Detail
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-medium text-white">Capabilities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {connector.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-xs text-neutral-200"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-medium text-white">Connection State</h2>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-neutral-900 p-4 text-xs text-neutral-300">
{JSON.stringify(
  {
    installed: connector.installed,
    enabled: connector.enabled,
    connectionId: connector.connectionId,
    teamId: connector.teamId,
    connectedAt: connector.connectedAt,
    updatedAt: connector.updatedAt,
  },
  null,
  2
)}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-medium text-white">Health Payload</h2>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-neutral-900 p-4 text-xs text-neutral-300">
{JSON.stringify(connector.health, null, 2)}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-medium text-white">Metadata</h2>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-neutral-900 p-4 text-xs text-neutral-300">
{JSON.stringify(connector.metadata || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
