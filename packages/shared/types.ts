export type ID = string;

export type WorkflowNodeType =
  | "trigger"
  | "action"
  | "logic"
  | "ai"
  | "webhook"
  | "subflow";

export type WorkflowNode = {
  id: ID;
  type: WorkflowNodeType;
  app?: string;       // e.g. "gmail", "slack"
  op?: string;        // e.g. "sendEmail"
  name: string;
  params: Record<string, any>;
  inputs?: Record<string, any>;
};

export type WorkflowEdge = {
  id: string;
  from: string;
  to: string;
  when?: boolean;
};

export type WorkflowDefinition = {
  id: ID;
  name: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type ExecutionStatus = "queued" | "running" | "success" | "failed";

export type ExecutionRecord = {
  id: ID;
  workflowId: ID;
  status: ExecutionStatus;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
};
