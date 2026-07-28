// src/app/api/auth/forgot/route.ts
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

  // ✅ CHANGE THIS PATH if your backend uses different route
  const r = await fetch(`${base}/auth/forgot-password`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error || "forgot_failed", message: data?.message || "Request failed" },
      { status: r.status }
    );
  }

  return NextResponse.json({ ok: true });
}
