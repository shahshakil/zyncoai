"use client";

import { useMarketingHome } from "@/components/marketing/home3/lib/useMarketingHome";

function ConnectorPill({
  name,
  category,
  status,
}: {
  name: string;
  category?: string;
  status?: string;
}) {
  return (
    <div className="flex min-w-[150px] items-center justify-between rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-zinc-900">{name}</div>
        <div className="text-xs text-zinc-500">{category ?? "Connector"}</div>
      </div>
      <div
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          status === "beta"
            ? "bg-amber-100 text-amber-700"
            : status === "coming_soon"
            ? "bg-zinc-100 text-zinc-500"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {status === "coming_soon" ? "soon" : status ?? "live"}
      </div>
    </div>
  );
}

export default function ConnectorsCloud() {
  const { data, loading } = useMarketingHome();
  const connectors = data?.connectors ?? [];

  const firstRow = connectors.slice(0, Math.ceil(connectors.length / 2));
  const secondRow = connectors.slice(Math.ceil(connectors.length / 2));

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[34px] border border-zinc-200 bg-[#fbfaf8] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.05)] md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                CONNECTORS CLOUD
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
                Your tools. One orchestration layer.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
                Connectors are the surface area of power. ZyncoAI links apps, data,
                reminders, and actions into one execution fabric.
              </p>

              <div className="mt-6 rounded-[26px] border border-zinc-200 bg-white p-5">
                <div className="text-sm font-semibold text-zinc-900">
                  Connector framework
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Ship integrations with guardrails, retries, observability, queue-backed
                  execution, and cleaner operational control.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li>• retry + backoff patterns</li>
                  <li>• rate limiting + isolation</li>
                  <li>• secrets handling discipline</li>
                  <li>• audit logging + safer outputs</li>
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-4">
              {loading ? (
                <div className="h-[260px] animate-pulse rounded-[20px] bg-zinc-100" />
              ) : (
                <div className="space-y-4">
                  <div className="overflow-hidden">
                    <div className="flex min-w-max animate-[marquee_26s_linear_infinite] gap-3">
                      {[...firstRow, ...firstRow].map((connector, i) => (
                        <ConnectorPill
                          key={`${connector.id}-${i}`}
                          name={connector.name}
                          category={connector.category}
                          status={connector.status}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex min-w-max animate-[marqueeReverse_30s_linear_infinite] gap-3">
                      {[...secondRow, ...secondRow].map((connector, i) => (
                        <ConnectorPill
                          key={`${connector.id}-b-${i}`}
                          name={connector.name}
                          category={connector.category}
                          status={connector.status}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marqueeReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
