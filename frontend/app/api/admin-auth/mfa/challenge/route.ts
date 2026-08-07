// Login-time MFA step — completes what /api/admin-auth/login started when
// it returned { mfaRequired: true, mfa_pending_token } instead of a real
// session. No ADMIN_ACCESS_COOKIE exists yet at this point (that's exactly
// what's pending), so auth here is the short-lived mfa_pending_token the
// client got back from /login, not a cookie — same shape as the login
// route's own credential handling.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { code, mfa_pending_token } = body || {};
  if (!code || !mfa_pending_token) {
    return NextResponse.json({ ok: false, error: "missing_code_or_token" }, { status: 400 });
  }

  const r = await backendFetch("/api/admin-auth/mfa/challenge", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${mfa_pending_token}` },
    body: JSON.stringify({ code }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.admin_token) {
    return NextResponse.json({ ok: false, error: data?.error || "mfa_challenge_failed" }, { status: r.status || 401 });
  }

  cookies().set(ADMIN_ACCESS_COOKIE, data.admin_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 29 * 60 });

  return NextResponse.json({ ok: true, admin: data.admin });
}
