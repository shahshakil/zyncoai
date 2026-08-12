import type { Request, Response } from "express";

export function registerTablesRoutes(app: any) {
  app.post("/tables", async (req: Request, res: Response) => {
    // TODO create table schema
    res.json({ ok: true });
  });

  app.post("/tables/:tableId/rows", async (req: Request, res: Response) => {
    // TODO insert row
    res.json({ ok: true, tableId: req.params.tableId });
  });

  app.get("/tables/:tableId/rows", async (req: Request, res: Response) => {
    // TODO list rows
    res.json({ ok: true, tableId: req.params.tableId, items: [] });
  });
}
