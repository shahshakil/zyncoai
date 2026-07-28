import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function GET() {
  const token = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const r = await backendFetch("/api/admin-auth/me", { headers: { authorization: `Bearer ${token}` } });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return NextResponse.json({ ok: false, error: data?.error || "me_failed" }, { status: r.status });

  return NextResponse.json({ ok: true, admin: data.admin });
}
