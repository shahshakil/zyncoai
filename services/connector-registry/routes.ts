import type { Request, Response } from "express";
import { listConnectors } from "./registry";

export function registerConnectorRegistryRoutes(app: any) {
  app.get("/connectors", (_req: Request, res: Response) => {
    res.json({ ok: true, items: listConnectors() });
  });
}
