import { NextResponse } from "next/server";

export const runtime = "nodejs";

function backendUrl(path: string, req: Request) {
  const base = process.env.ENTERPRISE_API_BASE_URL;
  if (!base) throw new Error("Missing ENTERPRISE_API_BASE_URL");
  const url = new URL(path, base);

  // forward query params
  const { searchParams } = new URL(req.url);
  searchParams.forEach((v, k) => url.searchParams.set(k, v));

  return url;
}

export async function GET(req: Request) {
  try {
    const url = backendUrl("/enterprise/metrics", req);

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
        { error: "metrics_proxy_failed", status: res.status, body: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "metrics_proxy_exception", message: e?.message || "unknown" }, { status: 500 });
  }
}
