import { NextResponse } from "next/server";
import { getExecution, cleanupExecutions } from "@/app/lib/executionStore";

export async function GET(
  req: Request,
  { params }: { params: { executionId: string } }
) {
  try {
    const executionId = params.executionId;

    cleanupExecutions(); // optional TTL cleanup

    const exec = getExecution(executionId);
    if (!exec) {
      return NextResponse.json(
        { ok: false, error: "execution not found (maybe still running)" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, executionId, execution: exec });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String((e as any)?.message || "failed") },
      { status: 500 }
    );
  }
}
