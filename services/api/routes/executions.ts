import type { Request, Response } from "express";
import { enqueueJob } from "../../../packages/db/jobs";

export function registerExecutionRoutes(app: any) {
  app.post("/executions/run", async (req: Request, res: Response) => {
    const { workflowId, input } = req.body;

    const job = await enqueueJob("EXECUTE_WORKFLOW", {
      workflowId,
      input,
    });

    res.json({
      ok: true,
      executionId: job.id,
      status: job.status,
    });
  });

  app.get("/executions", async (_req: Request, res: Response) => {
    const { listJobs } = await import("../../../packages/db/jobs");
    const jobs = await listJobs();
    res.json(jobs);
  });
}
