"use client";

import type { BuilderNodeKind } from "@/lib/workflow-builder-stage6/types";

const items: { type: BuilderNodeKind; label: string; desc: string }[] = [
  { type: "trigger.manual", label: "Manual Trigger", desc: "Start workflow manually" },
  { type: "core.http", label: "HTTP Request", desc: "Call external APIs" },
  { type: "core.condition", label: "Condition", desc: "Branch logic by rule" },
  { type: "core.delay", label: "Delay", desc: "Pause execution" },
  { type: "core.action", label: "Action", desc: "Generic business action" },
  { type: "connector.slack.send_message", label: "Slack Message", desc: "Send Slack message" },
  { type: "ai.agent", label: "AI Agent", desc: "AI-powered autonomous step" },
  { type: "logic.foreach", label: "Foreach Loop", desc: "Loop through list items" },
  { type: "approval.human", label: "Human Approval", desc: "Wait for human decision" },
  { type: "logic.parallel", label: "Parallel Branch", desc: "Run branch group in parallel" },
];

export default function NodePalette({
  onAddNode,
}: {
  onAddNode: (type: BuilderNodeKind) => void;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">AI + Logic Node Library</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddNode(item.type)}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left transition hover:border-neutral-300 hover:bg-white"
          >
            <div className="text-sm font-semibold text-neutral-950">{item.label}</div>
            <div className="mt-1 text-xs text-neutral-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
