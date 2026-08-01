"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import posthog from "posthog-js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";

const TabSkeleton = () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" />;
const ProfileTab = dynamic(() => import("@/components/dashboard/settings/ProfileTab").then((m) => ({ default: m.ProfileTab })), { loading: TabSkeleton });
const StaffTab = dynamic(() => import("@/components/dashboard/settings/StaffTab").then((m) => ({ default: m.StaffTab })), { loading: TabSkeleton });
const IntegrationsTab = dynamic(() => import("@/components/dashboard/settings/IntegrationsTab").then((m) => ({ default: m.IntegrationsTab })), { loading: TabSkeleton });
const EmailSendingSection = dynamic(() => import("@/components/dashboard/settings/EmailSendingSection").then((m) => ({ default: m.EmailSendingSection })), { loading: TabSkeleton });
const CallRoutingSection = dynamic(() => import("@/components/dashboard/settings/CallRoutingSection").then((m) => ({ default: m.CallRoutingSection })), { loading: TabSkeleton });
const AutomationSection = dynamic(() => import("@/components/dashboard/settings/AutomationSection").then((m) => ({ default: m.AutomationSection })), { loading: TabSkeleton });
const CheckInAutomationSection = dynamic(() => import("@/components/dashboard/settings/CheckInAutomationSection").then((m) => ({ default: m.CheckInAutomationSection })), { loading: TabSkeleton });
const WebhooksTab = dynamic(() => import("@/components/dashboard/settings/WebhooksTab").then((m) => ({ default: m.WebhooksTab })), { loading: TabSkeleton });
const NotificationsTab = dynamic(() => import("@/components/dashboard/settings/NotificationsTab").then((m) => ({ default: m.NotificationsTab })), { loading: TabSkeleton });
const BillingTab = dynamic(() => import("@/components/dashboard/settings/BillingTab").then((m) => ({ default: m.BillingTab })), { loading: TabSkeleton });
const ComplianceTab = dynamic(() => import("@/components/dashboard/settings/ComplianceTab").then((m) => ({ default: m.ComplianceTab })), { loading: TabSkeleton });
const MenuTab = dynamic(() => import("@/components/dashboard/settings/MenuTab").then((m) => ({ default: m.MenuTab })), { loading: TabSkeleton });
const RestaurantMenuManager = dynamic(() => import("@/components/dashboard/settings/RestaurantMenuManager").then((m) => ({ default: m.RestaurantMenuManager })), { loading: TabSkeleton });
const AiPromptTab = dynamic(() => import("@/components/dashboard/settings/AiPromptTab").then((m) => ({ default: m.AiPromptTab })), { loading: TabSkeleton });
const DangerZoneTab = dynamic(() => import("@/components/dashboard/settings/DangerZoneTab").then((m) => ({ default: m.DangerZoneTab })), { loading: TabSkeleton });

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

    const squareConnected = searchParams.get("square_connected");
    const squareError = searchParams.get("square_error");
    if (squareConnected === "1") toast.success("Square connected successfully!");
    else if (squareError) toast.error(squareError === "invalid_state" ? "That connection link expired — please try again" : "Could not connect Square");
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
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="compliance">Security & Compliance</TabsTrigger>
        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
      </TabsList>
      <TabsContent value="profile"><ProfileTab /></TabsContent>
      <TabsContent value="staff"><StaffTab /></TabsContent>
      {ops?.menuEnabled && (
        <TabsContent value="menu">
          {business.vertical === "RESTAURANT" ? <RestaurantMenuManager /> : <MenuTab />}
        </TabsContent>
      )}
      <TabsContent value="ai-prompt"><AiPromptTab /></TabsContent>
      <TabsContent value="integrations">
        <IntegrationsTab />
        <EmailSendingSection />
        <CallRoutingSection />
        <CheckInAutomationSection />
        <AutomationSection />
      </TabsContent>
      <TabsContent value="webhooks"><WebhooksTab /></TabsContent>
      <TabsContent value="notifications"><NotificationsTab /></TabsContent>
      <TabsContent value="billing"><BillingTab /></TabsContent>
      <TabsContent value="compliance"><ComplianceTab /></TabsContent>
      <TabsContent value="danger"><DangerZoneTab /></TabsContent>
    </Tabs>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
    </div>
  );
}
