// Forwards a Bearer token to the backend's requireMfaSetupAuth-guarded
// /mfa/setup. No session cookies to set here — setup only returns a QR
// code, it doesn't establish a real session.
//
// 2026-08-07 — mfaPendingToken now optional, falling back to the caller's
// own ACCESS_COOKIE (self-service enrollment from an existing session —
// see the matching comment in ../verify/route.ts).
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, getClientIp, ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { mfaPendingToken } = body || {};
  const bearer = mfaPendingToken || cookies().get(ACCESS_COOKIE)?.value;
  if (!bearer) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  const r = await backendFetch("/api/auth/mfa/setup", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${bearer}` },
    clientIp: getClientIp(req),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) {
    return NextResponse.json({ ok: false, error: data?.error || "mfa_setup_failed" }, { status: r.status || 500 });
  }

  return NextResponse.json({ ok: true, qrDataUrl: data.qrDataUrl, secret: data.secret });
}
