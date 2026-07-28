// Proxy for every /api/admin/** (super-admin platform) call. No refresh
// logic — a 401 here just means the 30-minute admin session expired and the
// super-admin UI should bounce back to /admin-login (see the admin
// dashboard layout).
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

async function proxy(req: NextRequest, params: { path: string[] }) {
  const token = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const targetPath = "/api/admin/" + params.path.join("/") + req.nextUrl.search;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD" && method !== "DELETE";
  const body = hasBody ? await req.text() : undefined;

  const r = await backendFetch(targetPath, {
    method,
    headers: { authorization: `Bearer ${token}`, ...(hasBody ? { "content-type": "application/json" } : {}) },
    body: body || undefined,
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params);
}
