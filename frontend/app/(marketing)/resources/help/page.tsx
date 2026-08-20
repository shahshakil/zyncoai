import type { Metadata } from "next";
import { ResourcePageShell } from "@/components/marketing/receptionist/ResourcePageShell";
import { HelpCentre } from "@/components/marketing/receptionist/HelpCentre";
import { HelpJsonLd } from "@/components/seo/HelpJsonLd";
import { HELP_CATEGORIES } from "@/lib/verifiedHelpContent";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "FAQs, troubleshooting, billing, staff invites, and the ZyncoAI cancellation and refund policy.",
  alternates: { canonical: "/resources/help" },
};

// 2026-08-17 presentation rebuild — CONTENT IS LOCKED. Every question/answer
// is byte-for-byte identical to the fact-checked content from the
// 2026-08-17 audit (see git history for that audit's own comment,
// cross-checking every claim against real code). The data itself now lives
// in lib/verifiedHelpContent.ts (2026-08-17, support-suite work) so the
// corner help widget can import the exact same verbatim content instead of
// holding a second copy that could drift.
export default function HelpPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="Help Centre" description="Answers to the most common questions, plus how to get more help.">
      <HelpJsonLd />
      <HelpCentre categories={HELP_CATEGORIES} />
    </ResourcePageShell>
  );
}
