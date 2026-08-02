"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
const ComplianceTab = dynamic(() => import("@/components/dashboard/settings/ComplianceTab").then((m) => ({ default: m.ComplianceTab })), { loading: TabSkeleton });
const MenuTab = dynamic(() => import("@/components/dashboard/settings/MenuTab").then((m) => ({ default: m.MenuTab })), { loading: TabSkeleton });
const RestaurantMenuManager = dynamic(() => import("@/components/dashboard/settings/RestaurantMenuManager").then((m) => ({ default: m.RestaurantMenuManager })), { loading: TabSkeleton });
const AiPromptTab = dynamic(() => import("@/components/dashboard/settings/AiPromptTab").then((m) => ({ default: m.AiPromptTab })), { loading: TabSkeleton });
const DangerZoneTab = dynamic(() => import("@/components/dashboard/settings/DangerZoneTab").then((m) => ({ default: m.DangerZoneTab })), { loading: TabSkeleton });

function SettingsTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") || "profile";
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const [activeTab, setActiveTab] = useState(urlTab);

  // Billing moved to its own page — old ?tab=billing links/bookmarks land
  // here instead of a blank tab.
  useEffect(() => {
    if (urlTab === "billing") router.replace("/dashboard/billing");
  }, [urlTab, router]);

  // Tabs.Root's defaultValue is read once on mount and then ignored — but
  // every ?tab= link on this page (Sidebar, TrialBanner, OnboardingChecklist,
  // "Connect in Staff tab", etc.) points at this same /dashboard/settings
  // route, so clicking one while already on Settings is a same-route
  // client-side transition that never remounts this component. Without this
  // sync, the URL would update but the visibly active tab wouldn't. Guarded
  // against "billing" so it doesn't flash that tab active for the instant
  // before the redirect above fires.
  useEffect(() => {
    if (urlTab !== "billing") setActiveTab(urlTab);
  }, [urlTab]);

  useEffect(() => {
    // Google's (and Square's) standard OAuth error code for "user clicked
    // Cancel on the consent screen" — worth a distinct, friendlier message
    // from a genuine exchange failure, same reasoning as EmailSendingSection.
    function oauthErrorToast(error: string, connectionLabel: string) {
      if (error === "access_denied" || error === "cancelled" || error === "user_denied") {
        toast.error("Connection cancelled. Click Connect to try again.");
      } else if (error === "invalid_state") {
        toast.error("That connection link expired — please try again");
      } else {
        toast.error(`Could not connect ${connectionLabel}. Please try again or contact support.`);
      }
    }

    const connected = searchParams.get("calendar_connected");
    const error = searchParams.get("calendar_error");
    if (connected === "1") toast.success("✅ Google Calendar connected successfully!", { duration: 5000 });
    else if (error) oauthErrorToast(error, "Google Calendar");

    const squareConnected = searchParams.get("square_connected");
    const squareError = searchParams.get("square_error");
    if (squareConnected === "1") {
      toast.success("✅ Square connected!", { description: "Your menu will sync automatically.", duration: 5000 });
    } else if (squareError) {
      oauthErrorToast(squareError, "Square");
    }
  }, [searchParams]);

  // Clicking a TabsTrigger directly (not a ?tab= link elsewhere) also keeps
  // the URL in sync, via replace (not push) so tabbing around doesn't stack
  // up back-button history entries.
  function onTabChange(tab: string) {
    setActiveTab(tab);
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
    posthog.capture("dashboard_tab_viewed", { tab });
    if (tab === "integrations") posthog.capture("integration_page_viewed", {});
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="profile">Business</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        {ops?.menuEnabled && <TabsTrigger value="menu">{ops.menuLabel}</TabsTrigger>}
        <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
