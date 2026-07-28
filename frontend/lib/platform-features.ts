export type PlatformFeature = {
  title: string;
  desc: string;
  bullets: string[];
  endpoints: { method: "GET" | "POST"; path: string; note?: string }[];
  tag?: string;
};

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    title: "Workflow execution",
    desc: "Run workflows and trigger outbound webhooks after completion.",
    bullets: [
      "POST /api/workflows/run executes workflow payload",
      "Optional webhook call to HOOKS_BASE_URL/webhooks/workflow",
      "Returns stepsRun + execution result"
    ],
    endpoints: [
      { method: "POST", path: "/api/workflows/run", note: "Simulated runner + webhook notify" },
    ],
    tag: "Execution",
  },
  {
    title: "Jobs streaming (SSE)",
    desc: "Live job events from BullMQ: progress, completed, failed.",
    bullets: [
      "Server-Sent Events stream for UI dashboards",
      "Progress/completed/failed event payloads",
      "QueueEvents from BullMQ"
    ],
    endpoints: [
      { method: "GET", path: "/api/jobs/stream", note: "SSE stream of queue events" },
      { method: "GET", path: "/api/jobs/health", note: "Basic health test" },
    ],
    tag: "Observability",
  },
  {
    title: "Auth & sessions",
    desc: "Register, login, logout, session validation, password reset.",
    bullets: [
      "Register/login/logout",
      "Session validation + /me identity endpoint",
      "Forgot/reset password flow"
    ],
    endpoints: [
      { method: "POST", path: "/auth/register" },
      { method: "POST", path: "/auth/login" },
      { method: "POST", path: "/auth/logout" },
      { method: "GET", path: "/auth/me" },
      { method: "GET", path: "/auth/session/validate" },
      { method: "POST", path: "/auth/password/forgot" },
      { method: "POST", path: "/auth/password/reset" },
    ],
    tag: "Security",
  },
  {
    title: "Slack native integration",
    desc: "Slack events, interactions, and commands with signature verification.",
    bullets: [
      "Slack Events API endpoint",
      "Interactive components endpoint",
      "Slash commands support"
    ],
    endpoints: [
      { method: "POST", path: "/auth/slack/events" },
      { method: "POST", path: "/auth/slack/interactions" },
      { method: "POST", path: "/auth/slack/commands" },
    ],
    tag: "Integrations",
  },
  {
    title: "Platform health checks",
    desc: "Operational endpoints to verify service health.",
    bullets: [
      "Health endpoints for readiness checks",
      "Used for infra monitoring and probes"
    ],
    endpoints: [
      { method: "GET", path: "/healthz" },
      { method: "GET", path: "/health" },
    ],
    tag: "Reliability",
  },
];
