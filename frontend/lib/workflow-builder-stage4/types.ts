import type { Edge, Node } from "reactflow";

export type BuilderNodeKind =
  | "trigger.manual"
  | "core.http"
  | "core.condition"
  | "core.delay"
  | "core.action";

export type BuilderNodeData = {
  label: string;
  description?: string;
  config?: Record<string, any>;
};

export type WorkflowBuilderNode = Node<BuilderNodeData>;
export type WorkflowBuilderEdge = Edge;

export type WorkflowRunStep = {
  nodeId?: string;
  nodeType?: string;
  result?: any;
  executedAt?: string;
  status?: string;
  error?: string;
};

export type WorkflowRunLog = {
  id: string;
  status: string;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string | null;
  meta?: any;
};
