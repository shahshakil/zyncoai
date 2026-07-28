export type WorkflowNodeType =
  | "trigger.manual"
  | "core.http"
  | "core.condition"
  | "core.delay"
  | "core.action";

export type WorkflowNodeData = {
  label: string;
  description?: string;
  config?: Record<string, any>;
};

export type WorkflowCanvasNode = {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
};

export type WorkflowCanvasEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type WorkflowSpec = {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  settings?: Record<string, any>;
};

export type WorkflowBuilderState = {
  workflowId: string | null;
  name: string;
  description: string;
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  selectedNodeId: string | null;
};
