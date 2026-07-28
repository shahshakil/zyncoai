// Super-admin login — entirely separate cookie/token from the tenant-user
// zyn_access/zyn_refresh pair (see src/lib/backendAuth.ts header comment on
// the /api/auth/* routes). No refresh flow: the backend issues a flat
// 30-minute admin JWT and expects re-login after that, by design.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "missing_credentials" }, { status: 400 });
  }

  const r = await backendFetch("/api/admin-auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.admin_token) {
    return NextResponse.json({ ok: false, error: data?.error || "login_failed" }, { status: r.status || 401 });
  }

  cookies().set(ADMIN_ACCESS_COOKIE, data.admin_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 29 * 60 });

  return NextResponse.json({ ok: true, admin: data.admin });
}
