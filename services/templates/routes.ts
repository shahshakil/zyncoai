import type { Request, Response } from "express";

const templates: any[] = [];

export function registerTemplateRoutes(app: any) {
  app.get("/templates", (_req: Request, res: Response) => {
    res.json({ ok: true, items: templates });
  });

  app.post("/templates", (req: Request, res: Response) => {
    templates.push(req.body);
    res.json({ ok: true });
  });
}
