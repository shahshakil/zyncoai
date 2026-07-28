// Completes MFA enrollment — on success the backend returns a real
// access_token exactly like /api/auth/login does, so this sets the same
// zyn_access/zyn_refresh cookies via the same extraction pattern as
// app/api/auth/login/route.ts. Also returns the one-time backup codes
// (never persisted in plaintext, never shown again after this response).
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, extractSetCookieValue, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { mfaPendingToken, code } = body || {};
  if (!mfaPendingToken || !code) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const r = await backendFetch("/api/auth/mfa/verify", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${mfaPendingToken}` },
    body: JSON.stringify({ code }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.access_token) {
    return NextResponse.json({ ok: false, error: data?.error || "mfa_verify_failed" }, { status: r.status || 401 });
  }

  const refreshToken = extractSetCookieValue(r, "refresh_token");
  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  if (refreshToken) {
    c.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });
  }

  return NextResponse.json({ ok: true, user: data.user, backupCodes: data.backupCodes });
}
