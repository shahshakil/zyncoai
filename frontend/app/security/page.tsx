import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Security | ZyncoAI",
  description:
    "RBAC, immutable audit logs, encrypted secrets, and SSO/SCIM controls — how ZyncoAI limits who can do what and records what actually happened.",
  alternates: { canonical: "/security", languages: { "en-AU": "/security", en: "/security" } },
};

const CONTROLS = [
  {
    title: "Role-based access control",
    body: "Every user has a role that determines what they can view, run, or change. A support rep and an admin looking at the same workflow see different actions available to them — enforced server-side, not just hidden in the UI.",
  },
  {
    title: "Immutable audit logs",
    body: "Every run, tool call, and configuration change is recorded with who did it and when. Logs aren't editable after the fact, and can be exported to a SIEM for teams that need automation activity in their existing security tooling.",
  },
  {
    title: "Secrets management",
    body: "API keys and credentials used by a connector are stored encrypted, never exposed in workflow definitions or logs, and scoped to the workflows that actually need them rather than shared globally.",
  },
  {
    title: "SSO & SCIM",
    body: "SAML/OIDC single sign-on and SCIM-based provisioning mean access follows whatever your identity provider already says about an employee — deprovision them there, and their ZyncoAI access goes with it.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <SimplePage title="Security" subtitle="RBAC, audit trails, secrets, and enterprise controls." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {CONTROLS.map((c) => (
            <div key={c.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{c.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          Security controls and governance policy are related but different things — access and audit logging
          live here, while approval rules and change tracking for what a workflow is allowed to do live under{" "}
          <Link href="/governance" className="font-medium text-[#0f172a] underline underline-offset-2">
            Governance
          </Link>
          . For the full compliance picture — data residency, retention policies, and SIEM export — see{" "}
          <Link href="/enterprise" className="font-medium text-[#0f172a] underline underline-offset-2">
            Enterprise
          </Link>
          .
        </p>
      </section>
    </>
  );
}
