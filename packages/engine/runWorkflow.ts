// packages/engine/runWorkflow.ts
// ZyncoAI Workflow Engine (MVP) — loads workflow from DB layer + executes nodes in order.

import { db } from "@packages/db"; // you will create packages/db/index.ts
import { nanoid } from "nanoid";

export type WorkflowNode = {
  id: string;
  type: string; // "trigger" | "action" | "logic" | "ai" | ...
  name?: string;
  config?: Record<string, any>;
};

export type WorkflowEdge = {
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
  when?: boolean;
};

export type WorkflowDefinition = {
  id: string;
  name?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type NodeResult = {
  ok: boolean;
  output?: any;
  error?: string;
};

type ExecutionContext = {
  executionId: string;
  workflowId: string;
  input: any;
  vars: Record<string, any>; // shared memory between nodes
  logs: Array<{ ts: string; nodeId?: string; msg: string; data?: any }>;
};

function log(ctx: ExecutionContext, msg: string, data?: any, nodeId?: string) {
  ctx.logs.push({ ts: new Date().toISOString(), nodeId, msg, data });
}

function topoSort(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  // Simple Kahn topo sort. Assumes DAG. If cycles exist, it will fall back to node list order.
  const inDeg = new Map<string, number>();
  const out = new Map<string, string[]>();

  for (const n of nodes) {
    inDeg.set(n.id, 0);
    out.set(n.id, []);
  }
  for (const e of edges) {
    if (!inDeg.has(e.to)) inDeg.set(e.to, 0);
    inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1);
    out.set(e.from, [...(out.get(e.from) || []), e.to]);
  }

  const q: string[] = [];
  for (const [id, d] of inDeg.entries()) if (d === 0) q.push(id);

  const order: string[] = [];
  while (q.length) {
    const id = q.shift()!;
    order.push(id);
    for (const to of out.get(id) || []) {
      inDeg.set(to, (inDeg.get(to) || 0) - 1);
      if ((inDeg.get(to) || 0) === 0) q.push(to);
    }
  }

function getPath(obj: any, path: string) {
  return path.split(".").reduce((acc: any, key: string) => (acc == null ? undefined : acc[key]), obj);
}

  // If cycle/invalid graph, return original order
  if (order.length !== nodes.length) return nodes.map((n) => n.id);
  return order;
}

//Render Template helper
function getPath(obj: any, path: string) {
  if (!obj) return undefined;
  const parts = String(path).split(".").filter(Boolean);
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

// Very small template engine: "hi {{input.msg}}"
function renderTemplate(
  template: any,
  ctx: ExecutionContext,
  lastOutput: any
): any {
  if (template == null) return template;

  // If config is object/array, recursively render values
  if (Array.isArray(template)) return template.map((v) => renderTemplate(v, ctx, lastOutput));
  if (typeof template === "object") {
    const out: any = {};
    for (const k of Object.keys(template)) {
      out[k] = renderTemplate((template as any)[k], ctx, lastOutput);
    }
    return out;
  }

  if (typeof template !== "string") return template;

  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_m, expr) => {
    const key = String(expr).trim();

    if (key === "last") return String(lastOutput ?? "");
    if (key.startsWith("last.")) return String(getPath(lastOutput, key.slice(5)) ?? "");

    if (key === "input") return String(ctx.input ?? "");
    if (key.startsWith("input.")) return String(getPath(ctx.input, key.slice(6)) ?? "");

    if (key === "vars") return String(ctx.vars ?? "");
    if (key.startsWith("vars.")) return String(getPath(ctx.vars, key.slice(5)) ?? "");

    return "";
  });
}


/** Node executor registry */
async function executeNode(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
  try {
    switch (node.type) {
      case "start": {
  return { ok: true, output: ctx.input };
}
      case "trigger": {
        // Trigger usually just passes the initial input forward
        return { ok: true, output: ctx.input };
      }

     case "echo": {
        // default: echo input.msg
        const tpl = node.config?.text ?? "{{input.msg}}";
        const out = renderTemplate(tpl, ctx, ctx.vars["$last"]);
        return { ok: true, output: out };
      }

      case "setVariable": {
        const key = node.config?.key;
        const rawValue = node.config?.value;

        if (!key) return { ok: false, error: "setVariable missing config.key" };

        // value can be templated: "{{input.msg}}"
        const value = renderTemplate(rawValue, ctx, ctx.vars["$last"]);

        ctx.vars[key] = value;
        return { ok: true, output: { [key]: value } };
      }

      case "transform": {
       // config.set is an object: { age: "{{last.data.age}}", ... }
       const setObj = node.config?.set ?? {};
       const last = ctx.vars["$last"];

       for (const key of Object.keys(setObj)) {
       ctx.vars[key] = renderTemplate(setObj[key], ctx, last);
       }

       return { ok: true, output: { ...setObj } }; 
       } 

      case "httpRequest": {
        // Example: node.config = { url, method, headers, body }
        const rawUrl = node.config?.url;
        if (!rawUrl) return { ok: false, error: "httpRequest missing config.url" };

        const last = ctx.vars["$last"];
        const url = renderTemplate(rawUrl, ctx, last);
        const method = (node.config?.method || "GET").toUpperCase();
        const headers = node.config?.headers || {};
        const body = node.config?.body;

        const res = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        const text = await res.text();
        let json: any = null;
        try { json = JSON.parse(text); } catch {}

        return {
          ok: res.ok,
          output: { status: res.status, text, json },
          error: res.ok ? undefined : `HTTP ${res.status}`,
        };
      }

      case "ai": {
        // Placeholder: integrate your AI orchestrator service later
        const prompt = node.config?.prompt || "AI node executed";
        return { ok: true, output: { message: prompt } };
      }

      case "logic": {
        // Placeholder logic node (you will extend with condition routing)
        return { ok: true, output: { pass: true } };
      }

case "jsonExtract": {
  // config: { path: "json.age", toVar: "age", from?: "callApi" }
  const p = node.config?.path;
  if (!p) return { ok: false, error: "jsonExtract missing config.path" };

  const last = ctx.vars["$last"];
  const resolvedPath = renderTemplate(p, ctx, last);

  // If "from" is provided, try to read that node's stored output.
  const from = node.config?.from; // e.g. "callApi"
  const fromStored = from ? ctx.vars[`$node.${from}`] : undefined;

  // source can be:
  // - stored node output (if you saved it)
  // - otherwise fallback to last
  const sourceRaw = fromStored ?? last;

  // Sometimes source might be NodeResult-like { ok, output }, sometimes it's already output
  const source = (sourceRaw as any)?.output ?? sourceRaw;

  const value = getPath(source, resolvedPath);

  const toVar = node.config?.toVar;
  if (toVar) ctx.vars[toVar] = value;

  return { ok: true, output: value };
}

case "condition": {
  // config: { left, operator, right }
  const leftRaw = node.config?.left;
  const operator = node.config?.operator;
  const rightRaw = node.config?.right;

  if (!leftRaw || !operator) {
    return { ok: false, error: "condition missing config" };
  }

  const last = ctx.vars["$last"];

  const left = Number(renderTemplate(String(leftRaw), ctx, last));
  const right = Number(renderTemplate(String(rightRaw), ctx, last));

  let result = false;

  switch (operator) {
    case "==": result = left == right; break;
    case "!=": result = left != right; break;
    case ">": result = left > right; break;
    case "<": result = left < right; break;
    case ">=": result = left >= right; break;
    case "<=": result = left <= right; break;
    default:
      return { ok: false, error: "Invalid operator" };
  }

  ctx.vars["$condition"] = result;

  return { ok: true, output: result };
}

case "setVar": {
  // config: { key: "age", value: "{{input.value}}" }
  const key = node.config?.key;
  const rawValue = node.config?.value;

  if (!key) return { ok: false, error: "setVar missing config.key" };

  const last = ctx.vars["$last"];
  const value = renderTemplate(String(rawValue ?? ""), ctx, last);

  ctx.vars[key] = value;
  return { ok: true, output: { [key]: value } };
}

case "retry": {
  const nodeId = node.id;
  const targetId = node.config?.target;
  if (!targetId) return { ok: false, error: "retry missing config.target" };

  const maxAttempts = Number(node.config?.maxAttempts ?? 3);
  const delayMs = Number(node.config?.delayMs ?? 300);
  const backoff = String(node.config?.backoff ?? "linear");

  const nodeMap = (ctx as any).nodeMap as Map<string, any>;
  if (!nodeMap) return { ok: false, error: "retry: nodeMap missing in ctx" };
  const targetNode = nodeMap.get(targetId);
  if (!targetNode) return { ok: false, error: `retry target not found: ${targetId}` };

  const shouldRetry = (r: any) => {
    if (!r) return true;
    if (r.ok === false) return true;

    const status = r?.output?.status;
    if (typeof status === "number" && status >= 500) return true;

    return false;
  };

  let lastResult: any = null;

  // Keep original $last so we don’t mess main execution
  const originalLast = ctx.vars["$last"];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log(ctx, "Retry attempt", { targetId, attempt, maxAttempts }, nodeId);

    // ✅ IMPORTANT: prepare context like main loop
    ctx.vars["$last"] = originalLast;
    // also expose "current last" to the target id (optional)
    ctx.vars[`$node.${targetId}`] = { ok: true, output: originalLast };

    // run target
    lastResult = await executeNode(targetNode, ctx);
    ctx.vars["$last"] = lastResult?.output;

    // ✅ IMPORTANT: store REAL result for $node.target
    ctx.vars[`$node.${targetId}`] = lastResult;

    // ✅ update $last to target output (so later nodes can use it if needed)
    if (lastResult?.ok) {
      ctx.vars["$last"] = lastResult.output;
    }

    if (!shouldRetry(lastResult)) {
      return { ok: true, output: lastResult.output };
    }

    if (attempt < maxAttempts) {
      const wait =
        backoff === "exponential"
          ? delayMs * Math.pow(2, attempt - 1)
          : delayMs * attempt;

      await new Promise((r) => setTimeout(r, wait));
    }
  }

  return { ok: false, error: "retry failed after max attempts", output: lastResult?.output };
}

      default: {
        return { ok: false, error: `Unknown node type: ${node.type}` };
      }
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Node execution error" };
  }
}

/** Load workflow definition from DB */
async function loadWorkflowDefinition(workflowId: string): Promise<WorkflowDefinition> {
  // This assumes your DB layer returns something like:
  // { id, name, nodes: [...], edges: [...] }
  // 1) Load workflow record
const wf = await db.workflow.findUnique({
  where: { id: workflowId },
  include: {
  WorkflowDefinition: true, // if your schema has relation name "definition"
  },
});

if (!wf) {
  throw new Error(`Workflow not found: ${workflowId}`);
}

// 2) Get workflow definition JSON (prefer definition table if exists)
const defJson =
  (wf as any).WorkflowDefinition?.steps ??
  (wf as any).definition?.spec ??
  (wf as any).json ??
  (wf as any).spec;

if (!defJson) {
  throw new Error(`Workflow has no definition JSON: ${workflowId}`);
}

// defJson is stored in WorkflowDefinition.steps (JSON)
  const nodes = (defJson as any).nodes ?? [];
  const edges = (defJson as any).edges ?? [];

  return {
    id: wf.id,
    name: wf.name,
    nodes,
    edges,
  };
} // <-- THIS closes loadWorkflowDefinition()

/** Main execution entry */
export async function runWorkflow(workflowId: string, input: any) {
  const executionId = nanoid();

  const ctx: ExecutionContext = {
    executionId,
    workflowId,
    input,
    vars: {},
    logs: [],
  };

  log(ctx, "Execution started", { workflowId });

  const wf = await loadWorkflowDefinition(workflowId);
  log(ctx, "Loaded workflow definition", { nodes: wf.nodes.length, edges: wf.edges.length });

  // Topological order execution (MVP)
  const order = topoSort(wf.nodes, wf.edges);

// Only run nodes that are reachable from "start" via edges.
// This prevents "orphan" nodes (like callApi in retry template) from executing by themselves.
const reachable = new Set<string>();

const startNodeId = "start";
reachable.add(startNodeId);

let changed = true;
while (changed) {
  changed = false;
  for (const e of wf.edges as any[]) {
    if (reachable.has(e.from) && !reachable.has(e.to)) {
      reachable.add(e.to);
      changed = true;
    }
  }
} 

 const nodeMap = new Map(wf.nodes.map((n) => [n.id, n]));
 (ctx as any).nodeMap = nodeMap;

  const results: Record<string, NodeResult> = {};
  let lastOutput: any = input;

  for (const nodeId of order) {
    const node = nodeMap.get(nodeId);
    if (!node) continue;

// Skip nodes that are not connected to the workflow graph starting from "start"
if (!reachable.has(nodeId)) {
  log(ctx, "Skipping unreachable node", { nodeId }, nodeId);
  continue;
}

    log(ctx, "Executing node", { nodeType: node.type, name: node.name }, nodeId);

    // Make input available to nodes
    ctx.vars["$last"] = lastOutput;
    ctx.vars[`$node.${node.id}`] = { ok: true, output: lastOutput };
    ctx.vars["$input"] = input;

// --- Branching support (edge.when) ---
      // If this node has an incoming edge like { from, to, when: true/false },
      // only run it when the FROM node's output matches "when".
      const incoming = wf.edges.filter((e: any) => e.to === nodeId);
      const gated = incoming.find((e: any) => typeof e.when === "boolean");

      if (gated) {
        const fromStored = ctx.vars[`$node.${gated.from}`] as any;
        const fromValue = fromStored?.output ?? fromStored; // bool from condition node
        if (fromValue !== gated.when) {
          log(ctx, "Skipping node due to branch condition", { from: gated.from, when: gated.when, got: fromValue }, nodeId);
          continue;
        }
      }
      // --- end branching support ---

    const r = await executeNode(node, ctx);
    results[nodeId] = r;

    if (!r.ok) {
      log(ctx, "Node failed", { error: r.error }, nodeId);

   await db.workflowRun.create({
  data: {
    id: executionId,
    workflowId,
    definitionId: (wf as any).WorkflowDefinition?.id ?? (wf as any).definitionId ?? null,
    teamId: (wf as any).teamId ?? null,
    userId: (wf as any).userId ?? null,
    status: "failed",
    input,
    output: { results, logs: ctx.logs },
    error: r.error || "node failed",
  },
});

      return {
        executionId,
        workflowId,
        status: "failed",
        error: r.error,
        results,
        logs: ctx.logs,
      };
    }

    lastOutput = r.output;
    log(ctx, "Node done", { output: r.output }, nodeId);
    ctx.vars["$last"] = lastOutput;
ctx.vars[`$node.${node.id}`] = { ok: true, output: lastOutput };
 }

  log(ctx, "Execution completed", { lastOutput });

  await db.workflowRun.create({
  data: {
    id: executionId,
    workflowId,
    definitionId: (wf as any).WorkflowDefinition?.id ?? (wf as any).definitionId ?? null,
    teamId: (wf as any).teamId ?? null,
    userId: (wf as any).userId ?? null,
    status: "success",
    input,
    output: { results, logs: ctx.logs },
  },
});

  return {
    executionId,
    workflowId,
    status: "success",
    output: lastOutput,
    results,
    logs: ctx.logs,
  };
}
