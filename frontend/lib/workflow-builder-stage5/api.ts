const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.zyncoai.com";

export async function createWorkflowDraft(payload: {
  name: string;
  description?: string;
  spec: any;
}) {
  const res = await fetch(`${API_BASE}/api/workflowops/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deployWorkflowDraft(workflowId: string) {
  const res = await fetch(`${API_BASE}/api/workflowops/workflows/${workflowId}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

export async function runWorkflowTest(workflowId: string) {
  const res = await fetch(`${API_BASE}/api/runtime/workflows/${workflowId}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ input: {} }),
  });
  return res.json();
}

export async function getRunSteps(runId: string) {
  const res = await fetch(`${API_BASE}/api/runtime/runs/${runId}/steps`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function retryRun(runId: string) {
  const res = await fetch(`${API_BASE}/api/runtime/runs/${runId}/retry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

export async function cancelRun(runId: string) {
  const res = await fetch(`${API_BASE}/api/runtime/runs/${runId}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}
