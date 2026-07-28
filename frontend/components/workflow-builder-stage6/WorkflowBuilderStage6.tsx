"use client";

import { useMemo, useState } from "react";
import type { Connection, Edge, NodeChange, EdgeChange } from "reactflow";
import ReactFlowCanvas, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@/components/workflow-builder-stage4/canvas/ReactFlowCanvas";
import BuilderTopbar from "@/components/workflow-builder-stage4/canvas/BuilderTopbar";
import NodePalette from "@/components/workflow-builder-stage6/panels/NodePalette";
import InspectorPanel from "@/components/workflow-builder-stage6/panels/InspectorPanel";
import ExecutionTimeline from "@/components/workflow-builder-stage4/panels/ExecutionTimeline";
import RunControlPanel from "@/components/workflow-builder-stage5/panels/RunControlPanel";
import { makeNode, toWorkflowSpec } from "@/lib/workflow-builder-stage6/nodeFactory";
import {
  createWorkflowDraft,
  deployWorkflowDraft,
  runWorkflowTest,
  getRunSteps,
  retryRun,
  cancelRun,
} from "@/lib/workflow-builder-stage5/api";
import type { BuilderNodeKind } from "@/lib/workflow-builder-stage6/types";

export default function WorkflowBuilderStage6() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready.");
  const [steps, setSteps] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([
    makeNode("trigger.manual", 0),
  ]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  function addNodeToCanvas(type: BuilderNodeKind) {
    const next = makeNode(type, nodes.length + 1);
    setNodes((prev) => [...prev, next]);
    setSelectedNodeId(next.id);
  }

  function onNodesChange(changes: NodeChange[]) {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }

  function onEdgesChange(changes: EdgeChange[]) {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }

  function onConnect(connection: Connection | Edge) {
    setEdges((eds) => addEdge(connection, eds));
  }

  function patchSelectedNodeConfig(patch: Record<string, any>) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...(node.data?.config || {}),
                  ...patch,
                },
              },
            }
          : node
      )
    );
  }

  async function saveDraft() {
    if (!name.trim()) {
      setStatus("Workflow name is required.");
      return;
    }

    setStatus("Saving workflow draft...");

    const spec = toWorkflowSpec(nodes, edges);
    const res = await createWorkflowDraft({ name, description, spec });

    if (!res?.ok) {
      setStatus("Failed to save workflow draft.");
      return;
    }

    setWorkflowId(res.workflow?.id || null);
    setStatus(`Workflow saved: ${res.workflow?.id || "ok"}`);
  }

  async function deployDraft() {
    if (!workflowId) {
      setStatus("Save workflow first.");
      return;
    }

    setStatus("Deploying workflow...");
    const res = await deployWorkflowDraft(workflowId);

    if (!res?.ok) {
      setStatus("Failed to deploy workflow.");
      return;
    }

    setStatus(`Workflow deployed: ${workflowId}`);
  }

  async function loadSteps(currentRunId: string) {
    const stepRes = await getRunSteps(currentRunId);
    if (stepRes?.steps) {
      setSteps(stepRes.steps);
    }
  }

  async function runTest() {
    if (!workflowId) {
      setStatus("Save and deploy workflow first.");
      return;
    }

    setStatus("Running workflow test...");
    const res = await runWorkflowTest(workflowId);

    if (!res?.ok) {
      setStatus("Failed to start workflow run.");
      return;
    }

    const newRunId = res.run?.id || null;
    setRunId(newRunId);
    setStatus(`Workflow run queued: ${newRunId || "ok"}`);

    if (newRunId) {
      setTimeout(() => loadSteps(newRunId), 2500);
    }
  }

  async function handleRetry() {
    if (!runId) {
      setStatus("No run available to retry.");
      return;
    }

    setStatus("Retrying run...");
    const res = await retryRun(runId);

    if (!res?.ok) {
      setStatus("Retry failed.");
      return;
    }

    setStatus(`Retry queued for run: ${runId}`);
  }

  async function handleCancel() {
    if (!runId) {
      setStatus("No run available to cancel.");
      return;
    }

    setStatus("Cancelling run...");
    const res = await cancelRun(runId);

    if (!res?.ok) {
      setStatus("Cancel failed.");
      return;
    }

    setStatus(`Run cancelled: ${runId}`);
  }

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">WorkflowOps Stage 6</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          AI Agent + Logic Orchestration Builder
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-600">
          Build AI-native orchestrations with agents, approvals, loops, parallel branches, and enterprise execution control.
        </p>
      </div>

      <div className="grid gap-6">
        <BuilderTopbar
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSave={saveDraft}
          onDeploy={deployDraft}
          onRun={runTest}
          status={status}
        />

        <div className="grid gap-6 xl:grid-cols-[260px_1fr_340px]">
          <NodePalette onAddNode={addNodeToCanvas} />

          <ReactFlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(node) => setSelectedNodeId(node.id)}
          />

          <div className="grid gap-6">
            <InspectorPanel node={selectedNode} onPatch={patchSelectedNodeConfig} />
            <RunControlPanel runId={runId} onRetry={handleRetry} onCancel={handleCancel} />
            <ExecutionTimeline steps={steps} />
          </div>
        </div>
      </div>
    </main>
  );
}
