import ExecutionsClient from "@/components/executions/ExecutionsClient";
import { safeGetJson } from "@/lib/public-api";

type ExecutionRow = {
  id: string;
  workflowId?: string | null;
  status: string;
  createdAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
};

type ExecutionsPayload = {
  ok?: boolean;
  summary?: {
    total: number;
    running: number;
    succeeded: number;
    failed: number;
  };
  runs?: ExecutionRow[];
};

export const metadata = {
  title: "Executions | ZyncoAI",
  description: "Monitor workflow runs, status, timing, and operational reliability.",
};

export default async function ExecutionsPage() {
  const data =
    (await safeGetJson<ExecutionsPayload>("/executions/public")) || {
      ok: true,
      summary: { total: 0, running: 0, succeeded: 0, failed: 0 },
      runs: [],
    };

  const summary = data.summary || { total: 0, running: 0, succeeded: 0, failed: 0 };
  const runs = data.runs || [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Operations</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">Executions</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Live execution visibility for workflow runs, outcomes, timing, and platform reliability.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Total</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">{summary.total}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Running</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">{summary.running}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Succeeded</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">{summary.succeeded}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Failed</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-950">{summary.failed}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-950">Recent Runs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3">Run ID</th>
                <th className="px-6 py-3">Workflow</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Ended</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-t border-neutral-100">
                  <td className="px-6 py-4 font-medium text-neutral-900">{run.id}</td>
                  <td className="px-6 py-4 text-neutral-600">{run.workflowId || "-"}</td>
                  <td className="px-6 py-4 text-neutral-600">{run.status}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {new Date(run.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {run.startedAt ? new Date(run.startedAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {run.endedAt ? new Date(run.endedAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}

              {!runs.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    No workflow runs returned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
