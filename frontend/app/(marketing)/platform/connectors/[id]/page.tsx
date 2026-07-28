import ConnectorDetailClient from "@/components/connectors/ConnectorDetailClient";
import { safeGetJson } from "@/lib/public-api";

type ConnectorDetailPayload = {
  ok?: boolean;
  connector?: {
    id: string;
    name: string;
    category?: string;
    status?: string;
    authType?: string;
    installationStatus?: string;
    health?: string;
    logs?: Array<{
      at: string;
      level: string;
      message: string;
    }>;
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `${id} Connector | ZyncoAI`,
    description: `Connector detail for ${id} in ZyncoAI.`,
  };
}

export default async function ConnectorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data =
    (await safeGetJson<ConnectorDetailPayload>(`/connectors/public/${id}`)) || {
      ok: true,
      connector: {
        id,
        name: id,
        category: "General",
        status: "live",
        authType: "oauth2",
        installationStatus: "ready",
        health: "healthy",
        logs: [],
      },
    };

  const connector = data.connector;

  if (!connector) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-neutral-950">Connector not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Platform</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          {connector.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Auth status, install state, connector health, and operational visibility.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Category</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{connector.category || "General"}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Status</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{connector.status || "live"}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Auth Type</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{connector.authType || "-"}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Health</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{connector.health || "-"}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-950">Recent Connector Logs</h2>
        <div className="mt-4 space-y-3">
          {(connector.logs || []).map((log, i) => (
            <div key={`${log.at}-${i}`} className="rounded-2xl border border-neutral-200 p-4">
              <div className="text-xs text-neutral-500">{new Date(log.at).toLocaleString()}</div>
              <div className="mt-1 text-sm font-medium text-neutral-900">{log.level}</div>
              <div className="mt-1 text-sm text-neutral-600">{log.message}</div>
            </div>
          ))}

          {!(connector.logs || []).length && (
            <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-500">
              No connector logs returned yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
