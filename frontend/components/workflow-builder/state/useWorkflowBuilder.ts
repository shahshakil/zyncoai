"use client";

import { useMemo, useState } from "react";
import { DEFAULT_TRIGGER_NODE, createNode } from "@/lib/workflow-builder/defaults";
import type {
  WorkflowBuilderState,
  WorkflowCanvasEdge,
  WorkflowCanvasNode,
  WorkflowNodeType,
} from "@/lib/workflow-builder/types";

export function useWorkflowBuilder() {
  const [state, setState] = useState<WorkflowBuilderState>({
    workflowId: null,
    name: "",
    description: "",
    nodes: [DEFAULT_TRIGGER_NODE],
    edges: [],
    selectedNodeId: DEFAULT_TRIGGER_NODE.id,
  });

  const selectedNode = useMemo(
    () => state.nodes.find((n) => n.id === state.selectedNodeId) || null,
    [state.nodes, state.selectedNodeId]
  );

  function setName(name: string) {
    setState((prev) => ({ ...prev, name }));
  }

  function setDescription(description: string) {
    setState((prev) => ({ ...prev, description }));
  }

  function setWorkflowId(workflowId: string | null) {
    setState((prev) => ({ ...prev, workflowId }));
  }

  function addNode(type: WorkflowNodeType) {
    setState((prev) => {
      const next = createNode(type, prev.nodes.length + 1);
      return {
        ...prev,
        nodes: [...prev.nodes, next],
        selectedNodeId: next.id,
      };
    });
  }

  function selectNode(nodeId: string) {
    setState((prev) => ({ ...prev, selectedNodeId: nodeId }));
  }

  function updateNodePosition(nodeId: string, x: number, y: number) {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, position: { x, y } } : n
      ),
    }));
  }

  function updateSelectedNodeConfig(patch: Record<string, any>) {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === prev.selectedNodeId
          ? {
              ...n,
              data: {
                ...n.data,
                config: {
                  ...(n.data.config || {}),
                  ...patch,
                },
              },
            }
          : n
      ),
    }));
  }

  function connectNodes(source: string, target: string, label?: string) {
    const edge: WorkflowCanvasEdge = {
      id: `edge-${source}-${target}-${Date.now()}`,
      source,
      target,
      label,
    };

    setState((prev) => ({
      ...prev,
      edges: [...prev.edges, edge],
    }));
  }

  function removeNode(nodeId: string) {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
    }));
  }

  function buildSpec() {
    return {
      nodes: state.nodes,
      edges: state.edges,
      settings: {
        mode: "draft",
        builderVersion: 1,
      },
    };
  }

  return {
    state,
    selectedNode,
    setName,
    setDescription,
    setWorkflowId,
    addNode,
    selectNode,
    updateNodePosition,
    updateSelectedNodeConfig,
    connectNodes,
    removeNode,
    buildSpec,
  };
}
