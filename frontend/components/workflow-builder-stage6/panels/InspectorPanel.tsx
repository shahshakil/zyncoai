"use client";

export default function InspectorPanel({
  node,
  onPatch,
}: {
  node: any | null;
  onPatch: (patch: Record<string, any>) => void;
}) {
  if (!node) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-950">Inspector</h3>
        <p className="mt-3 text-sm text-neutral-500">Select a node to edit configuration.</p>
      </div>
    );
  }

  const config = node?.data?.config || {};
  const nodeType = config.nodeType || "";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-950">Inspector</h3>
      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-400">{nodeType}</div>

      <div className="mt-4 grid gap-3">
        {nodeType === "ai.agent" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Agent role"
              defaultValue={config.role || "general_agent"}
              onBlur={(e) => onPatch({ role: e.target.value })}
            />
            <textarea
              className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Objective"
              defaultValue={config.objective || ""}
              onBlur={(e) => onPatch({ objective: e.target.value })}
            />
          </>
        )}

        {nodeType === "logic.foreach" && (
          <textarea
            className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3"
            placeholder='["item1","item2"]'
            defaultValue={JSON.stringify(config.items || [])}
            onBlur={(e) => {
              try {
                onPatch({ items: JSON.parse(e.target.value || "[]") });
              } catch {
                onPatch({ items: [] });
              }
            }}
          />
        )}

        {nodeType === "approval.human" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Approver email/name"
              defaultValue={config.approver || ""}
              onBlur={(e) => onPatch({ approver: e.target.value })}
            />
            <textarea
              className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Approval message"
              defaultValue={config.message || ""}
              onBlur={(e) => onPatch({ message: e.target.value })}
            />
          </>
        )}

        {nodeType === "logic.parallel" && (
          <textarea
            className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3"
            placeholder='["branch-a","branch-b"]'
            defaultValue={JSON.stringify(config.branches || [])}
            onBlur={(e) => {
              try {
                onPatch({ branches: JSON.parse(e.target.value || "[]") });
              } catch {
                onPatch({ branches: [] });
              }
            }}
          />
        )}

        {nodeType !== "ai.agent" &&
          nodeType !== "logic.foreach" &&
          nodeType !== "approval.human" &&
          nodeType !== "logic.parallel" && (
            <div className="text-sm text-neutral-500">
              Use the earlier Stage 5 inspector fields for other node types.
            </div>
          )}
      </div>
    </div>
  );
}
