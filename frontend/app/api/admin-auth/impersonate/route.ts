// Consumes the impersonation token minted by
// POST /api/admin/platform/businesses/:id/impersonate (aud="impersonation",
// 30-min sliding / 60-min absolute TTL — see impersonationSession.ts) and
// sets it as this frontend's normal ACCESS_COOKIE, same-origin — so "View
// dashboard as this business" never puts the token in a URL (browser
// history / referrer headers). Requires an active admin session so a
// stolen tenant session can't be used to forge an impersonation cookie the
// other way around. Deliberately sets no refresh cookie: the session's
// lifetime is governed entirely by the server-side ImpersonationSession
// (revocable, expires on its own), not by anything this cookie could
// silently renew.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, ACCESS_COOKIE_MAX_AGE, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const adminToken = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!adminToken) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const { token } = await req.json().catch(() => ({}));
  if (!token || typeof token !== "string") return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });

  cookies().set(ACCESS_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  return NextResponse.json({ ok: true });
}
