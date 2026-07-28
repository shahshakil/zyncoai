"use client";

import type { WorkflowCanvasEdge, WorkflowCanvasNode } from "@/lib/workflow-builder/types";

export default function WorkflowCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-950">Workflow Canvas</h3>
          <p className="text-sm text-neutral-500">
            Visual graph foundation for billion-scale automation.
          </p>
        </div>
        <div className="text-sm text-neutral-500">
          Nodes: {nodes.length} · Edges: {edges.length}
        </div>
      </div>

      <div className="min-h-[520px] rounded-3xl border border-dashed border-neutral-300 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => {
            const isActive = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-300"
                }`}
              >
                <div className="text-xs uppercase tracking-[0.18em] opacity-70">{node.type}</div>
                <div className="mt-2 text-base font-semibold">{node.data.label}</div>
                <div className={`mt-2 text-sm ${isActive ? "text-neutral-200" : "text-neutral-500"}`}>
                  {node.data.description || "Node"}
                </div>
                <div className={`mt-3 text-xs ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                  {node.id}
                </div>
              </button>
            );
          })}
        </div>

        {edges.length > 0 && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-sm font-semibold text-neutral-900">Connections</div>
            <div className="mt-3 grid gap-2">
              {edges.map((edge) => (
                <div key={edge.id} className="text-sm text-neutral-600">
                  {edge.source} → {edge.target} {edge.label ? `(${edge.label})` : ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
