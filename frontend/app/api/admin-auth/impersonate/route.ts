// Consumes the short-lived tenant access token minted by
// POST /api/admin/platform/businesses/:id/impersonate and sets it as this
// frontend's normal ACCESS_COOKIE, same-origin — so "View as Owner" never
// puts the token in a URL (browser history / referrer headers). Requires
// an active admin session so a stolen tenant session can't be used to
// forge an impersonation cookie the other way around. Deliberately sets
// no refresh cookie: the session expires with the 15-minute token and
// cannot be silently renewed.
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
