import type { WorkflowBuilderNode, BuilderNodeKind } from "./types";

export function makeNode(type: BuilderNodeKind, index: number): WorkflowBuilderNode {
  const basePosition = { x: 150 + index * 40, y: 120 + index * 40 };

  switch (type) {
    case "trigger.manual":
      return {
        id: `trigger-${Date.now()}-${index}`,
        type: "zyncoNode",
        position: basePosition,
        data: {
          label: "Manual Trigger",
          description: "Starts the workflow manually.",
          config: { trigger: "manual", nodeType: "trigger.manual" },
        },
      };

    case "core.http":
      return {
        id: `http-${Date.now()}-${index}`,
        type: "zyncoNode",
        position: basePosition,
        data: {
          label: "HTTP Request",
          description: "Call external APIs or webhooks.",
          config: {
            nodeType: "core.http",
            method: "GET",
            url: "",
            headers: {},
            body: "",
          },
        },
      };

    case "core.condition":
      return {
        id: `condition-${Date.now()}-${index}`,
        type: "zyncoNode",
        position: basePosition,
        data: {
          label: "Condition",
          description: "Branch based on rules.",
          config: {
            nodeType: "core.condition",
            left: "",
            operator: "equals",
            right: "",
          },
        },
      };

    case "core.delay":
      return {
        id: `delay-${Date.now()}-${index}`,
        type: "zyncoNode",
        position: basePosition,
        data: {
          label: "Delay",
          description: "Pause before next step.",
          config: {
            nodeType: "core.delay",
            amount: 5,
            unit: "seconds",
          },
        },
      };

    case "core.action":
    default:
      return {
        id: `action-${Date.now()}-${index}`,
        type: "zyncoNode",
        position: basePosition,
        data: {
          label: "Action",
          description: "Generic business action.",
          config: {
            nodeType: "core.action",
            actionName: "",
            payload: {},
          },
        },
      };
  }
}

export function toWorkflowSpec(nodes: WorkflowBuilderNode[], edges: any[]) {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data?.config?.nodeType || "core.action",
      position: node.position,
      data: {
        label: node.data?.label,
        description: node.data?.description,
        config: node.data?.config || {},
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    })),
    settings: {
      mode: "draft",
      builderVersion: 4,
    },
  };
}
