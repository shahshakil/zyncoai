type ExecRecord = {
  ts: number;      // saved time
  data: any;       // execution result object
};

const KEY = "_ZYNCO_EXEC_STORE_";

function store(): Map<string, ExecRecord> {
  const g = globalThis as any;
  if (!g[KEY]) g[KEY] = new Map<string, ExecRecord>();
  return g[KEY];
}

export function saveExecution(executionId: string, data: any) {
  store().set(executionId, { ts: Date.now(), data });
}

export function getExecution(executionId: string) {
  const rec = store().get(executionId);
  if (!rec) return null;
  return rec.data;
}

// Optional cleanup (TTL)
export function cleanupExecutions(ttlMs = 60 * 60 * 1000) {
  const s = store();
  const now = Date.now();
  for (const [id, rec] of s.entries()) {
    if (now - rec.ts > ttlMs) s.delete(id);
  }
}
