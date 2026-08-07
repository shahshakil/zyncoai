// Consumes the impersonation token minted by
// POST /api/admin/platform/businesses/:id/impersonate (aud="impersonation",
// 30-min sliding / 60-min absolute TTL — see impersonationSession.ts) and
// sets it as this frontend's normal ACCESS_COOKIE, same-origin — so "View
// dashboard as this business" never puts the token in a URL (browser
// history / referrer headers). Requires an active admin session so a
// stolen tenant session can't be used to forge an impersonation cookie the
// other way around. The session's lifetime is governed entirely by the
// server-side ImpersonationSession (revocable, expires on its own), not by
// a refresh cookie — which is why this ALSO clears REFRESH_COOKIE
// explicitly, not just leaves it unset. 2026-08-07 incident: if the
// browser already held a real tenant REFRESH_COOKIE (e.g. the admin was
// separately logged into a real account, or one was left over from an
// earlier normal session), any later 401 anywhere in the app would trigger
// the business/me-proxy's or auth/me-proxy's tryRefresh() — which reads
// REFRESH_COOKIE, not knowing an impersonation session is in progress —
// and silently swap ACCESS_COOKIE for a real, non-impersonated session
// with none of impersonation's restrictions. Clearing it here removes the
// only thing that refresh could have used.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, ACCESS_COOKIE_MAX_AGE, ADMIN_ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const adminToken = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!adminToken) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const { token } = await req.json().catch(() => ({}));
  if (!token || typeof token !== "string") return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });

  const c = cookies();
  c.set(ACCESS_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  c.delete(REFRESH_COOKIE);
  return NextResponse.json({ ok: true });
}
