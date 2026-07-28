// Forwards the MFA-pending token as a Bearer header (never a cookie the
// browser would auto-send on other requests) to the backend's
// requireMfaPending-guarded /mfa/setup. No session cookies to set here —
// setup only returns a QR code, it doesn't establish a real session.
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { mfaPendingToken } = body || {};
  if (!mfaPendingToken) {
    return NextResponse.json({ ok: false, error: "missing_mfa_pending_token" }, { status: 400 });
  }

  const r = await backendFetch("/api/auth/mfa/setup", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${mfaPendingToken}` },
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) {
    return NextResponse.json({ ok: false, error: data?.error || "mfa_setup_failed" }, { status: r.status || 500 });
  }

  return NextResponse.json({ ok: true, qrDataUrl: data.qrDataUrl, secret: data.secret });
}
