"use client";

export default function RunControlPanel({
  runId,
  onRetry,
  onCancel,
}: {
  runId: string | null;
  onRetry: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">Run Controls</h3>
      <div className="mt-3 text-sm text-neutral-500">
        Current Run: {runId || "No run yet"}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900"
        >
          Retry Run
        </button>
        <button
          onClick={onCancel}
          className="rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-900"
        >
          Cancel Run
        </button>
      </div>
    </div>
  );
}
