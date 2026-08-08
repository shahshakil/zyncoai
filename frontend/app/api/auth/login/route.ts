// Was calling ${base}/auth/login — the legacy, pre-hardening auth
// microservice (opaque session ids, no lockout/device-limit/refresh
// support). The real system is the JWT-based /api/auth/* router built in
// the backend hardening pass; see src/lib/backendAuth.ts for why the
// refresh_token cookie is re-issued rather than relayed verbatim.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, extractSetCookieValue, getClientIp, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password, captchaToken } = body || {};

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "missing_credentials" }, { status: 400 });
  }

  const r = await backendFetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, captchaToken }),
    clientIp: getClientIp(req),
  });

  const data = await r.json().catch(() => ({}));

  // MFA-pending: the backend deliberately withholds a real access token
  // until MFA clears — this is a success response, not a failure, and must
  // not fall into the error branch below or the pending token gets lost.
  if (r.ok && data?.ok && (data.mfaRequired || data.mfaSetupRequired)) {
    return NextResponse.json({
      ok: true,
      mfaRequired: !!data.mfaRequired,
      mfaSetupRequired: !!data.mfaSetupRequired,
      mfa_pending_token: data.mfa_pending_token,
    });
  }

  if (!r.ok || !data?.access_token) {
    return NextResponse.json(
      { ok: false, error: data?.error || "login_failed", message: data?.message, requiresCaptcha: data?.error === "captcha_required" },
      { status: r.status || 401 }
    );
  }

  const refreshToken = extractSetCookieValue(r, "refresh_token");
  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });
  if (refreshToken) {
    c.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });
  }

  return NextResponse.json({ ok: true, user: data.user });
}
