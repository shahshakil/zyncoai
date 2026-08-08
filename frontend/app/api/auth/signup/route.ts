// Was calling ${base}/auth/signup — the legacy service has no /signup
// route at all (only /register), so this 404'd unconditionally. Points at
// the real hardened signup now.
import { NextResponse } from "next/server";
import { backendFetch, getClientIp } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password, name, captchaToken } = body || {};

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const r = await backendFetch("/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, name, captchaToken }),
    clientIp: getClientIp(req),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: data?.error || "signup_failed",
        message: data?.message,
        details: data?.details, // Zod's flatten() shape, e.g. from a rejected weak password on the /api/auth/signup Zod schema
        requiresCaptcha: data?.error === "captcha_required",
      },
      { status: r.status }
    );
  }

  return NextResponse.json({ ok: true, message: data.message, user: data.user });
}
