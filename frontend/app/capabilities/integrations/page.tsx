import Link from "next/link";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "App Integrations | ZyncoAI",
  description:
    "How the ZyncoAI connector framework actually works: shared auth per connector, one registry reused across every workflow, and a generic HTTP step for anything without a pre-built connector.",
  alternates: { canonical: "/capabilities/integrations" },
};

export default function IntegrationsCapability() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16 text-[#0f172a]">
      <div className={`${MK.container} max-w-4xl`}>
        <p className="text-sm text-[#94a3b8]">Capability</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">App Integrations</h1>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          A connector is authenticated once and reused by every workflow that needs it — a CRM connection set
          up for one workflow is immediately available to the next, instead of re-entering credentials or
          rewriting API calls each time. Credentials are stored encrypted and scoped to the workflows that
          actually use them.
        </p>
        <p className="mt-4 text-base leading-7 text-[#475569]">
          For anything without a pre-built connector yet, a generic webhook or HTTP step covers it — a
          workflow doesn&apos;t have to wait on a purpose-built connector to talk to an internal tool or a
          less common API.
        </p>
        <p className="mt-6 text-sm leading-6 text-[#475569]">
          See the real connectors already built on the{" "}
          <Link href="/platform/connectors" className="font-medium text-[#0f172a] underline underline-offset-2">
            connector framework
          </Link>{" "}
          page, or the categories they cover on{" "}
          <Link href="/integrations" className="font-medium text-[#0f172a] underline underline-offset-2">
            Integrations
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
