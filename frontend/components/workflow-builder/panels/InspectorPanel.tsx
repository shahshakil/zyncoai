"use client";

import type { WorkflowCanvasNode } from "@/lib/workflow-builder/types";

export default function InspectorPanel({
  node,
  onPatchConfig,
}: {
  node: WorkflowCanvasNode | null;
  onPatchConfig: (patch: Record<string, any>) => void;
}) {
  if (!node) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-950">Inspector</h3>
        <p className="mt-3 text-sm text-neutral-500">Select a node to edit its configuration.</p>
      </div>
    );
  }

  const config = node.data.config || {};

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">Inspector</h3>
      <div className="mt-4 text-sm text-neutral-500">Type: {node.type}</div>
      <div className="mt-1 text-sm text-neutral-500">Node ID: {node.id}</div>

      <div className="mt-5 grid gap-4">
        {node.type === "core.http" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="HTTP method"
              defaultValue={config.method || "GET"}
              onBlur={(e) => onPatchConfig({ method: e.target.value })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="URL"
              defaultValue={config.url || ""}
              onBlur={(e) => onPatchConfig({ url: e.target.value })}
            />
          </>
        )}

        {node.type === "core.condition" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Left value"
              defaultValue={config.left || ""}
              onBlur={(e) => onPatchConfig({ left: e.target.value })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Operator"
              defaultValue={config.operator || "equals"}
              onBlur={(e) => onPatchConfig({ operator: e.target.value })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Right value"
              defaultValue={config.right || ""}
              onBlur={(e) => onPatchConfig({ right: e.target.value })}
            />
          </>
        )}

        {node.type === "core.delay" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Delay amount"
              defaultValue={config.amount || 5}
              onBlur={(e) => onPatchConfig({ amount: Number(e.target.value || 0) })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Unit"
              defaultValue={config.unit || "seconds"}
              onBlur={(e) => onPatchConfig({ unit: e.target.value })}
            />
          </>
        )}

        {node.type === "core.action" && (
          <input
            className="rounded-2xl border border-neutral-300 px-4 py-3"
            placeholder="Action name"
            defaultValue={config.actionName || ""}
            onBlur={(e) => onPatchConfig({ actionName: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
