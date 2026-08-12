// packages/templates/registry.ts
import fs from "fs";
import path from "path";

export type WorkflowTemplate = {
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  definition: any;
};

function readJson(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ✅ IMPORTANT: do NOT use __dirname in Next bundling.
// Instead, resolve from process.cwd() (frontend) and fallback to repo root.
function resolveTemplatesDir() {
  const cwd = process.cwd(); // usually /opt/my-ai-saas/frontend (inside Next)

  const candidates = [
    path.join(cwd, "packages", "templates", "workflows"),
    path.join(cwd, "..", "packages", "templates", "workflows"),
    "/opt/my-ai-saas/packages/templates/workflows",
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return null;
}

export function listTemplates(): WorkflowTemplate[] {
  const templatesDir = resolveTemplatesDir();
  if (!templatesDir) return [];

const out: WorkflowTemplate[] = [];

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name.endsWith(".json")) {
      const json = readJson(full);
      if (json && json.id && json.definition) out.push(json);
    }
  }
}

walk(templatesDir);
return out;
}

export function searchTemplates(opts?: {
  category?: string;
  tag?: string;
  search?: string;
}) {
  let all = listTemplates();

  if (opts?.category) {
    all = all.filter(t => t.category?.toLowerCase() === opts.category!.toLowerCase());
  }

  if (opts?.tag) {
    all = all.filter(t => (t.tags || []).includes(opts.tag!));
  }

  if (opts?.search) {
    const q = opts.search.toLowerCase();
    all = all.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
  }

  return all;
}

export function getTemplateById(id: string): WorkflowTemplate | null {
  const all = listTemplates();
  return all.find((t) => t.id === id) ?? null;
}
