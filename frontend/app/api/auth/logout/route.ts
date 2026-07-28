import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/backendAuth";

export async function POST() {
  const c = cookies();
  const refresh = c.get(REFRESH_COOKIE)?.value;
  const access = c.get(ACCESS_COOKIE)?.value;

  await backendFetch("/api/auth/logout", {
    method: "POST",
    refreshToken: refresh,
    headers: access ? { authorization: `Bearer ${access}` } : undefined,
  }).catch(() => {});

  c.delete(ACCESS_COOKIE);
  c.delete(REFRESH_COOKIE);

  return NextResponse.json({ ok: true });
}
