// Was gated on a `zyn_refresh` cookie that login never actually set (the
// legacy backend it called never returned a refresh token), so this 401'd
// unconditionally even before hitting the (also nonexistent) legacy
// /auth/refresh route. The real backend's /api/auth/refresh reads the
// refresh token from a `refresh_token` cookie it expects on the request —
// we forward our own re-issued copy of that value explicitly since the
// browser's cookie for this domain is ours, not the backend's.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, extractSetCookieValue, getClientIp, ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const refresh = cookies().get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.json({ ok: false, error: "no_refresh" }, { status: 401 });
  }

  const r = await backendFetch("/api/auth/refresh", { method: "POST", refreshToken: refresh, clientIp: getClientIp(req) });
  const data = await r.json().catch(() => ({}));

  if (!r.ok || !data?.access_token) {
    cookies().delete(ACCESS_COOKIE);
    cookies().delete(REFRESH_COOKIE);
    return NextResponse.json({ ok: false, error: data?.error || "refresh_failed" }, { status: 401 });
  }

  const c = cookies();
  c.set(ACCESS_COOKIE, data.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ACCESS_COOKIE_MAX_AGE });

  const rotated = extractSetCookieValue(r, "refresh_token");
  if (rotated) {
    c.set(REFRESH_COOKIE, rotated, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: REFRESH_COOKIE_MAX_AGE });
  }

  return NextResponse.json({ ok: true });
}
