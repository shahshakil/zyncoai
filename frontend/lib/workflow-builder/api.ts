import type { WorkflowSpec } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.zyncoai.com";

export async function createWorkflow(payload: {
  name: string;
  description?: string;
  spec: WorkflowSpec;
}) {
  const res = await fetch(`${API_BASE}/api/workflowops/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return res.json();
}

export async function deployWorkflow(workflowId: string) {
  const res = await fetch(`${API_BASE}/api/workflowops/workflows/${workflowId}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return res.json();
}

export async function runWorkflow(workflowId: string) {
  const res = await fetch(`${API_BASE}/api/runtime/workflows/${workflowId}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: {} }),
    cache: "no-store",
  });

  return res.json();
}
