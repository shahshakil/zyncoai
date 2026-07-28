import Link from "next/link";

const Col = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; badge?: string }[];
}) => (
  <div>
    <div className="text-sm font-semibold text-zinc-900">{title}</div>
    <ul className="mt-3 space-y-2 text-sm text-zinc-600">
      {links.map((l) => (
        <li key={l.label} className="flex items-center gap-2">
          <Link className="hover:text-zinc-900" href={l.href}>
            {l.label}
          </Link>
          {l.badge ? (
            <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600">
              {l.badge}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  </div>
);

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="h-10 w-10 rounded-xl border border-zinc-200 bg-white grid place-items-center font-semibold">
              Z
            </div>
            <p className="mt-4 text-sm text-zinc-600">
              ZyncoAI is an enterprise automation platform with AgentOps, WorkflowOps,
              governance, and real-time observability.
            </p>
          </div>

          <Col
            title="Company"
            links={[
              { label: "Careers", href: "/careers", badge: "Soon" },
              { label: "Contact us", href: "/contact" },
              { label: "Partners", href: "/partners" },
              { label: "Press", href: "/press" },
            ]}
          />

          <Col
            title="Product"
            links={[
              { label: "Platform", href: "/platform" },
              { label: "AgentOps", href: "/agentops" },
              { label: "WorkflowOps", href: "/workflowops" },
              { label: "AI Brain", href: "/brain" },
              { label: "Enterprise", href: "/enterprise" },
            ]}
          />

          <Col
            title="Resources"
            links={[
              { label: "Documentation", href: "/docs" },
              { label: "Help center", href: "/help" },
              { label: "API reference", href: "/api" },
              { label: "Example workflows", href: "/templates" },
            ]}
          />

          <Col
            title="Legal"
            links={[
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Cookies", href: "/cookies" },
              { label: "Disclaimer", href: "/disclaimer" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} ZyncoAI. All rights reserved.</div>
          <div className="flex gap-4">
            <Link className="hover:text-zinc-900" href="/terms">
              Terms
            </Link>
            <Link className="hover:text-zinc-900" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-zinc-900" href="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
