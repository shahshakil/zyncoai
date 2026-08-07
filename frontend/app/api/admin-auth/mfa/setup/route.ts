// Step 1 of admin MFA self-enrollment — requires an already-logged-in admin
// (ADMIN_ACCESS_COOKIE), matches the pattern in ../../me/route.ts. Does not
// enable MFA yet, just generates and returns the QR/secret; see ../verify.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST() {
  const token = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const r = await backendFetch("/api/admin-auth/mfa/setup", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return NextResponse.json({ ok: false, error: data?.error || "mfa_setup_failed" }, { status: r.status });

  return NextResponse.json({ ok: true, qrDataUrl: data.qrDataUrl, secret: data.secret });
}
