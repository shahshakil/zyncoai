"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import posthog from "posthog-js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { ProfileTab } from "@/components/dashboard/settings/ProfileTab";
import { StaffTab } from "@/components/dashboard/settings/StaffTab";
import { IntegrationsTab } from "@/components/dashboard/settings/IntegrationsTab";
import { EmailSendingSection } from "@/components/dashboard/settings/EmailSendingSection";
import { CallRoutingSection } from "@/components/dashboard/settings/CallRoutingSection";
import { AutomationSection } from "@/components/dashboard/settings/AutomationSection";
import { WebhooksTab } from "@/components/dashboard/settings/WebhooksTab";
import { BillingTab } from "@/components/dashboard/settings/BillingTab";
import { ComplianceTab } from "@/components/dashboard/settings/ComplianceTab";
import { MenuTab } from "@/components/dashboard/settings/MenuTab";
import { AiPromptTab } from "@/components/dashboard/settings/AiPromptTab";
import { DangerZoneTab } from "@/components/dashboard/settings/DangerZoneTab";

function SettingsTabs() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);

  useEffect(() => {
    const connected = searchParams.get("calendar_connected");
    const error = searchParams.get("calendar_error");
    if (connected === "1") toast.success("Google Calendar connected successfully!");
    else if (error) toast.error(error === "invalid_state" ? "That connection link expired — please try again" : "Could not connect Google Calendar");
  }, [searchParams]);

  const trackTab = (tab: string) => {
    posthog.capture("dashboard_tab_viewed", { tab });
    if (tab === "integrations") posthog.capture("integration_page_viewed", {});
    if (tab === "billing") posthog.capture("billing_page_viewed", {});
  };

  return (
    <Tabs defaultValue={initialTab} onValueChange={trackTab}>
      <TabsList>
        <TabsTrigger value="profile">Business</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        {ops?.menuEnabled && <TabsTrigger value="menu">{ops.menuLabel}</TabsTrigger>}
        <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="compliance">Security & Compliance</TabsTrigger>
        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
      </TabsList>
      <TabsContent value="profile"><ProfileTab /></TabsContent>
      <TabsContent value="staff"><StaffTab /></TabsContent>
      {ops?.menuEnabled && <TabsContent value="menu"><MenuTab /></TabsContent>}
      <TabsContent value="ai-prompt"><AiPromptTab /></TabsContent>
      <TabsContent value="integrations">
        <IntegrationsTab />
        <EmailSendingSection />
        <CallRoutingSection />
        <AutomationSection />
      </TabsContent>
      <TabsContent value="webhooks"><WebhooksTab /></TabsContent>
      <TabsContent value="billing"><BillingTab /></TabsContent>
      <TabsContent value="compliance"><ComplianceTab /></TabsContent>
      <TabsContent value="danger"><DangerZoneTab /></TabsContent>
    </Tabs>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
    </div>
  );
}
