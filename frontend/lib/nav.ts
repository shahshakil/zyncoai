export type NavLink = { label: string; href: string; description?: string; badge?: string };

export type MegaSection = {
  title: string;
  description?: string;
  links: NavLink[];
};

export type MegaMenu = {
  key: "product" | "solutions" | "resources";
  label: string;
  href: string;
  sections: MegaSection[];
  cta: { title: string; description: string; href: string; actionLabel: string };
};

export const topNav = [
  { label: "Product", href: "/product", key: "product" as const },
  { label: "Solutions", href: "/solutions", key: "solutions" as const },
  { label: "Resources", href: "/resources", key: "resources" as const },
  { label: "Docs", href: "/docs" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
];

export const megaMenus: MegaMenu[] = [
  {
    key: "product",
    label: "Product",
    href: "/product",
    sections: [
      {
        title: "Core Platform",
        links: [
          { label: "AI Workflows", href: "/product#ai-workflows", description: "Multi-step automations with guardrails." },
          { label: "Agents", href: "/product#agents", description: "Autonomous agents with approvals + memory.", badge: "New" },
          { label: "Integrations", href: "/integrations", description: "Connect apps, DBs, SaaS, internal tools." },
          { label: "Templates", href: "/templates", description: "Start fast with ready-made automations." },
        ],
      },
      {
        title: "Developer + Ops",
        links: [
          { label: "Webhooks & Events", href: "/product#events", description: "Real-time triggers and event bus." },
          { label: "Observability", href: "/product#observability", description: "Runs, logs, traces, alerts." },
          { label: "Environments", href: "/product#environments", description: "Dev/stage/prod with policies." },
        ],
      },
      {
        title: "Enterprise",
        links: [
          { label: "RBAC + SSO", href: "/security#rbac", description: "Teams, roles, SSO, SCIM." },
          { label: "Audit Trails", href: "/security#audit", description: "Every action, every approval." },
          { label: "Data Controls", href: "/security#data", description: "Encryption, retention, vaults." },
        ],
      },
    ],
    cta: {
      title: "See ZyncoAI in action",
      description: "Explore a realistic demo experience: workflows, templates, integrations, and approvals.",
      href: "/product",
      actionLabel: "Open product overview",
    },
  },
  {
    key: "solutions",
    label: "Solutions",
    href: "/solutions",
    sections: [
      {
        title: "By Team",
        links: [
          { label: "Sales", href: "/solutions#sales", description: "Lead routing, enrichment, CRM automation." },
          { label: "Support", href: "/solutions#support", description: "Ticket triage, auto-responses, escalations." },
          { label: "IT + SecOps", href: "/solutions#it", description: "Provisioning, alerts, incident response." },
          { label: "Marketing", href: "/solutions#marketing", description: "Campaign ops, content pipelines, analytics." },
        ],
      },
      {
        title: "By Use Case",
        links: [
          { label: "Lead Management", href: "/solutions#lead", description: "Score, route, schedule, close." },
          { label: "Approvals", href: "/solutions#approvals", description: "Human-in-the-loop governance." },
          { label: "Data Sync", href: "/solutions#sync", description: "Sync apps + warehouses safely." },
          { label: "AI Assistants", href: "/solutions#assistants", description: "Agents that do work, not just chat." },
        ],
      },
      {
        title: "Industries",
        links: [
          { label: "E-commerce", href: "/solutions#ecom" },
          { label: "SaaS", href: "/solutions#saas" },
          { label: "Finance", href: "/solutions#finance" },
          { label: "Healthcare", href: "/solutions#health" },
        ],
      },
    ],
    cta: {
      title: "Build your first production workflow",
      description: "Start from a template and deploy with approvals, retries, and observability.",
      href: "/templates",
      actionLabel: "Browse templates",
    },
  },
  {
    key: "resources",
    label: "Resources",
    href: "/resources",
    sections: [
      {
        title: "Learn",
        links: [
          { label: "Guides", href: "/resources#guides", description: "Best practices & playbooks." },
          { label: "Webinars", href: "/resources#webinars", description: "Watch live or on-demand." },
          { label: "Customer Stories", href: "/resources#stories", description: "Real teams, real results." },
        ],
      },
      {
        title: "Build",
        links: [
          { label: "Developer Docs", href: "/docs", description: "APIs, SDKs, self-hosting." },
          { label: "Security Overview", href: "/security", description: "Compliance, auditability, controls." },
          { label: "Integrations Directory", href: "/integrations", description: "Apps + connectors." },
        ],
      },
      {
        title: "Compare",
        links: [
          { label: "Why ZyncoAI", href: "/resources#why" },
          { label: "Migration", href: "/resources#migration" },
          { label: "FAQ", href: "/resources#faq" },
        ],
      },
    ],
    cta: {
      title: "Want a custom demo?",
      description: "We’ll map your real processes and show an end-to-end automation plan.",
      href: "/resources",
      actionLabel: "Talk to sales",
    },
  },
];

export type TemplateItem = {
  title: string;
  category: string;
  difficulty: "Starter" | "Intermediate" | "Advanced";
  minutes: number;
  href: string;
  description: string;
};

export const templateCategories = [
  "Sales",
  "Support",
  "IT & SecOps",
  "Marketing",
  "Data & Analytics",
  "Finance",
  "HR",
  "Developer",
];

export const templates: TemplateItem[] = [
  {
    title: "AI Lead Router + Enrichment + Approval",
    category: "Sales",
    difficulty: "Advanced",
    minutes: 12,
    href: "/templates/ai-lead-router",
    description: "Score inbound leads, enrich, route, request approval, create deal, notify Slack.",
  },
  {
    title: "Support Triage Agent (Zendesk/Jira) + Escalations",
    category: "Support",
    difficulty: "Intermediate",
    minutes: 9,
    href: "/templates/support-triage",
    description: "Classify tickets, draft replies, escalate, auto-tag, update CRM fields.",
  },
  {
    title: "SecOps: Alert → Investigation → PagerDuty",
    category: "IT & SecOps",
    difficulty: "Advanced",
    minutes: 14,
    href: "/templates/secops-alert",
    description: "Correlate alerts, run playbook, attach evidence, trigger incident workflow.",
  },
  {
    title: "Marketing Content Pipeline (Brief → Draft → Review → Publish)",
    category: "Marketing",
    difficulty: "Intermediate",
    minutes: 10,
    href: "/templates/content-pipeline",
    description: "Generate drafts, request review, schedule publish, track performance.",
  },
];

export type IntegrationItem = {
  name: string;
  category: string;
  href: string;
  description: string;
  badge?: string;
};

export const integrationCategories = [
  "CRM",
  "Support",
  "Chat",
  "Email",
  "Databases",
  "Cloud",
  "Dev Tools",
  "Sheets",
  "Payments",
  "AI",
];

export const integrations: IntegrationItem[] = [
  { name: "Slack", category: "Chat", href: "/integrations/slack", description: "Notify, collect approvals, trigger workflows." },
  { name: "Google Sheets", category: "Sheets", href: "/integrations/google-sheets", description: "Sync rows, validate data, enrich automatically." },
  { name: "HubSpot", category: "CRM", href: "/integrations/hubspot", description: "Create/update contacts, deals, pipelines." },
  { name: "Salesforce", category: "CRM", href: "/integrations/salesforce", description: "Enterprise CRM workflows and governance.", badge: "Enterprise" },
  { name: "Jira", category: "Dev Tools", href: "/integrations/jira", description: "Create issues, automate triage, update statuses." },
  { name: "Postgres", category: "Databases", href: "/integrations/postgres", description: "Read/write safely with policies + auditing." },
  { name: "AWS", category: "Cloud", href: "/integrations/aws", description: "Events, storage, queues, and secure automation." },
  { name: "Stripe", category: "Payments", href: "/integrations/stripe", description: "Invoices, billing events, revenue operations." },
  { name: "OpenAI", category: "AI", href: "/integrations/openai", description: "LLM actions with tools + guardrails." },
];
