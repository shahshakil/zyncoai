import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: Request, ctx: { params: { id: string } }) {
  try {
    const base = process.env.ENTERPRISE_API_BASE_URL;
    if (!base) throw new Error("Missing ENTERPRISE_API_BASE_URL");

    const url = new URL(`/enterprise/runs/${encodeURIComponent(ctx.params.id)}`, base);

    const res = await fetch(url.toString(), {
      headers: {
        "accept": "application/json",
        "authorization": process.env.ENTERPRISE_API_TOKEN ? `Bearer ${process.env.ENTERPRISE_API_TOKEN}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "run_proxy_failed", status: res.status, body: text.slice(0, 500) },
        { status: 502 }
      );
    }

    return NextResponse.json(await res.json());
  } catch (e: any) {
    return NextResponse.json({ error: "run_proxy_exception", message: e?.message || "unknown" }, { status: 500 });
  }
}
