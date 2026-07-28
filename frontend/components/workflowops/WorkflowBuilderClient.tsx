"use client";

import { useMemo, useState } from "react";
import { apiPost } from "@/lib/zynco-api";

type WorkflowNode = {
  id: string;
  type: string;
  label: string;
  config?: Record<string, any>;
};

const starterNodes: WorkflowNode[] = [
  {
    id: "step_1",
    type: "transform",
    label: "Prepare Payload",
    config: { mode: "summary" },
  },
  {
    id: "step_2",
    type: "delay",
    label: "Short Delay",
    config: { ms: 1000 },
  },
  {
    id: "step_3",
    type: "noop",
    label: "Finish",
    config: {},
  },
];

const nodePresets: Record<string, WorkflowNode> = {
  transform: {
    id: "step_new",
    type: "transform",
    label: "Transform Data",
    config: { mode: "summary" },
  },
  delay: {
    id: "step_new",
    type: "delay",
    label: "Delay",
    config: { ms: 1000 },
  },
  noop: {
    id: "step_new",
    type: "noop",
    label: "No-op",
    config: {},
  },
  http_request: {
    id: "step_new",
    type: "http_request",
    label: "HTTP Request",
    config: {
      method: "GET",
      url: "https://httpbin.org/get",
      headers: {},
      timeoutMs: 15000,
    },
  },
  condition: {
    id: "step_new",
    type: "condition",
    label: "Condition Check",
    config: {
      operator: "equals",
      left: "hello",
      right: "hello",
    },
  },
  slack_send_message: {
    id: "step_new",
    type: "slack_send_message",
    label: "Slack Message",
    config: {
      channel: "#general",
      text: "Hello from ZyncoAI runtime",
    },
  },
};

export default function WorkflowBuilderClient() {
  const [teamId, setTeamId] = useState("");
  const [name, setName] = useState("ZyncoAI Stage 4 Workflow");
  const [description, setDescription] = useState("Stage 4 workflow with richer node types");
  const [nodes, setNodes] = useState<WorkflowNode[]>(starterNodes);

  const [workflowId, setWorkflowId] = useState("");
  const [workflowSlug, setWorkflowSlug] = useState("");
  const [versionId, setVersionId] = useState("");

  const [runId, setRunId] = useState("");
  const [runStatus, setRunStatus] = useState("");
  const [steps, setSteps] = useState<any[]>([]);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const nodesJson = useMemo(() => JSON.stringify(nodes, null, 2), [nodes]);

  function addNode(type: string) {
    const preset = nodePresets[type];
    if (!preset) return;

    const nextId = `step_${nodes.length + 1}`;

    setNodes((prev) => [
      ...prev,
      {
        ...preset,
        id: nextId,
      },
    ]);
  }

  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  }

  function updateNode(id: string, patch: Partial<WorkflowNode>) {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n))
    );
  }

  function updateNodeConfig(id: string, raw: string) {
    try {
      const parsed = JSON.parse(raw);
      updateNode(id, { config: parsed });
      setMessage("");
    } catch {
      setMessage(`Invalid JSON config for ${id}`);
    }
  }

  async function createWorkflow() {
    setBusy(true);
    setMessage("Creating workflow...");

    try {
      const payload = {
        name,
        description,
        teamId: teamId || undefined,
        spec: {
          nodes,
          edges: [],
        },
      };

      const res: any = await apiPost("/api/workflowops/workflows", payload);

      setWorkflowId(res.workflow.id);
      setWorkflowSlug(res.workflow.slug);
      setVersionId(res.version.id);
      setMessage(`Workflow created: ${res.workflow.id}`);
    } catch (err: any) {
      setMessage(err?.message || "Failed to create workflow");
    } finally {
      setBusy(false);
    }
  }

  async function deployWorkflow() {
    if (!workflowId) {
      setMessage("Create workflow first.");
      return;
    }

    setBusy(true);
    setMessage("Deploying workflow...");

    try {
      const res: any = await apiPost(`/api/workflowops/workflows/${workflowId}/deploy`);
      setVersionId(res.version.id);
      setMessage(`Workflow deployed: ${res.version.id}`);
    } catch (err: any) {
      setMessage(err?.message || "Failed to deploy workflow");
    } finally {
      setBusy(false);
    }
  }

  async function runWorkflow() {
    if (!workflowId) {
      setMessage("Create workflow first.");
      return;
    }

    setBusy(true);
    setMessage("Starting workflow run...");

    try {
      const res: any = await apiPost(`/api/runtime/workflows/${workflowId}/runs`, {
        trigger: "builder-ui-stage4",
        input: {
          source: "stage4-builder",
          message: "hello from stage 4",
        },
      });

      setRunId(res.run.id);
      setRunStatus(res.run.status);
      await pollRun(res.run.id);
    } catch (err: any) {
      setMessage(err?.message || "Failed to run workflow");
    } finally {
      setBusy(false);
    }
  }

  async function pollRun(id: string) {
    for (let i = 0; i < 30; i++) {
      const runRes = await fetch(`/api/runtime/runs/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const runJson = await runRes.json();

      const stepsRes = await fetch(`/api/runtime/runs/${id}/steps`, {
        credentials: "include",
        cache: "no-store",
      });
      const stepsJson = await stepsRes.json();

      setRunStatus(runJson?.run?.status || "");
      setSteps(Array.isArray(stepsJson?.steps) ? stepsJson.steps : []);

      if (["SUCCEEDED", "FAILED", "CANCELLED"].includes(runJson?.run?.status)) {
        setMessage(`Run finished: ${runJson.run.status}`);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setMessage("Polling timeout reached.");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Workflow Builder</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Stage 4 builder with richer nodes, deploy, runtime execution, and live step inspection.
        </p>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-neutral-950/70 p-4 text-sm text-neutral-300">
          {message}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-3">
        {Object.keys(nodePresets).map((type) => (
          <button
            key={type}
            onClick={() => addNode(type)}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white"
          >
            Add {type}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="text-lg font-medium text-white">Workflow Details</h2>

            <div className="mt-4 grid gap-4">
              <input
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Optional team id"
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white"
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workflow name"
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white"
              />

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Workflow description"
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={createWorkflow}
                disabled={busy}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                onClick={deployWorkflow}
                disabled={busy || !workflowId}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Deploy
              </button>

              <button
                onClick={runWorkflow}
                disabled={busy || !workflowId}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 disabled:opacity-50"
              >
                Run Test
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="text-lg font-medium text-white">Node Editor</h2>

            <div className="mt-4 space-y-4">
              {nodes.map((node) => (
                <div key={node.id} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-white">{node.id}</div>
                      <div className="text-xs text-neutral-400">{node.type}</div>
                    </div>

                    <button
                      onClick={() => removeNode(node.id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    value={node.label}
                    onChange={(e) => updateNode(node.id, { label: e.target.value })}
                    className="mb-3 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  />

                  <textarea
                    defaultValue={JSON.stringify(node.config || {}, null, 2)}
                    rows={8}
                    onBlur={(e) => updateNodeConfig(node.id, e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-neutral-200"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="text-lg font-medium text-white">Generated Spec Preview</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-neutral-900 p-4 text-xs text-neutral-300">
{nodesJson}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="text-lg font-medium text-white">Workflow State</h2>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Workflow ID</div>
                <div className="mt-1 break-all text-white">{workflowId || "-"}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Slug</div>
                <div className="mt-1 break-all text-white">{workflowSlug || "-"}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Version ID</div>
                <div className="mt-1 break-all text-white">{versionId || "-"}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Run ID</div>
                <div className="mt-1 break-all text-white">{runId || "-"}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Run Status</div>
                <div className="mt-1 text-white">{runStatus || "-"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="text-lg font-medium text-white">Step Timeline</h2>

            <div className="mt-4 space-y-3">
              {steps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900 p-4 text-sm text-neutral-400">
                  No step activity yet.
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div key={`${step.stepId}-${idx}`} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-white">{step.stepId}</div>
                        <div className="text-xs text-neutral-400">{step.stepType}</div>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-200">
                        {step.status}
                      </div>
                    </div>

                    <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-neutral-300">
{JSON.stringify(step.output ?? step.error ?? step, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
