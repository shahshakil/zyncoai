"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Copy, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

type StatusResponse = {
  senderEmail: string | null;
  emailProvider: "google" | "microsoft" | "yahoo" | "custom" | null;
  emailDomainVerified: boolean;
  domain: { domain: string; records: DnsRecord[] } | null;
  providersConfigured: { google: boolean; microsoft: boolean; yahoo: boolean };
};

type DnsRecord = { record: string; name: string; type: string; value: string; ttl?: string; priority?: number; status?: string };

const CUSTOM_DOMAIN_TABS = [
  { key: "cloudflare", label: "Cloudflare", steps: ["Log in to the Cloudflare dashboard", "Select your domain → DNS → Records", "Click Add record for each row below, matching Type/Name/Content exactly", "Save — Cloudflare DNS usually propagates within minutes"] },
  { key: "cpanel", label: "cPanel", steps: ["Log in to cPanel", "Open Zone Editor (under Domains)", "Select your domain → Add Record for each row below", "Save each record"] },
  { key: "godaddy", label: "GoDaddy", steps: ["Log in to GoDaddy → My Products → DNS", "Select your domain", "Click Add for each row below, matching Type/Name/Value", "Save — GoDaddy can take up to 24 hours to propagate"] },
  { key: "namecheap", label: "Namecheap", steps: ["Log in to Namecheap → Domain List → Manage", "Go to the Advanced DNS tab", "Click Add New Record for each row below", "Save all changes"] },
  { key: "zoho", label: "Zoho", steps: ["Log in to your domain registrar (Zoho doesn't host DNS itself)", "Open the DNS management page for your domain", "Add each record below exactly as shown", "Save"] },
  { key: "other", label: "Other", steps: ["Log in to your domain host's control panel", "Find DNS management / DNS zone editor", "Add each record below as a new DNS record, matching Type/Name/Value exactly", "Save and allow time for propagation (usually under an hour, can take longer)"] },
] as const;

function StatusBadgeRow({ state, sendingFrom }: { state: "not_connected" | "pending" | "connected" | "failed"; sendingFrom?: string | null }) {
  if (state === "connected") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {sendingFrom ? `Sending from ${sendingFrom}` : "Connected"}
      </div>
    );
  }
  if (state === "pending") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying your domain
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
        <XCircle className="h-3.5 w-3.5" /> Connection failed
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
      <Circle className="h-3 w-3" /> Not connected
    </div>
  );
}

function ProviderRow({
  icon,
  name,
  connected,
  sendingFrom,
  configured,
  onConnect,
  onDisconnect,
  connecting,
}: {
  icon: React.ReactNode;
  name: string;
  connected: boolean;
  sendingFrom?: string | null;
  configured: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <StatusBadgeRow state={connected ? "connected" : "not_connected"} sendingFrom={sendingFrom} />
        </div>
      </div>
      {connected ? (
        <Button variant="outline" size="sm" onClick={onDisconnect}>Disconnect</Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={connecting}
          onClick={() => {
            if (!configured) {
              toast.error(`${name} sign-in isn't set up yet — contact support to enable it`);
              return;
            }
            onConnect();
          }}
        >
          {connecting ? "Connecting…" : "Connect"}
        </Button>
      )}
    </div>
  );
}

export function EmailSendingSection() {
  const searchParams = useSearchParams();
  const { data, isLoading, mutate } = useApi<StatusResponse>("/api/business/email-sending/status");
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const [customOpen, setCustomOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [generatingRecords, setGeneratingRecords] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [records, setRecords] = useState<DnsRecord[] | null>(null);
  const [providerTab, setProviderTab] = useState<(typeof CUSTOM_DOMAIN_TABS)[number]["key"]>("cloudflare");

  useEffect(() => {
    const connected = searchParams.get("email_sender_connected");
    const error = searchParams.get("email_sender_error");
    if (error) toast.error("Could not connect — please try again");
    if (connected) {
      toast.success(`${connected[0].toUpperCase()}${connected.slice(1)} connected`);
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (data?.senderEmail) setCustomEmail((prev) => prev || (data.emailProvider === "custom" ? data.senderEmail! : prev));
    if (data?.domain) {
      setCustomDomain(data.domain.domain);
      setRecords(data.domain.records);
      setCustomOpen(true);
    }
  }, [data]);

  async function startOAuth(provider: "google" | "microsoft" | "yahoo") {
    setConnectingProvider(provider);
    try {
      const res = await fetch(`/api/business/email-sending/${provider}/connect`, { credentials: "include" });
      const json = await res.json();
      if (!json.ok || !json.authUrl) {
        toast.error(`${provider} sign-in isn't set up yet — contact support to enable it`);
        return;
      }
      window.location.href = json.authUrl;
    } catch {
      toast.error("Could not start sign-in");
    } finally {
      setConnectingProvider(null);
    }
  }

  async function disconnect() {
    try {
      await apiPost("/api/business/email-sending/disconnect");
      toast.success("Disconnected");
      setRecords(null);
      setCustomOpen(false);
      mutate();
    } catch {
      toast.error("Could not disconnect");
    }
  }

  async function saveCustomEmail() {
    if (!customEmail) return;
    try {
      await apiPost("/api/business/email-sending/custom", { email: customEmail }, "PUT");
      if (!customDomain) setCustomDomain(customEmail.split("@")[1] || "");
      mutate();
    } catch {
      toast.error("Could not save sending address");
    }
  }

  async function generateRecords() {
    const domain = customDomain || customEmail.split("@")[1];
    if (!domain) {
      toast.error("Enter your sending address first");
      return;
    }
    setGeneratingRecords(true);
    try {
      const res = await apiPost<{ records: DnsRecord[] }>("/api/business/email-sending/custom/generate-records", { domain });
      setRecords(res.records);
      toast.success("DNS records generated — add them at your domain host");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "invalid_input" ? "Enter a valid domain" : "Could not generate DNS records");
    } finally {
      setGeneratingRecords(false);
    }
  }

  async function verifyDomain() {
    setVerifying(true);
    try {
      const res = await apiPost<{ status: string; verified: boolean }>("/api/business/email-sending/custom/verify");
      if (res.verified) toast.success("Domain verified!");
      else toast.info(`Not verified yet (${res.status}) — DNS can take a while to propagate`);
      mutate();
    } catch {
      toast.error("Could not check verification status");
    } finally {
      setVerifying(false);
    }
  }

  const customState: "not_connected" | "pending" | "connected" | "failed" = useMemo(() => {
    if (data?.emailProvider === "custom" && data?.emailDomainVerified) return "connected";
    if (records && records.length > 0) return "pending";
    return "not_connected";
  }, [data, records]);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div>
          <CardTitle>Email sending</CardTitle>
          <p className="mt-1 text-xs text-slate-400">Send confirmations and reminders from your own email — patients see your name only, never ZyncoAI</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProviderRow
          icon={<GoogleLogo />}
          name="Google Workspace / Gmail"
          connected={data?.emailProvider === "google"}
          sendingFrom={data?.senderEmail}
          configured={Boolean(data?.providersConfigured.google)}
          connecting={connectingProvider === "google"}
          onConnect={() => startOAuth("google")}
          onDisconnect={disconnect}
        />
        <ProviderRow
          icon={<MicrosoftLogo />}
          name="Microsoft 365 / Outlook"
          connected={data?.emailProvider === "microsoft"}
          sendingFrom={data?.senderEmail}
          configured={Boolean(data?.providersConfigured.microsoft)}
          connecting={connectingProvider === "microsoft"}
          onConnect={() => startOAuth("microsoft")}
          onDisconnect={disconnect}
        />
        <ProviderRow
          icon={<YahooLogo />}
          name="Yahoo Mail"
          connected={data?.emailProvider === "yahoo"}
          sendingFrom={data?.senderEmail}
          configured={Boolean(data?.providersConfigured.yahoo)}
          connecting={connectingProvider === "yahoo"}
          onConnect={() => startOAuth("yahoo")}
          onDisconnect={disconnect}
        />

        {/* Other / custom domain */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Other / custom domain</p>
                <p className="text-xs text-slate-400">cPanel, Namecheap, GoDaddy, Cloudflare, Zoho, or any host</p>
                <StatusBadgeRow state={customState} sendingFrom={data?.emailProvider === "custom" ? data?.senderEmail : undefined} />
              </div>
            </div>
            {data?.emailProvider === "custom" ? (
              <Button variant="outline" size="sm" onClick={disconnect}>Disconnect</Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setCustomOpen((v) => !v)}>Set up</Button>
            )}
          </div>

          {customOpen && (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
              <div>
                <Label>Your sending address</Label>
                <div className="flex gap-2">
                  <Input
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    onBlur={saveCustomEmail}
                    placeholder="your@domain.com.au"
                  />
                  <Button variant="secondary" size="sm" onClick={generateRecords} disabled={generatingRecords}>
                    {generatingRecords ? "Generating…" : "Generate DNS records"}
                  </Button>
                </div>
              </div>

              {records && records.length > 0 && (
                <>
                  <div className="space-y-2">
                    {records.map((r, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-medium uppercase">{r.type}</span>
                          {r.status && <Badge tone={r.status === "verified" ? "success" : "warning"}>{r.status}</Badge>}
                        </div>
                        <CopyRow label="Name" value={r.name} />
                        <CopyRow label="Value" value={r.value} />
                      </div>
                    ))}
                  </div>

                  <Tabs value={providerTab} onValueChange={(v) => setProviderTab(v as any)}>
                    <TabsList>
                      {CUSTOM_DOMAIN_TABS.map((t) => (
                        <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
                      ))}
                    </TabsList>
                    {CUSTOM_DOMAIN_TABS.map((t) => (
                      <TabsContent key={t.key} value={t.key}>
                        <ol className="list-decimal space-y-1 pl-4 text-xs text-slate-500">
                          {t.steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <Button className="w-full" onClick={verifyDomain} disabled={verifying}>
                    {verifying ? "Checking…" : "Verify"}
                  </Button>
                  <p className="text-center text-xs text-slate-400">We also check automatically every hour and email you once it&apos;s verified.</p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="w-14 shrink-0 text-xs text-slate-400">{label}</span>
      <code className="flex-1 truncate text-xs text-slate-700">{value}</code>
      <button type="button" onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}>
        <Copy className="h-3.5 w-3.5 text-slate-400" />
      </button>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.2-2.1 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

function YahooLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#6001D2" d="M0 0h24v24H0z" />
      <path fill="#fff" d="M6.5 6h2.8l2.2 5.2L13.7 6h2.7l-3.9 8.9V18h-2.4v-3.1L6.5 6zm10.9 8.2a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2z" />
    </svg>
  );
}
