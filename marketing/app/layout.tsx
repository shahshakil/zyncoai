import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZyncoAI — Enterprise AI Automation Platform",
  description:
    "ZyncoAI is an enterprise-grade AI automation platform combining visual workflows, AI agents, integrations, and observability — built to scale on Kubernetes.",
  openGraph: {
    title: "ZyncoAI — Enterprise AI Automation",
    description:
      "Visual workflows, AI agents, integrations, and observability in one platform.",
    url: "https://zyncoai.com",
    siteName: "ZyncoAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
