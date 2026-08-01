import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | ZyncoAI",
  description: "Get in touch with the ZyncoAI team — support, sales, or a live demo of Ella, your AI receptionist.",
  alternates: { canonical: "/contact", languages: { "en-AU": "/contact", en: "/contact" } },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
