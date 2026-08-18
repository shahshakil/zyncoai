// FAQPage structured data for the Help Centre — same <script type=
// "application/ld+json"> pattern FaqJsonLd.tsx uses for /faq, built from the
// same locked, fact-checked HELP_CATEGORIES content the page itself renders
// (lib/verifiedHelpContent.ts), so this can never drift from what's
// actually on the page.
import { HELP_CATEGORIES } from "@/lib/verifiedHelpContent";

export function HelpJsonLd() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HELP_CATEGORIES.flatMap((c) =>
      c.items.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: i.answer,
        },
      }))
    ),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />;
}
