// Homepage-only FAQ schema — content grounded in real, verified facts:
// pricing matches platformSettings.ts's real RESTAURANT/MEDICAL Starter
// tiers, the 7-day trial matches the real trialEndsAt logic, and the
// compliance/voice-provider claims match the real Privacy Act 1988 / My
// Health Records Act 2012 copy and Cartesia/Deepgram usage already in
// production (see server.py).
const FAQS = [
  {
    question: "What is ZyncoAI?",
    answer:
      "ZyncoAI is an AI-powered receptionist platform that answers phone calls 24/7, books appointments automatically, and handles customer inquiries for Australian businesses.",
  },
  {
    question: "How much does ZyncoAI cost?",
    answer:
      "ZyncoAI starts from AUD $149/month for restaurants and AUD $399/month for medical clinics. All plans include a 7-day free trial.",
  },
  {
    question: "Does ZyncoAI work for medical clinics?",
    answer:
      "Yes, ZyncoAI is fully compliant with the Australian Privacy Act 1988 and My Health Records Act 2012, making it suitable for medical and dental clinics.",
  },
  {
    question: "What Australian accents does ZyncoAI support?",
    answer:
      "ZyncoAI uses Cartesia's natural voice technology and Deepgram's speech recognition tuned for Australian English, providing natural Australian accent support.",
  },
];

export function HomepageFaqJsonLd() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />;
}

export { FAQS };
