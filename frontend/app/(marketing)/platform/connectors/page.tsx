import { safeGetJson } from "@/lib/public-api";

type Connector = {
  id: string;
  name: string;
  category?: string;
  status?: string;
  icon?: string | null;
};

type ConnectorsPayload = {
  connectors?: Connector[];
};

export const metadata = {
  title: "Connector Framework | ZyncoAI",
  description: "Browse real connectors available in the ZyncoAI platform.",
  alternates: { canonical: "/platform/connectors" },
};

export default async function PlatformConnectorsPage() {
  const data =
    (await safeGetJson<ConnectorsPayload>("/connectors/public")) ||
    (await safeGetJson<ConnectorsPayload>("/api/connectors/public")) ||
    { connectors: [] };

  const connectors = data.connectors || [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Platform</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">Connector Framework</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Live connector inventory from the platform&apos;s connector registry.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Total Connectors</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">{connectors.length}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Live</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">
            {connectors.filter((c) => c.status === "live").length}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Beta</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">
            {connectors.filter((c) => c.status === "beta").length}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Categories</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">
            {new Set(connectors.map((c) => c.category || "General")).size}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {connectors.map((connector) => (
          <div
            key={connector.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-neutral-950">{connector.name}</div>
                <div className="mt-1 text-sm text-neutral-500">{connector.category || "General"}</div>
              </div>
              <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {connector.status || "live"}
              </div>
            </div>

            <div className="mt-4 text-sm text-neutral-600">
              Connector ID: <span className="font-medium text-neutral-900">{connector.id}</span>
            </div>
          </div>
        ))}

        {!connectors.length && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-500">
            No connectors returned yet. Backend route is reachable, but connector data is empty.
          </div>
        )}
      </div>
    </main>
  );
}
