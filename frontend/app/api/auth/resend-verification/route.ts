// src/app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email } = body || {};

  if (!email) {
    return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ ok: false, error: "api_base_missing" }, { status: 500 });
  }

  // /api/auth/... not /auth/... — see verify-email/page.tsx's comment: a
  // dead legacy nginx block on api.zyncoai.com intercepts bare /auth/*
  // paths and 502s them before they reach the real backend.
  const r = await fetch(`${base}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error || "resend_failed", message: data?.message || "Resend failed" },
      { status: r.status }
    );
  }

  return NextResponse.json({ ok: true });
}
