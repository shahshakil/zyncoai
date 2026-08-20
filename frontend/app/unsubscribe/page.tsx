import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/marketing-api";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// 2026-08-18 — fixes a real dead link: every transactional email template
// (lib/email/layout.ts, welcomeEmail.ts) links to ${FRONTEND_URL}/unsubscribe,
// but no page existed here — a 404. The real unsubscribe logic already
// exists and works on the backend (api/routes/public/promo.ts's GET
// /unsubscribe, HMAC-token verified via lib/unsubscribeToken.ts, writes to
// the real EmailUnsubscribe suppression table that every future send
// checks). This page doesn't reimplement that — it's a thin, honest
// redirect to the real handler, so there's exactly one unsubscribe
// implementation, not two that can drift apart.
export default function UnsubscribePage({ searchParams }: { searchParams: { email?: string; token?: string } }) {
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (email && token) {
    redirect(`${API_BASE}/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-[#0f172a]">Unsubscribe</h1>
      <p className="mt-4 text-[#475569]">
        This link is missing the information needed to identify which address to unsubscribe. Please use the
        unsubscribe link from the specific email you received, or email{" "}
        <a href="mailto:support@zyncoai.com" className="text-[#6366f1] underline underline-offset-4 hover:text-[#4f46e5]">
          support@zyncoai.com
        </a>{" "}
        and we&apos;ll remove you directly.
      </p>
      <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50">
        Back to ZyncoAI
      </Link>
    </div>
  );
}
