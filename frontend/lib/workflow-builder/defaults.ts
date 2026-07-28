import type { WorkflowCanvasNode } from "./types";

export const DEFAULT_TRIGGER_NODE: WorkflowCanvasNode = {
  id: "node-trigger-manual",
  type: "trigger.manual",
  position: { x: 120, y: 120 },
  data: {
    label: "Manual Trigger",
    description: "Starts the workflow manually.",
    config: {
      trigger: "manual",
    },
  },
};

export function createNode(type: WorkflowCanvasNode["type"], index: number): WorkflowCanvasNode {
  const baseX = 140 + index * 40;
  const baseY = 140 + index * 40;

  switch (type) {
    case "core.http":
      return {
        id: `node-http-${Date.now()}-${index}`,
        type,
        position: { x: baseX, y: baseY },
        data: {
          label: "HTTP Request",
          description: "Call an external API endpoint.",
          config: {
            method: "GET",
            url: "",
            headers: {},
            body: "",
          },
        },
      };
    case "core.condition":
      return {
        id: `node-condition-${Date.now()}-${index}`,
        type,
        position: { x: baseX, y: baseY },
        data: {
          label: "Condition",
          description: "Branch execution using simple rules.",
          config: {
            operator: "equals",
            left: "",
            right: "",
          },
        },
      };
    case "core.delay":
      return {
        id: `node-delay-${Date.now()}-${index}`,
        type,
        position: { x: baseX, y: baseY },
        data: {
          label: "Delay",
          description: "Pause execution for a duration.",
          config: {
            amount: 5,
            unit: "seconds",
          },
        },
      };
    case "core.action":
      return {
        id: `node-action-${Date.now()}-${index}`,
        type,
        position: { x: baseX, y: baseY },
        data: {
          label: "Action",
          description: "Generic workflow action placeholder.",
          config: {
            actionName: "",
            payload: {},
          },
        },
      };
    default:
      return {
        id: `node-trigger-${Date.now()}-${index}`,
        type: "trigger.manual",
        position: { x: baseX, y: baseY },
        data: {
          label: "Manual Trigger",
          description: "Starts the workflow manually.",
          config: {
            trigger: "manual",
          },
        },
      };
  }
}
