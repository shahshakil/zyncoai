import Link from "next/link";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Secure Execution",
  description:
    "How workflow runs are isolated from each other, how session controls limit what a user can do mid-run, and how RBAC and audit logs cover execution end to end.",
  alternates: { canonical: "/capabilities/security", languages: { "en-AU": "/capabilities/security", en: "/capabilities/security" } },
};

export default function SecurityCapability() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16 text-[#0f172a]">
      <div className={`${MK.container} max-w-4xl`}>
        <p className="text-sm text-[#94a3b8]">Capability</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Secure Execution</h1>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          Each workflow run is isolated from every other run — one run&apos;s failure, retry, or bad input
          can&apos;t leak into or block a different run, even if they share the same connectors and
          credentials underneath.
        </p>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          Session controls apply the same role-based limits to a live user session as to an automated run: a
          user who can&apos;t approve a refund in the UI can&apos;t trigger one through a workflow either. Every
          action — human or automated — is checked against the same permission model and lands in the same
          audit log.
        </p>
        <p className="mt-6 text-sm leading-6 text-[#475569]">
          For the full access-control and audit-log picture, see{" "}
          <Link href="/security" className="font-medium text-[#0f172a] underline underline-offset-2">
            Security
          </Link>
          . For approval rules and policy guardrails, see{" "}
          <Link href="/governance" className="font-medium text-[#0f172a] underline underline-offset-2">
            Governance
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
