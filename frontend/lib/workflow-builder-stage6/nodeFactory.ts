import type { WorkflowBuilderNode, BuilderNodeKind } from "./types";

export function makeNode(type: BuilderNodeKind, index: number): WorkflowBuilderNode {
  const basePosition = { x: 150 + index * 40, y: 120 + index * 40 };

  const base = {
    id: `${type}-${Date.now()}-${index}`,
    type: "zyncoNode",
    position: basePosition,
  } as const;

  switch (type) {
    case "trigger.manual":
      return {
        ...base,
        data: {
          label: "Manual Trigger",
          description: "Start workflow manually.",
          config: { nodeType: "trigger.manual", trigger: "manual" },
        },
      };

    case "core.http":
      return {
        ...base,
        data: {
          label: "HTTP Request",
          description: "Call external APIs.",
          config: { nodeType: "core.http", method: "GET", url: "" },
        },
      };

    case "core.condition":
      return {
        ...base,
        data: {
          label: "Condition",
          description: "Branch workflow logic.",
          config: { nodeType: "core.condition", left: "", operator: "equals", right: "" },
        },
      };

    case "core.delay":
      return {
        ...base,
        data: {
          label: "Delay",
          description: "Pause execution.",
          config: { nodeType: "core.delay", amount: 5, unit: "seconds" },
        },
      };

    case "core.action":
      return {
        ...base,
        data: {
          label: "Action",
          description: "Generic business action.",
          config: { nodeType: "core.action", actionName: "" },
        },
      };

    case "connector.slack.send_message":
      return {
        ...base,
        data: {
          label: "Slack Message",
          description: "Send Slack alert/message.",
          config: { nodeType: "connector.slack.send_message", channel: "", text: "" },
        },
      };

    case "ai.agent":
      return {
        ...base,
        data: {
          label: "AI Agent",
          description: "AI-powered task execution.",
          config: { nodeType: "ai.agent", role: "general_agent", objective: "" },
        },
      };

    case "logic.foreach":
      return {
        ...base,
        data: {
          label: "Foreach Loop",
          description: "Iterate over items.",
          config: { nodeType: "logic.foreach", items: [] },
        },
      };

    case "approval.human":
      return {
        ...base,
        data: {
          label: "Human Approval",
          description: "Pause until approved.",
          config: { nodeType: "approval.human", approver: "", message: "" },
        },
      };

    case "logic.parallel":
    default:
      return {
        ...base,
        data: {
          label: "Parallel Branch",
          description: "Fan-out execution branches.",
          config: { nodeType: "logic.parallel", branches: [] },
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
      builderVersion: 6,
    },
  };
}
