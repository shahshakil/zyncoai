export type FloatingApp = {
  id: string;
  label: string;
  short: string;
  x: number;
  y: number;
  delay: number;
};

export type StoryNode = {
  id: string;
  title: string;
  sub: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  accent?: "purple" | "pink" | "blue" | "green" | "amber";
};

export type StoryLine = {
  from: string;
  to: string;
};

export const floatingApps: FloatingApp[] = [
  { id: "slack", label: "Slack", short: "S", x: 12, y: 72, delay: 0.1 },
  { id: "gmail", label: "Gmail", short: "G", x: 24, y: 24, delay: 0.3 },
  { id: "calendar", label: "Calendar", short: "C", x: 79, y: 20, delay: 0.5 },
  { id: "hubspot", label: "HubSpot", short: "H", x: 86, y: 70, delay: 0.2 },
  { id: "stripe", label: "Stripe", short: "St", x: 66, y: 84, delay: 0.45 },
  { id: "drive", label: "Drive", short: "D", x: 36, y: 88, delay: 0.25 },
];

export const workflowNodes: StoryNode[] = [
  {
    id: "request",
    title: "User submits request",
    sub: "Lead form · webhook · inbox",
    x: 6,
    y: 18,
    w: 24,
    h: 12,
    accent: "purple",
  },
  {
    id: "planner",
    title: "AI Planner",
    sub: "Plans actions + selects tools",
    x: 36,
    y: 11,
    w: 22,
    h: 12,
    accent: "purple",
  },
  {
    id: "slack",
    title: "Slack",
    sub: "Notify sales",
    x: 38,
    y: 41,
    w: 10,
    h: 10,
    accent: "blue",
  },
  {
    id: "crm",
    title: "CRM",
    sub: "Create / enrich record",
    x: 50,
    y: 41,
    w: 10,
    h: 10,
    accent: "pink",
  },
  {
    id: "mail",
    title: "Email",
    sub: "Follow-up sequence",
    x: 65,
    y: 24,
    w: 12,
    h: 10,
    accent: "green",
  },
  {
    id: "calendar",
    title: "Calendar",
    sub: "Book meeting",
    x: 79,
    y: 24,
    w: 12,
    h: 10,
    accent: "blue",
  },
  {
    id: "result",
    title: "Completed",
    sub: "Booked · messaged · updated",
    x: 70,
    y: 52,
    w: 22,
    h: 14,
    accent: "purple",
  },
];

export const workflowLines: StoryLine[] = [
  { from: "request", to: "planner" },
  { from: "planner", to: "slack" },
  { from: "planner", to: "crm" },
  { from: "planner", to: "mail" },
  { from: "mail", to: "calendar" },
  { from: "crm", to: "result" },
  { from: "slack", to: "result" },
  { from: "calendar", to: "result" },
];

export const metricCards = [
  {
    label: "Runs today",
    value: "1,542",
    note: "Execution volume across workflows and agents",
  },
  {
    label: "Avg. time saved",
    value: "17h",
    note: "Per team, per week from orchestration + automation",
  },
  {
    label: "Success rate",
    value: "99.99%",
    note: "Observed completion with retries, fallbacks, and guardrails",
  },
  {
    label: "Recovery rate",
    value: "86%",
    note: "Auto-recovered runs through retry / repair logic",
  },
];

export const proofLogos = [
  "OpenAI-ready",
  "SOC2-ready",
  "Multi-tenant",
  "Enterprise auth",
  "Audit trail",
  "Agent memory",
];

export const featurePills = [
  "AI planner",
  "Agent memory",
  "Workflow engine",
  "Approvals",
  "Guardrails",
  "Audit logs",
  "Retries",
  "Enterprise RBAC",
];
