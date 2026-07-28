export type WorkflowBuilderStage4Workflow = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type WorkflowBuilderStage4Run = {
  id: string;
  workflowId: string;
  status: string;
  startedAt?: string | null;
  finishedAt?: string | null;
};

async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function listWorkflows(): Promise<WorkflowBuilderStage4Workflow[]> {
  const res = await fetch("/api/workflowops/workflows", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await safeJson<any>(res);
  return Array.isArray(data) ? data : (data?.items ?? data?.workflows ?? []);
}

export async function deployWorkflow(id: string): Promise<any> {
  const res = await fetch(`/api/workflowops/workflows/${id}/deploy`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return safeJson(res);
}

export async function listWorkflowRuns(workflowId: string): Promise<WorkflowBuilderStage4Run[]> {
  const res = await fetch(`/api/runtime/workflows/${workflowId}/runs`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await safeJson<any>(res);
  return Array.isArray(data) ? data : (data?.items ?? data?.runs ?? []);
}

export async function getRun(runId: string): Promise<any> {
  const res = await fetch(`/api/runtime/runs/${runId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return safeJson(res);
}

export async function listRunSteps(runId: string): Promise<any[]> {
  const res = await fetch(`/api/runtime/runs/${runId}/steps`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await safeJson<any>(res);
  return Array.isArray(data) ? data : (data?.items ?? data?.steps ?? []);
}
