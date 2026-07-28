"use client";

import type { WorkflowNodeType } from "@/lib/workflow-builder/types";

const ITEMS: { type: WorkflowNodeType; title: string; desc: string }[] = [
  { type: "trigger.manual", title: "Manual Trigger", desc: "Start workflow manually." },
  { type: "core.http", title: "HTTP Request", desc: "Call APIs and webhooks." },
  { type: "core.condition", title: "Condition", desc: "Branch logic by rules." },
  { type: "core.delay", title: "Delay", desc: "Wait before next step." },
  { type: "core.action", title: "Action", desc: "Generic business action." },
];

export default function NodePalette({
  onAdd,
}: {
  onAdd: (type: WorkflowNodeType) => void;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">Node Palette</h3>
      <div className="mt-4 grid gap-3">
        {ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => onAdd(item.type)}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left transition hover:border-neutral-300 hover:bg-white"
          >
            <div className="text-sm font-semibold text-neutral-950">{item.title}</div>
            <div className="mt-1 text-xs text-neutral-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
