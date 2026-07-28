import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const email = String(form.get("email") ?? "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    // TODO later: save to DB / send to email tool
    return NextResponse.redirect(new URL("/enterprise?subscribed=1", req.url));
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Subscribe failed" },
      { status: 500 }
    );
  }
}
