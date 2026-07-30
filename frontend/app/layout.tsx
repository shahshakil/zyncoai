import "./globals.css";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { PostHogProvider } from "../components/PostHogProvider";

// globals.css already declares `body { font-family: Inter, Arial, ... }`,
// but nothing ever actually loaded Inter — the site was silently falling
// back to system Arial/Helvetica. next/font self-hosts it (no external
// Google Fonts request) and, applied as a class directly on <body>, its
// higher-specificity class selector wins over the existing element-level
// rule, so no other change to globals.css is needed.
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          {children}
          <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" } }} />
        </PostHogProvider>
      </body>
    </html>
  );
}
