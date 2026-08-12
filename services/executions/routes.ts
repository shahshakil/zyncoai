import type { Request, Response } from "express";

export function registerExecutionRoutes(app: any) {
  app.get("/executions/:id", async (req: Request, res: Response) => {
    // TODO: fetch execution from DB
    res.json({ ok: true, id: req.params.id });
  });

  app.get("/workflows/:id/executions", async (req: Request, res: Response) => {
    // TODO: list executions by workflow
    res.json({ ok: true, workflowId: req.params.id, items: [] });
  });
}
