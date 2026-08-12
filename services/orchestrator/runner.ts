import type { WorkflowDefinition } from "../../packages/shared/types";

export async function runWorkflow(def: WorkflowDefinition, input: any) {
  // TODO: build execution context, evaluate edges, run nodes
  return { ok: true, output: input };
}
