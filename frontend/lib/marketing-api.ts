const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://zyncoai.com/api";

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function apiGet<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) return null;
    return await parseJsonSafe(res);
  } catch {
    return null;
  }
}

export async function getMarketingMetrics() {
  return apiGet("/marketing/metrics");
}

export async function getPublicConnectors() {
  return apiGet("/connectors/public");
}

export async function getPublicTemplates() {
  return apiGet("/templates/public");
}

export async function getEnterpriseMetrics() {
  return apiGet("/enterprise/metrics");
}

export async function getEnterpriseAudit(limit = 20) {
  return apiGet(`/enterprise/audit?limit=${limit}`);
}

export async function getEnterpriseRisk() {
  return apiGet("/enterprise/risk");
}

export async function getEnterpriseCompliance() {
  return apiGet("/enterprise/compliance");
}

export async function getApiHealth() {
  return apiGet("/health");
}

// The real signal for "can a caller actually reach us right now" — checks
// Twilio's own Account resource status directly, not just whether our own
// webhook/pipecat process is reachable (which stays green even when
// Twilio itself has suspended the account — see voiceHealth.ts's own
// header comment on the backend for the full reasoning). Short revalidate
// window (not the 30s default) so a call CTA genuinely "auto-restores
// with zero code changes" within a minute of Twilio coming back, not
// after the next deploy.
export async function getVoiceHealth(): Promise<{ healthy: boolean; detail: string } > {
  try {
    const res = await fetch(`${API_BASE}/voice-health/public`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { healthy: false, detail: "unreachable" };
    const data = await parseJsonSafe(res);
    return { healthy: Boolean(data?.healthy), detail: data?.detail || "unknown" };
  } catch {
    return { healthy: false, detail: "unreachable" };
  }
}

export async function getInternalGatewayHealth() {
  try {
    const url =
      process.env.NEXT_PUBLIC_INTERNAL_GATEWAY_URL ||
      "http://127.0.0.1:7004/health";

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 15 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
