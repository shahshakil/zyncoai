"use client";
import dynamic from "next/dynamic";

// ssr:false must be called from a Client Component in the App Router —
// this tiny wrapper exists only so (marketing)/layout.tsx (a Server
// Component) can mount the widget without pulling its code into the
// server render or the initial client bundle at all; it's fetched only
// once the browser actually needs it.
const HelpWidget = dynamic(() => import("./HelpWidget").then((m) => m.HelpWidget), { ssr: false });

export function HelpWidgetLoader() {
  return <HelpWidget />;
}
