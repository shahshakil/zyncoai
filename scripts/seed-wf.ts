import { db } from "../packages/db";

async function main() {
  const now = new Date();

  // 1) Team (your schema requires updatedAt)
  const team = await db.team.upsert({
    where: { id: "team-1" },
    update: {
      updatedAt: now,
    } as any,
    create: {
      id: "team-1",
      name: "Demo Team",
      createdAt: now,
      updatedAt: now,
    } as any,
  });

  // 2) User (may also require timestamps in your schema)
  const user = await db.user.upsert({
    where: { id: "user-1" },
    update: {
      teamId: team.id,
      updatedAt: now,
    } as any,
    create: {
      id: "user-1",
      email: "demo@zyncoai.local",
      name: "Demo User",
      teamId: team.id,
      createdAt: now,
      updatedAt: now,
    } as any,
  });

  // 3) WorkflowDefinition (requires teamId; may require timestamps too)
  const def = await db.workflowDefinition.upsert({
    where: { id: "wfd-1" },
    update: {
      updatedAt: now,
    } as any,
    create: {
      id: "wfd-1",
      teamId: team.id,
      name: "Demo Definition",
      steps: {
        nodes: [
          { id: "start", type: "start" },
          { id: "echo", type: "echo", config: { path: "$.msg" } },
        ],
        edges: [{ from: "start", to: "echo" }],
      },
      createdAt: now,
      updatedAt: now,
    } as any,
  });

  // 4) Workflow (usually needs teamId/userId/definitionId + timestamps)
  await db.workflow.upsert({
    where: { id: "wf-1" },
    update: {
      name: "Demo Workflow",
      teamId: team.id,
      userId: user.id,
      definitionId: def.id,
      updatedAt: now,
    } as any,
    create: {
      id: "wf-1",
      name: "Demo Workflow",
      teamId: team.id,
      userId: user.id,
      definitionId: def.id,
      createdAt: now,
      updatedAt: now,
    } as any,
  });

  console.log("✅ Seeded: team-1, user-1, wfd-1, wf-1");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
