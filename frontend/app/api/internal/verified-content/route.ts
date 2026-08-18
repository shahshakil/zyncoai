// Serves the site's real, fact-checked FAQ + Help Centre content as JSON —
// the exact same data already rendered on the public /faq and
// /resources/help pages, not a second copy. Exists so the backend's AI
// Support Assist (a separate deployable service, no shared package) can
// ground draft replies in this content live instead of holding its own
// duplicate that could drift out of sync. No auth: this is already-public
// page content, same trust level as /faq and /resources/help themselves.
import { NextResponse } from "next/server";
import { HELP_CATEGORIES } from "@/lib/verifiedHelpContent";
import { FAQS } from "@/components/seo/FaqJsonLd";

export async function GET() {
  return NextResponse.json({
    ok: true,
    helpCategories: HELP_CATEGORIES,
    faqs: FAQS.map((f) => ({ question: f.question, answer: f.answer, category: f.category })),
  });
}
