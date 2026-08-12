import { dequeueJob, completeJob } from "../../packages/db";
import { runWorkflow } from "../orchestrator/runner";

export async function pollAndRunJobs() {
  while (true) {
    const job = await dequeueJob();

    if (!job) {
      await new Promise((r) => setTimeout(r, 700));
      continue;
    }

    try {
      if (job.type === "EXECUTE_WORKFLOW") {
        const { executionId, workflowId, input } = (job.payload as any) ?? {};
        console.log("worker: running", { executionId, workflowId });

        await runWorkflow(workflowId, input);

        await completeJob(job.id, true);
        console.log("worker: done", { executionId });
      } else {
        await completeJob(job.id, false, "Unknown job type");
      }
    } catch (e: any) {
      await completeJob(job.id, false, e?.message || "Worker error");
      console.error("worker: failed", e);
    }
  }
}
