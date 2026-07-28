import { NextResponse } from "next/server";
import type {
  MarketingHomePayload,
  MarketingMetric,
  MarketingConnector,
  MarketingTemplate,
  StoryboardFrame,
  EnterpriseCapability,
} from "@/components/marketing/home3/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type JsonRecord = Record<string, any>;

const DEFAULT_METRICS: MarketingMetric[] = [
  { key: "runs_today", label: "Runs today", value: 1542, suffix: "", note: "workflow executions" },
  { key: "avg_time_saved", label: "Avg time saved / week", value: 17, suffix: "h", note: "per team" },
  { key: "success_rate", label: "Success rate", value: 99.99, suffix: "%", note: "healthy runs" },
  { key: "auto_recovered", label: "Retries auto-recovered", value: 86, suffix: "%", note: "self-healed flows" },
];

const DEFAULT_CONNECTORS: MarketingConnector[] = [
  { id: "slack", name: "Slack", category: "Communication", status: "live" },
  { id: "gmail", name: "Gmail", category: "Email", status: "live" },
  { id: "google-calendar", name: "Google Calendar", category: "Scheduling", status: "live" },
  { id: "hubspot", name: "HubSpot", category: "CRM", status: "live" },
  { id: "salesforce", name: "Salesforce", category: "CRM", status: "live" },
  { id: "stripe", name: "Stripe", category: "Payments", status: "live" },
  { id: "jira", name: "Jira", category: "Ops", status: "live" },
  { id: "notion", name: "Notion", category: "Workspace", status: "live" },
  { id: "postgres", name: "Postgres", category: "Database", status: "live" },
  { id: "webhooks", name: "Webhooks", category: "Infrastructure", status: "live" },
  { id: "redis", name: "Redis", category: "Infrastructure", status: "live" },
  { id: "s3", name: "S3", category: "Storage", status: "live" },
];

const DEFAULT_TEMPLATES: MarketingTemplate[] = [
  {
    id: "lead-routing",
    title: "Lead routing + CRM sync",
    description: "Qualify a lead, route the owner, notify the team, and update CRM records.",
    category: "Sales Ops",
    difficulty: "easy",
    href: "/templates",
  },
  {
    id: "meeting-reminder",
    title: "Meeting reminders + recovery",
    description: "Send reminders, handle no-show follow-up, and keep the calendar workflow tight.",
    category: "Scheduling",
    difficulty: "easy",
    href: "/templates",
  },
  {
    id: "support-triage",
    title: "AI support triage",
    description: "Classify tickets, suggest actions, route cases, and keep auditability visible.",
    category: "Support",
    difficulty: "medium",
    href: "/templates",
  },
  {
    id: "approval-chain",
    title: "Approval chain + safe execution",
    description: "Put sensitive operations behind approvals before actions run in production.",
    category: "Enterprise",
    difficulty: "medium",
    href: "/templates",
  },
  {
    id: "employee-onboarding",
    title: "Internal onboarding workflow",
    description: "Create accounts, notify stakeholders, assign tasks, and confirm completion state.",
    category: "IT Ops",
    difficulty: "advanced",
    href: "/templates",
  },
  {
    id: "renewal-alerts",
    title: "Renewal alerts + reminders",
    description: "Watch dates, trigger reminders, and escalate when action is required.",
    category: "Operations",
    difficulty: "easy",
    href: "/templates",
  },
];

const DEFAULT_STORYBOARD: StoryboardFrame[] = [
  {
    id: "frame-1",
    title: "User submits request",
    subtitle: "Trigger enters the execution surface",
    nodes: ["Lead form", "Webhook", "Calendar", "Slack"],
    outcomes: ["Intent captured", "Run created"],
  },
  {
    id: "frame-2",
    title: "Planner chooses the path",
    subtitle: "Agent selects tools + safe sequence",
    nodes: ["Planner", "Policies", "Connector pick", "Approval rules"],
    outcomes: ["Run plan generated", "Guardrails attached"],
  },
  {
    id: "frame-3",
    title: "Execution runs across tools",
    subtitle: "Actions fire where work already happens",
    nodes: ["CRM", "Email", "Reminder", "Database"],
    outcomes: ["Actions delivered", "Retries applied"],
  },
  {
    id: "frame-4",
    title: "Outcome lands with evidence",
    subtitle: "Every result is visible and operational",
    nodes: ["Audit", "Analytics", "Notification", "Status"],
    outcomes: ["CRM updated", "Audit log written", "Team notified"],
  },
];

const DEFAULT_ENTERPRISE: EnterpriseCapability[] = [
  {
    id: "cap-1",
    title: "Secure execution fabric",
    description: "Run workflows, reminders, agents, and connected actions with stronger operational control.",
  },
  {
    id: "cap-2",
    title: "Org permissions + boundaries",
    description: "Separate access, teams, workflows, and connected systems with clearer governance.",
  },
  {
    id: "cap-3",
    title: "Audit + evidence",
    description: "Track what ran, why it ran, what changed, and how the final outcome was produced.",
  },
  {
    id: "cap-4",
    title: "Approval checkpoints",
    description: "Keep risky or high-trust actions behind human review without slowing the whole system.",
  },
  {
    id: "cap-5",
    title: "WorkflowOps discipline",
    description: "Version, stage, deploy, monitor, and roll back with stronger production confidence.",
  },
  {
    id: "cap-6",
    title: "AgentOps visibility",
    description: "Show how planning, execution, repair, and optimization work together inside one platform.",
  },
];

const DEFAULT_PAYLOAD: MarketingHomePayload = {
  metrics: DEFAULT_METRICS,
  connectors: DEFAULT_CONNECTORS,
  templates: DEFAULT_TEMPLATES,
  storyboard: DEFAULT_STORYBOARD,
  enterpriseCapabilities: DEFAULT_ENTERPRISE,
  proof: {
    headline: "Built for serious operational automation",
    stats: [
      { label: "Run reliability", value: "99.99%" },
      { label: "Avg weekly time saved", value: "17h" },
      { label: "Retries auto-recovered", value: "86%" },
    ],
    logos: [
      "Sales Ops",
      "Support",
      "IT Ops",
      "Finance Ops",
      "Internal Platforms",
      "Enterprise Teams",
    ],
  },
};

async function tryFetchJson(urls: string[]): Promise<JsonRecord | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      continue;
    }
  }
  return null;
}

function baseUrls() {
  const urls = [
    process.env.MARKETING_BACKEND_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
  ].filter(Boolean) as string[];

  return urls.map((u) => u.replace(/\/+$/, ""));
}

function normalizeMetrics(json: any): MarketingMetric[] {
  if (Array.isArray(json?.metrics)) {
    return json.metrics.map((m: any, i: number) => ({
      key: String(m.key ?? `metric_${i}`),
      label: String(m.label ?? "Metric"),
      value: Number(m.value ?? 0),
      suffix: typeof m.suffix === "string" ? m.suffix : "",
      note: typeof m.note === "string" ? m.note : undefined,
    }));
  }
  return DEFAULT_METRICS;
}

function normalizeConnectors(json: any): MarketingConnector[] {
  const arr = json?.connectors ?? json?.items ?? json?.data;
  if (Array.isArray(arr) && arr.length) {
    return arr.slice(0, 24).map((c: any, i: number) => ({
      id: String(c.id ?? c.key ?? c.slug ?? `connector_${i}`),
      name: String(c.name ?? c.title ?? "Connector"),
      category: c.category ? String(c.category) : undefined,
      icon: c.icon ? String(c.icon) : null,
      status:
        c.status === "beta" || c.status === "coming_soon" || c.status === "live"
          ? c.status
          : "live",
    }));
  }
  return DEFAULT_CONNECTORS;
}

function normalizeTemplates(json: any): MarketingTemplate[] {
  const arr = json?.templates ?? json?.items ?? json?.data;
  if (Array.isArray(arr) && arr.length) {
    return arr.slice(0, 12).map((t: any, i: number) => ({
      id: String(t.id ?? t.slug ?? `template_${i}`),
      title: String(t.title ?? t.name ?? "Template"),
      description: String(t.description ?? "Operational workflow template"),
      category: String(t.category ?? "General"),
      difficulty:
        t.difficulty === "easy" || t.difficulty === "medium" || t.difficulty === "advanced"
          ? t.difficulty
          : "medium",
      href: typeof t.href === "string" ? t.href : "/templates",
    }));
  }
  return DEFAULT_TEMPLATES;
}

function normalizeStoryboard(json: any): StoryboardFrame[] {
  const arr = json?.storyboard ?? json?.frames ?? json?.items ?? json?.data;
  if (Array.isArray(arr) && arr.length) {
    return arr.slice(0, 6).map((f: any, i: number) => ({
      id: String(f.id ?? `frame_${i}`),
      title: String(f.title ?? `Frame ${i + 1}`),
      subtitle: typeof f.subtitle === "string" ? f.subtitle : undefined,
      nodes: Array.isArray(f.nodes) ? f.nodes.map(String) : ["Trigger", "Planner", "Execution", "Output"],
      outcomes: Array.isArray(f.outcomes) ? f.outcomes.map(String) : ["Run created", "Outcome produced"],
    }));
  }
  return DEFAULT_STORYBOARD;
}

function normalizeEnterprise(json: any): EnterpriseCapability[] {
  const arr = json?.enterpriseCapabilities ?? json?.capabilities ?? json?.items ?? json?.data;
  if (Array.isArray(arr) && arr.length) {
    return arr.slice(0, 12).map((c: any, i: number) => ({
      id: String(c.id ?? `cap_${i}`),
      title: String(c.title ?? "Capability"),
      description: String(c.description ?? "Enterprise capability"),
    }));
  }
  return DEFAULT_ENTERPRISE;
}

export async function GET() {
  const bases = baseUrls();

  const metricsJson =
    (await tryFetchJson([
      ...bases.map((b) => `${b}/marketing/metrics`),
      ...bases.map((b) => `${b}/api/marketing/metrics`),
      ...bases.map((b) => `${b}/analytics/marketing`),
      ...bases.map((b) => `${b}/api/analytics/marketing`),
    ])) ?? null;

  const connectorsJson =
    (await tryFetchJson([
      ...bases.map((b) => `${b}/connectors/public`),
      ...bases.map((b) => `${b}/api/connectors/public`),
      ...bases.map((b) => `${b}/connectors/registry`),
      ...bases.map((b) => `${b}/api/connectors/registry`),
    ])) ?? null;

  const templatesJson =
    (await tryFetchJson([
      ...bases.map((b) => `${b}/templates/public`),
      ...bases.map((b) => `${b}/api/templates/public`),
      ...bases.map((b) => `${b}/templates/gallery`),
      ...bases.map((b) => `${b}/api/templates/gallery`),
    ])) ?? null;

  const storyboardJson =
    (await tryFetchJson([
      ...bases.map((b) => `${b}/marketing/storyboard`),
      ...bases.map((b) => `${b}/api/marketing/storyboard`),
      ...bases.map((b) => `${b}/workflow-runs/marketing`),
      ...bases.map((b) => `${b}/api/workflow-runs/marketing`),
    ])) ?? null;

  const enterpriseJson =
    (await tryFetchJson([
      ...bases.map((b) => `${b}/marketing/enterprise`),
      ...bases.map((b) => `${b}/api/marketing/enterprise`),
      ...bases.map((b) => `${b}/platform/capabilities`),
      ...bases.map((b) => `${b}/api/platform/capabilities`),
    ])) ?? null;

  const payload: MarketingHomePayload = {
    metrics: metricsJson ? normalizeMetrics(metricsJson) : DEFAULT_PAYLOAD.metrics,
    connectors: connectorsJson ? normalizeConnectors(connectorsJson) : DEFAULT_PAYLOAD.connectors,
    templates: templatesJson ? normalizeTemplates(templatesJson) : DEFAULT_PAYLOAD.templates,
    storyboard: storyboardJson ? normalizeStoryboard(storyboardJson) : DEFAULT_PAYLOAD.storyboard,
    enterpriseCapabilities: enterpriseJson
      ? normalizeEnterprise(enterpriseJson)
      : DEFAULT_PAYLOAD.enterpriseCapabilities,
    proof: DEFAULT_PAYLOAD.proof,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
