import { PrismaClient } from "@prisma/client";
import { db } from "./index";

const prisma = new PrismaClient();

export type JobType = "EXECUTE_WORKFLOW";
export type JobStatus = "queued" | "running" | "done" | "failed";

export async function enqueueJob(type: JobType, payload: any) {
  return prisma.job.create({
    data: {
      type,
      payload,
      status: "queued",
    },
  });
}

export async function dequeueJob() {
  const job = await prisma.job.findFirst({
    where: { status: "queued" },
    orderBy: { createdAt: "asc" },
  });

  if (!job) return null;

  await prisma.job.update({
    where: { id: job.id },
    data: { status: "running" },
  });

  return job;
}

export async function completeJob(id: string, ok: boolean, error?: string) {
  return prisma.job.update({
    where: { id },
    data: {
      status: ok ? "done" : "failed",
      payload: error
        ? { ...(((await prisma.job.findUnique({ where: { id }, select: { payload: true } }))?.payload as any) ?? {}), error }
        : undefined,
    },
  });
}

export async function listJobs() {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });
}
