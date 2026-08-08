// Step 2 of admin MFA self-enrollment — confirms the admin can produce a
// real code from the secret ../setup just issued, then flips mfaEnabled on
// and returns one-time backup codes (shown exactly once, never retrievable
// again — the UI must make the admin save these before dismissing).
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, getClientIp, ADMIN_ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const token = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { code } = body || {};
  if (!code) return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });

  const r = await backendFetch("/api/admin-auth/mfa/verify", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ code }),
    clientIp: getClientIp(req),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return NextResponse.json({ ok: false, error: data?.error || "mfa_verify_failed" }, { status: r.status });

  return NextResponse.json({ ok: true, backupCodes: data.backupCodes });
}
