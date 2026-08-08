import { NextResponse } from "next/server";
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

export async function GET(req: Request) {
  const clientIp = getClientIp(req);
  let access = cookies().get(ACCESS_COOKIE)?.value;
  if (!access) {
    access = (await tryRefresh(clientIp)) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  let r = await backendFetch("/api/auth/me", { headers: { authorization: `Bearer ${access}` }, clientIp });
  if (r.status === 401) {
    access = (await tryRefresh(clientIp)) || undefined;
    if (!access) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    r = await backendFetch("/api/auth/me", { headers: { authorization: `Bearer ${access}` }, clientIp });
  }

  const data = await r.json().catch(() => ({}));
  if (!r.ok) return NextResponse.json({ ok: false, error: data?.error || "me_failed" }, { status: r.status });

  // impersonation (set only for admin "view as business" sessions — see
  // backend auth/index.ts's /me handler) was previously dropped here since
  // this route hand-picked just `user` off the backend response. DashboardGate
  // gates its entire impersonation branch on this field being present, so
  // losing it silently made every impersonated dashboard load behave as a
  // normal session — wrong onboarding-status call, no banner, ever.
  return NextResponse.json({ ok: true, user: data.user, impersonation: data.impersonation ?? null });
}
