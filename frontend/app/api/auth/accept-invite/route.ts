// The generic /api/business/[...path] proxy requires an existing zyn_access
// cookie before forwarding anything (it exists to attach a Bearer token to
// authenticated calls) — but a staff-invite acceptance is, by definition, a
// brand-new visitor who has never logged in, so that proxy always 401'd
// them with "not_authenticated" before the backend's genuinely public
// invite routes were ever reached. This route talks to the backend
// directly instead, same server-to-server pattern as /api/auth/login, and
// on a successful accept turns the backend's access_token into the same
// real httpOnly zyn_access/zyn_refresh cookies login sets — the accept
// endpoint previously returned access_token as a plain JSON field with
// nothing ever converting it into a session, so even a successful accept
// left the new user logged out.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, extractSetCookieValue, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });

  const r = await backendFetch(`/api/business/staff/invitations/public/${encodeURIComponent(token)}`);
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { token, password, name } = body || {};

  if (!token || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const r = await backendFetch(`/api/business/staff/invitations/public/${encodeURIComponent(token)}/accept`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, password, name }),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok || !data?.access_token) {
    return NextResponse.json({ ok: false, error: data?.error || "accept_failed" }, { status: r.status || 400 });
  }

  const refreshToken = extractSetCookieValue(r, "refresh_token");
  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  if (refreshToken) {
    c.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });
  }

  return NextResponse.json({ ok: true, user: data.user });
}
