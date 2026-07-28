"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/zynco-api";

type SummaryResponse = {
  ok: boolean;
  summary: {
    total: number;
    running: number;
    succeeded: number;
    failed: number;
  };
};

type RecentResponse = {
  ok: boolean;
  runs: Array<{
    id: string;
    workflowId: string;
    status: string;
    createdAt: string;
    startedAt?: string | null;
    endedAt?: string | null;
    meta?: any;
  }>;
};

type DetailResponse = {
  ok: boolean;
  run: any;
};

type StepResponse = {
  ok: boolean;
  runId: string;
  steps: any[];
};

export default function ExecutionsClient() {
  const [summary, setSummary] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [selectedSteps, setSelectedSteps] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    try {
      const [summaryRes, recentRes] = await Promise.all([
        apiGet<SummaryResponse>("/api/executions/summary"),
        apiGet<RecentResponse>("/api/executions/recent?limit=30"),
      ]);

      setSummary(summaryRes.summary);
      setRuns(recentRes.runs || []);
    } catch (err: any) {
      setMessage(err?.message || "Failed to load executions");
    }
  }

  async function loadRun(runId: string) {
    try {
      setSelectedRunId(runId);

      const [detail, steps] = await Promise.all([
        apiGet<DetailResponse>(`/api/executions/${runId}`),
        apiGet<StepResponse>(`/api/runtime/runs/${runId}/steps`),
      ]);

      setSelectedRun(detail.run);
      setSelectedSteps(steps.steps || []);
    } catch (err: any) {
      setMessage(err?.message || "Failed to load run detail");
    }
  }

  async function retryRun(runId: string) {
    try {
      await apiPost(`/api/runtime/runs/${runId}/retry`, {});
      setMessage(`Retry queued for ${runId}`);
      await loadDashboard();
    } catch (err: any) {
      setMessage(err?.message || "Failed to retry run");
    }
  }

  async function cancelRun(runId: string) {
    try {
      await apiPost(`/api/runtime/runs/${runId}/cancel`, {});
      setMessage(`Cancel requested for ${runId}`);
      await loadDashboard();
      if (selectedRunId === runId) {
        await loadRun(runId);
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to cancel run");
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Executions</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Live execution dashboard wired to workflow run summary, detail, retry, cancel, and step timeline.
        </p>
      </div>

      {summary && (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {[
            ["Total", summary.total],
            ["Running", summary.running],
            ["Succeeded", summary.succeeded],
            ["Failed", summary.failed],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
              <div className="mt-2 text-3xl font-semibold text-white">{String(value)}</div>
            </div>
          ))}
        </div>
      )}

      {message ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-neutral-300">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Recent Runs</h2>
            <button
              onClick={() => void loadDashboard()}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3">
            {runs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900 p-4 text-sm text-neutral-400">
                No executions yet.
              </div>
            ) : (
              runs.map((run) => (
                <div
                  key={run.id}
                  className="rounded-xl border border-white/10 bg-neutral-900 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{run.id}</div>
                      <div className="mt-1 text-xs text-neutral-400">Workflow: {run.workflowId}</div>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-200">
                      {run.status}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-neutral-400">
                    Created: {run.createdAt}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => void loadRun(run.id)}
                      className="rounded-xl border border-white/20 px-3 py-2 text-xs text-white"
                    >
                      View Detail
                    </button>

                    <button
                      onClick={() => void retryRun(run.id)}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
                    >
                      Retry
                    </button>

                    <button
                      onClick={() => void cancelRun(run.id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
          <h2 className="text-lg font-medium text-white">Run Detail</h2>

          {!selectedRun ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-neutral-900 p-4 text-sm text-neutral-400">
              Select a run to inspect output and step activity.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Run Status</div>
                <div className="mt-1 text-white">{selectedRun.status}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Run Meta</div>
                <pre className="mt-3 overflow-x-auto text-xs text-neutral-300">
{JSON.stringify(selectedRun.meta ?? {}, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Step Timeline</div>
                <div className="mt-3 space-y-3">
                  {selectedSteps.map((step, idx) => (
                    <div key={`${step.stepId}-${idx}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-white">{step.stepId}</div>
                        <div className="text-xs text-neutral-300">{step.status}</div>
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">{step.stepType}</div>
                      <pre className="mt-2 overflow-x-auto text-xs text-neutral-300">
{JSON.stringify(step.output ?? step.error ?? step, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
