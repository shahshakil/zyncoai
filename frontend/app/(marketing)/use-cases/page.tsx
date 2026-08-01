import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = {
  title: "Use Cases | ZyncoAI",
  description:
    "How teams use ZyncoAI to automate lead routing, reporting, incident response, and approvals — with agents handling the steps that need judgment.",
  alternates: { canonical: "/use-cases", languages: { "en-AU": "/use-cases", en: "/use-cases" } },
};

const PATTERNS = [
  {
    title: "Lead routing & follow-up",
    body: "A new lead comes in, gets enriched, and is routed to the right rep based on territory, deal size, or what they actually asked about — with a follow-up scheduled automatically instead of sitting in a queue.",
  },
  {
    title: "Reporting & reconciliation",
    body: "Data gets pulled from wherever it actually lives — a CRM, a spreadsheet, a support tool — and rolled into a report on a schedule, instead of someone manually copying numbers into Sheets every Monday.",
  },
  {
    title: "Incident & alert triage",
    body: "An alert fires, an agent checks what actually changed and whether it matches a known pattern, and either resolves it, adds context for whoever's on call, or escalates — cutting the time between 'something's wrong' and 'someone who can fix it knows why.'",
  },
  {
    title: "Approvals & sign-off",
    body: "A request that needs a human decision — a discount, a refund, a policy exception — gets routed to the right approver with the context already assembled, instead of a Slack thread of back-and-forth to figure out who owns it.",
  },
];

export default function UseCasesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Use Cases", href: "/use-cases" }]} />
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Use Cases</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          What teams actually automate first
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          The workflows teams start with tend to share a shape: something repetitive enough to be worth
          automating, but with at least one step that needs judgment rather than a fixed rule — which is why
          they&apos;re usually built as a mix of deterministic steps in <Link href="/workflowops" className="font-medium text-neutral-900 underline underline-offset-2">WorkflowOps</Link> and
          agent-handled decisions in <Link href="/agentops" className="font-medium text-neutral-900 underline underline-offset-2">AgentOps</Link>,
          not one or the other.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PATTERNS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-950">By team</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
          See how marketing teams specifically use ZyncoAI for lead routing, campaign ops, and reporting.
        </p>
        <Link href="/use-cases/marketing-teams" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-brand">
          Marketing teams <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
