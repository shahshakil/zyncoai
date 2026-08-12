import { dequeueJob, completeJob } from "../../packages/db/jobs";
import { runWorkflow } from "../orchestrator/engine";

export async function startWorker() {
  console.log("ZyncoAI Worker started...");

  while (true) {
    const job = await dequeueJob();

    if (!job) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    try {
      if (job.type === "EXECUTE_WORKFLOW") {
        const { workflowId, input } = (job.payload as any) ?? {};
        console.log("Running workflow:", workflowId);

        await runWorkflow(workflowId, input);

        await completeJob(job.id, true);
      }
    } catch (err: any) {
      console.error("Job failed:", err);
      await completeJob(job.id, false, err.message);
    }
  }
}
