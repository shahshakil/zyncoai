"use client";

import { useState } from "react";
import WorkflowCanvas from "@/components/workflow-builder/canvas/WorkflowCanvas";
import WorkflowTopbar from "@/components/workflow-builder/canvas/WorkflowTopbar";
import InspectorPanel from "@/components/workflow-builder/panels/InspectorPanel";
import NodePalette from "@/components/workflow-builder/panels/NodePalette";
import { createWorkflow, deployWorkflow, runWorkflow } from "@/lib/workflow-builder/api";
import { useWorkflowBuilder } from "@/components/workflow-builder/state/useWorkflowBuilder";

export default function WorkflowBuilderStage3() {
  const builder = useWorkflowBuilder();
  const [status, setStatus] = useState("Ready.");

  async function handleSave() {
    if (!builder.state.name.trim()) {
      setStatus("Workflow name is required.");
      return;
    }

    setStatus("Saving workflow draft...");

    const res = await createWorkflow({
      name: builder.state.name,
      description: builder.state.description,
      spec: builder.buildSpec(),
    });

    if (!res?.ok) {
      setStatus("Failed to save workflow draft.");
      return;
    }

    builder.setWorkflowId(res.workflow?.id || null);
    setStatus(`Workflow saved: ${res.workflow?.id || "ok"}`);
  }

  async function handleDeploy() {
    if (!builder.state.workflowId) {
      setStatus("Save workflow first.");
      return;
    }

    setStatus("Deploying workflow...");

    const res = await deployWorkflow(builder.state.workflowId);

    if (!res?.ok) {
      setStatus("Failed to deploy workflow.");
      return;
    }

    setStatus(`Workflow deployed: ${builder.state.workflowId}`);
  }

  async function handleRun() {
    if (!builder.state.workflowId) {
      setStatus("Save and deploy workflow first.");
      return;
    }

    setStatus("Running workflow test...");

    const res = await runWorkflow(builder.state.workflowId);

    if (!res?.ok) {
      setStatus("Failed to run workflow.");
      return;
    }

    setStatus(`Workflow run queued: ${res.run?.id || "ok"}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">WorkflowOps</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          Visual Workflow Canvas
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Build AI-native workflow systems visually with drag-ready nodes, execution graph foundations,
          deploy actions, and real runtime test execution for ZyncoAI.
        </p>
      </div>

      <div className="grid gap-6">
        <WorkflowTopbar
          name={builder.state.name}
          description={builder.state.description}
          onNameChange={builder.setName}
          onDescriptionChange={builder.setDescription}
          onSave={handleSave}
          onDeploy={handleDeploy}
          onRun={handleRun}
          status={status}
        />

        <div className="grid gap-6 xl:grid-cols-[280px_1fr_320px]">
          <NodePalette onAdd={builder.addNode} />

          <WorkflowCanvas
            nodes={builder.state.nodes}
            edges={builder.state.edges}
            selectedNodeId={builder.state.selectedNodeId}
            onSelectNode={builder.selectNode}
          />

          <InspectorPanel
            node={builder.selectedNode}
            onPatchConfig={builder.updateSelectedNodeConfig}
          />
        </div>
      </div>
    </main>
  );
}
