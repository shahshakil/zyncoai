"use client";
import { Phone } from "lucide-react";
import { trackConversion } from "@/components/seo/GoogleAnalytics";
import { DEMO_NUMBER } from "./LiveDemoSection";

export function CallEllaButton() {
  return (
    <a
      href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
      onClick={() => trackConversion("demo_request", { channel: "phone_call" })}
      className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-emerald-600 px-8 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.25)] transition hover:opacity-90"
    >
      <Phone className="h-6 w-6" /> Call Ella now: {DEMO_NUMBER}
    </a>
  );
}
