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
        <p className="mt-3 text-sm text-neutral-500">Select a node to edit its configuration.</p>
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
        {(nodeType === "core.http" || nodeType === "trigger.manual") && (
          <>
            {nodeType === "core.http" && (
              <>
                <input
                  className="rounded-2xl border border-neutral-300 px-4 py-3"
                  placeholder="HTTP method"
                  defaultValue={config.method || "GET"}
                  onBlur={(e) => onPatch({ method: e.target.value })}
                />
                <input
                  className="rounded-2xl border border-neutral-300 px-4 py-3"
                  placeholder="https://api.example.com"
                  defaultValue={config.url || ""}
                  onBlur={(e) => onPatch({ url: e.target.value })}
                />
              </>
            )}
          </>
        )}

        {nodeType === "core.condition" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Left value"
              defaultValue={config.left || ""}
              onBlur={(e) => onPatch({ left: e.target.value })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Operator"
              defaultValue={config.operator || "equals"}
              onBlur={(e) => onPatch({ operator: e.target.value })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Right value"
              defaultValue={config.right || ""}
              onBlur={(e) => onPatch({ right: e.target.value })}
            />
          </>
        )}

        {nodeType === "core.delay" && (
          <>
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="Amount"
              defaultValue={config.amount || 5}
              onBlur={(e) => onPatch({ amount: Number(e.target.value || 0) })}
            />
            <input
              className="rounded-2xl border border-neutral-300 px-4 py-3"
              placeholder="seconds"
              defaultValue={config.unit || "seconds"}
              onBlur={(e) => onPatch({ unit: e.target.value })}
            />
          </>
        )}

        {nodeType === "core.action" && (
          <input
            className="rounded-2xl border border-neutral-300 px-4 py-3"
            placeholder="Action name"
            defaultValue={config.actionName || ""}
            onBlur={(e) => onPatch({ actionName: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
