"use client";

import { useState } from "react";
import { safePostJson } from "@/lib/public-api";

export default function WorkflowBuilderForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  async function handleCreate() {
    setMessage("Creating workflow draft...");
    const res = await safePostJson("/api/workflowops/workflows", {
      name,
      description,
      spec: {
        nodes: [],
        edges: [],
        settings: { mode: "draft" },
      },
    });

    if (!res?.ok) {
      setMessage("Failed to create workflow.");
      return;
    }

    setWorkflowId(res.workflow?.id || null);
    setMessage(`Workflow created: ${res.workflow?.id || "ok"}`);
  }

  async function handleDeploy() {
    if (!workflowId) {
      setMessage("Create workflow first.");
      return;
    }

    setMessage("Deploying workflow...");
    const res = await safePostJson(`/api/workflowops/workflows/${workflowId}/deploy`, {});

    if (!res?.ok) {
      setMessage("Failed to deploy workflow.");
      return;
    }

    setMessage(`Workflow deployed: ${workflowId}`);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-neutral-950">Create Workflow Draft</h2>

      <div className="mt-5 grid gap-4">
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          placeholder="Workflow name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3 outline-none"
          placeholder="Describe what this workflow should do"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreate}
            className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
          >
            Create Draft
          </button>

          <button
            onClick={handleDeploy}
            className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900"
          >
            Deploy Latest Version
          </button>
        </div>

        <div className="text-sm text-neutral-600">{message}</div>
        {workflowId && <div className="text-sm text-neutral-500">Workflow ID: {workflowId}</div>}
      </div>
    </div>
  );
}
