import EnterprisePageClient from "@/components/marketing/enterprise/EnterprisePageClient";

export const metadata = {
  title: "Enterprise | ZyncoAI",
  description:
    "Enterprise-grade AI-native automation with governance, observability, security, orchestration, and deployment controls.",
  alternates: { canonical: "/enterprise" },
};

export default function EnterprisePage() {
  return <EnterprisePageClient />;
}
