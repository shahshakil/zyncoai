import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // If you already have backend endpoint, set it in .env.local:
    // NEXT_PUBLIC_API_BASE_URL=https://api.zyncoai.com (example)
    // ZYNCOAI_SITE_TOKEN=... (random token you generate)
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "";

    const siteToken = process.env.ZYNCOAI_SITE_TOKEN || "";

    // If backend not configured yet, fall back to a smarter echo (so you see it reading the user message)
    if (!baseUrl || !siteToken) {
      return NextResponse.json({
        reply:
          `I read: "${message}". ` +
          `To enable real AI replies, set NEXT_PUBLIC_API_BASE_URL + ZYNCOAI_SITE_TOKEN in .env.local.`,
      });
    }

    const r = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/site-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-site-token": siteToken, // your backend should verify this
      },
      body: JSON.stringify({ message, history }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json(
        { reply: "Chat is temporarily unavailable. Try again in a moment.", detail: txt },
        { status: 502 }
      );
    }

    const data = await r.json().catch(() => ({}));
    const reply = typeof data?.reply === "string" ? data.reply : null;

    return NextResponse.json({
      reply: reply || "Thanks — tell me a bit more and I’ll help.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
