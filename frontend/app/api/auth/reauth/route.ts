import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, ACCESS_COOKIE } from "@/lib/backendAuth";

export async function POST(req: Request) {
  const access = cookies().get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const r = await backendFetch("/api/auth/reauth", {
    method: "POST",
    headers: { authorization: `Bearer ${access}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
