// Single catch-all proxy for every /api/business/** call the dashboard UI
// makes. Client components never see the access token (it's httpOnly) —
// they just call same-origin /api/business/... with credentials included
// automatically by the browser, and this route attaches the real
// Authorization: Bearer header server-side before forwarding to the
// backend, retrying once through a silent refresh on a 401. This is the
// only place that needs to know about the token at all, so every dashboard
// page/component below just does a plain fetch("/api/business/...").
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, extractSetCookieValue, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

async function tryRefresh(): Promise<string | null> {
  const refresh = cookies().get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;

  const r = await backendFetch("/api/auth/refresh", { method: "POST", refreshToken: refresh });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.access_token) return null;

  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  const rotated = extractSetCookieValue(r, "refresh_token");
  if (rotated) c.set(REFRESH_COOKIE, rotated, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });

  return data.access_token as string;
}

async function proxy(req: NextRequest, params: { path: string[] }) {
  let access = cookies().get(ACCESS_COOKIE)?.value;
  if (!access) {
    access = (await tryRefresh()) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  const targetPath = "/api/business/" + params.path.join("/") + req.nextUrl.search;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD" && method !== "DELETE";
  const body = hasBody ? await req.text() : undefined;

  const doFetch = (token: string) =>
    backendFetch(targetPath, {
      method,
      headers: { authorization: `Bearer ${token}`, ...(hasBody ? { "content-type": "application/json" } : {}) },
      body: body || undefined,
    });

  let r = await doFetch(access);
  if (r.status === 401) {
    access = (await tryRefresh()) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    r = await doFetch(access);
  }

  const contentType = r.headers.get("content-type") || "";
  if (contentType.includes("text/csv")) {
    const csv = await r.text();
    return new NextResponse(csv, {
      status: r.status,
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": r.headers.get("content-disposition") || "attachment" },
    });
  }

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
