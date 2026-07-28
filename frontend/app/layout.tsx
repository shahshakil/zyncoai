import "./globals.css";
import type { Viewport } from "next";
import { Toaster } from "sonner";
import { PostHogProvider } from "../components/PostHogProvider";

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
      <body>
        <PostHogProvider>
          {children}
          <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" } }} />
        </PostHogProvider>
      </body>
    </html>
  );
}
