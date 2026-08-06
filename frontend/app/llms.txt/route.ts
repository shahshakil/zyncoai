import { INDUSTRY_PRICING } from "@/components/marketing/receptionist/data";

// llms.txt — the emerging convention for AI crawlers (ChatGPT, Perplexity,
// Claude) to read a concise, structured summary of a site instead of
// scraping rendered HTML. A plain route handler (there's no Next.js
// built-in convention for this file the way there is for robots.txt/
// sitemap.xml), served as text/plain like the others. Every fact below is
// the same real, verified data used in SiteJsonLd.tsx and the llms.txt
// spec — real ABN/address (welcomeEmail.ts), real Starter-tier pricing
// (platformSettings.ts), the real 11-vertical list this product actually
// supports, not a hypothetical shorter list.

// 2026-08-06 — pricing lines used to be a hand-typed block that conflated
// Real Estate with University and Restaurant with Mechanic under one
// shared price each ("From $299", "From $149") — accurate only for as
// long as those pairs happened to cost the same. They no longer do (a
// per-vertical pricing update split them), so this is now generated
// straight from INDUSTRY_PRICING, one line per real pricing group,
// instead of a second hand-maintained copy of the same numbers.
const PRICING_LABELS: Record<string, string> = {
  medical: "Medical/Dental",
  law: "Law",
  bank: "Bank/Financial Services",
  realestate: "Real Estate",
  university: "University",
  restaurant: "Restaurant",
  mechanic: "Mechanic",
  salon: "Salon/Retail",
};
const PRICING_LINES = INDUSTRY_PRICING.map((g) => {
  const entry = g.plans[0]?.priceMonthly;
  const label = PRICING_LABELS[g.slug] || g.label;
  return entry ? `- ${label}: From AUD $${entry}/month` : null;
})
  .filter(Boolean)
  .join("\n");

const CONTENT = `# ZyncoAI
> AI-powered receptionist platform for Australian businesses

ZyncoAI answers phone calls 24/7, books appointments automatically,
and handles customer inquiries using natural Australian voice AI.

## Products
- AI Receptionist: Answers calls 24/7 for medical, dental, legal, restaurant, mechanic, salon, real estate, bank, university and retail businesses
- Automatic booking: Checks real provider/staff availability and books appointments without human intervention
- Voice AI: Natural Australian voice powered by Cartesia (TTS) and Deepgram (STT), built on the Pipecat voice AI framework, running over Twilio Media Streams

## Pricing
${PRICING_LINES}
- 7-day free trial on every plan, no contracts

## Compliance
- Built with the Australian Privacy Act 1988 and My Health Records Act 2012 in mind
- Sensitive patient fields are encrypted at rest
- ZyncoAI is an administrative tool only — it never gives medical, legal, or financial advice

## Key pages
- Pricing: https://zyncoai.com/pricing
- Industry pages: https://zyncoai.com/solutions/{healthcare,dental,legal,restaurant,mechanic,salon}
- Documentation: https://zyncoai.com/resources/docs
- Blog: https://zyncoai.com/blog

## Contact
- Website: https://zyncoai.com
- Email: support@zyncoai.com
- Phone: +61 480 738 227
- Location: Newcastle, NSW, Australia
- ABN: 38138129187
`;

export async function GET() {
  return new Response(CONTENT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
