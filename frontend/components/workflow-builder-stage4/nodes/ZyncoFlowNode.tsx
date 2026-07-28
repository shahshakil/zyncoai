"use client";

import { Handle, Position } from "reactflow";

export default function ZyncoFlowNode({ data }: { data: any }) {
  return (
    <div className="min-w-[220px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <Handle type="target" position={Position.Top} />
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
        {data?.config?.nodeType || "node"}
      </div>
      <div className="mt-2 text-sm font-semibold text-neutral-950">{data?.label || "Node"}</div>
      <div className="mt-1 text-xs text-neutral-500">
        {data?.description || "ZyncoAI workflow node"}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
