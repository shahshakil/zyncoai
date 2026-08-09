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
import { backendFetch, extractSetCookieValue, getClientIp, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

async function tryRefresh(clientIp: string | null): Promise<string | null> {
  const refresh = cookies().get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;

  const r = await backendFetch("/api/auth/refresh", { method: "POST", refreshToken: refresh, clientIp });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.access_token) return null;

  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  const rotated = extractSetCookieValue(r, "refresh_token");
  if (rotated) c.set(REFRESH_COOKIE, rotated, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });

  return data.access_token as string;
}

async function proxy(req: NextRequest, params: { path: string[] }) {
  const clientIp = getClientIp(req);
  let access = cookies().get(ACCESS_COOKIE)?.value;
  if (!access) {
    access = (await tryRefresh(clientIp)) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  const targetPath = "/api/business/" + params.path.join("/") + req.nextUrl.search;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD" && method !== "DELETE";
  // File uploads (restaurant-menu photo/PDF import, any future multipart
  // route) send multipart/form-data with binary content — req.text() UTF-8
  // decodes the body, which corrupts arbitrary binary bytes (JPEG/PDF/HEIC
  // are not valid UTF-8), and the old hardcoded "content-type:
  // application/json" also stripped the boundary= parameter multer needs
  // to parse the form at all. Every multipart upload silently failed
  // before this fix, regardless of file size. arrayBuffer() + forwarding
  // the real content-type (boundary included) fixes both; every other
  // route keeps going through .text() as JSON, unchanged.
  const requestContentType = req.headers.get("content-type") || "";
  const isMultipart = requestContentType.startsWith("multipart/form-data");
  const body = hasBody ? (isMultipart ? await req.arrayBuffer() : await req.text()) : undefined;

  // Forwarded as-is when present — the sensitive-action reauth flow
  // (components/auth/ConfirmPasswordModal.tsx) attaches this so
  // requireReauth() on the backend can see it. Everything else about this
  // proxy stays untouched; this is purely additive passthrough.
  const reauthToken = req.headers.get("x-reauth-token");

  const doFetch = (token: string) =>
    backendFetch(targetPath, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        ...(hasBody ? { "content-type": isMultipart ? requestContentType : "application/json" } : {}),
        ...(reauthToken ? { "x-reauth-token": reauthToken } : {}),
      },
      body: body || undefined,
      clientIp,
    });

  let r = await doFetch(access);
  if (r.status === 401) {
    access = (await tryRefresh(clientIp)) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    r = await doFetch(access);
  }

  // 2026-08-09 OAuth trust audit fix — the OAuth-connect callbacks
  // (Google Calendar, Google Workspace staff sync, Microsoft calendar/
  // directory sync) all respond with a real HTTP redirect back to a
  // dashboard page. backendFetch() now uses redirect:"manual" specifically
  // so that redirect arrives here intact instead of being silently
  // followed server-side (see backendFetch's own comment) — pass it
  // through to the actual browser rather than trying to JSON-parse a 3xx
  // with no body, which is what handed users a blank {} instead of
  // landing back on Settings after connecting.
  if (r.status >= 300 && r.status < 400) {
    const location = r.headers.get("location");
    if (location) return NextResponse.redirect(location, r.status);
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
