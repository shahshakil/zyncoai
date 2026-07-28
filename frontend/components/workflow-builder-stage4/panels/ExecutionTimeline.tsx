"use client";

export default function ExecutionTimeline({
  steps,
}: {
  steps: any[];
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">Execution Timeline</h3>
      <div className="mt-4 grid gap-3">
        {steps.length === 0 ? (
          <div className="text-sm text-neutral-500">No execution steps yet.</div>
        ) : (
          steps.map((step, idx) => (
            <div key={`${step.nodeId || idx}-${idx}`} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                {step.nodeType || "step"}
              </div>
              <div className="mt-2 text-sm font-semibold text-neutral-950">
                {step.nodeId || `step-${idx + 1}`}
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                {step.executedAt || "No timestamp"}
              </div>
              <pre className="mt-3 overflow-auto rounded-xl bg-neutral-950 p-3 text-xs text-neutral-100">
{JSON.stringify(step.result || step, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
