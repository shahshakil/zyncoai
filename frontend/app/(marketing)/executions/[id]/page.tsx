import { safeGetJson } from "@/lib/public-api";
import ExecutionActions from "@/components/forms/ExecutionActions";

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await safeGetJson<any>(`/executions/${id}/public`);
  const run = data?.run;

  if (!run) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-neutral-950">Run not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Execution Detail</p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">{run.id}</h1>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Status</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{run.status}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Workflow</div>
          <div className="mt-2 text-xl font-semibold text-neutral-950">{run.workflowId}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-neutral-500">Created</div>
          <div className="mt-2 text-sm text-neutral-700">
            {new Date(run.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-950">Run Payload</h2>
        <pre className="mt-4 overflow-auto rounded-2xl bg-neutral-950 p-4 text-xs text-white">
          {JSON.stringify(run, null, 2)}
        </pre>
      </div>

      <ExecutionActions id={id} />
    </main>
  );
}
