import Link from "next/link";
import { SimplePage } from "@/components/marketing/SimplePage";
import { MK } from "@/styles/marketingTokens";

export const metadata = {
  title: "Templates | ZyncoAI",
  description:
    "Start a workflow from a working starting point instead of a blank canvas — lead routing, reporting, incident triage, and approval flows.",
  alternates: { canonical: "/templates", languages: { "en-AU": "/templates", en: "/templates" } },
};

const STARTING_POINTS = [
  { title: "Lead routing", body: "Enrich a new lead and route it to the right rep based on territory or deal size, with a follow-up scheduled automatically.", href: "/use-cases" },
  { title: "Reporting & reconciliation", body: "Pull data from wherever it lives on a schedule and roll it into a report, instead of a manual weekly copy-paste.", href: "/use-cases" },
  { title: "Incident triage", body: "Check an alert against known patterns before it reaches a human, and add context for whoever's on call.", href: "/use-cases" },
  { title: "Approval flow", body: "Route a request that needs sign-off to the right approver with context already assembled.", href: "/use-cases" },
];

export default function TemplatesPage() {
  return (
    <>
      <SimplePage title="Templates" subtitle="Start from production-ready automation recipes." />
      <section className={`${MK.container} pb-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {STARTING_POINTS.map((s) => (
            <div key={s.title} className={`${MK.card} p-6`}>
              <h2 className="text-lg font-semibold text-[#0f172a]">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569]">
          A template is a real workflow definition against the{" "}
          <Link href="/platform/connectors" className="font-medium text-[#0f172a] underline underline-offset-2">
            connector registry
          </Link>
          , not a mockup — clone it, swap the connectors for the ones you actually use, and it runs. See the
          full pattern breakdown on{" "}
          <Link href="/use-cases" className="font-medium text-[#0f172a] underline underline-offset-2">
            Use Cases
          </Link>
          , or start from scratch in{" "}
          <Link href="/workflowops" className="font-medium text-[#0f172a] underline underline-offset-2">
            WorkflowOps
          </Link>
          .
        </p>
      </section>
    </>
  );
}
