import type { Request, Response } from "express";

export function registerCredentialRoutes(app: any) {
  app.post("/credentials", async (req: Request, res: Response) => {
    // TODO: encrypt + store
    res.json({ ok: true });
  });

  app.get("/credentials", async (_req: Request, res: Response) => {
    // TODO: list metadata only (no secrets)
    res.json({ ok: true, items: [] });
  });
}
