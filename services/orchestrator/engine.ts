export async function runWorkflow(workflowId: string, input: any) {
  console.log("Executing workflow graph:", workflowId);
  console.log("Input:", input);

  // Later: DAG, nodes, connectors, AI, tools
  return { ok: true };
}
