import type { Edge, Node } from "reactflow";

export type BuilderNodeKind =
  | "trigger.manual"
  | "core.http"
  | "core.condition"
  | "core.delay"
  | "core.action"
  | "connector.slack.send_message"
  | "ai.agent"
  | "logic.foreach"
  | "approval.human"
  | "logic.parallel";

export type BuilderNodeData = {
  label: string;
  description?: string;
  config?: Record<string, any>;
};

export type WorkflowBuilderNode = Node<BuilderNodeData>;
export type WorkflowBuilderEdge = Edge;
