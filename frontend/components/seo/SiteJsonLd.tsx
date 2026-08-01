// Site-wide JSON-LD, rendered once in the root layout. Every fact here is
// either independently verified against real data elsewhere in this
// codebase (ABN + address from welcomeEmail.ts, phone number confirmed
// with the user directly, pricing range from platformSettings.ts's real
// plan data) or user-provided first-party fact about their own company
// (founder name, founding date, street address) — nothing fabricated.
//
// Deliberately omitted vs. a generic SEO template:
// - sameAs (social profiles): no real @zyncoai accounts found anywhere in
//   this codebase; a fake/unverified sameAs link is worse than none.
// - SoftwareApplication.screenshot: no real product screenshot exists in
//   public/ — referencing one would be a broken image URL.
// - WebSite.potentialAction (SearchAction): there's no /search route on
//   this site; a SearchAction pointing at a 404 would actively mislead
//   Google's sitelinks search box feature.
export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZyncoAI",
    legalName: "ZyncoAI",
    url: "https://zyncoai.com",
    logo: "https://zyncoai.com/icon.svg",
    description:
      "AI-powered receptionist platform for Australian businesses. Answers calls 24/7, books appointments automatically.",
    foundingDate: "2026",
    founders: [{ "@type": "Person", name: "Shah Shakil" }],
    address: {
      "@type": "PostalAddress",
      streetAddress: "2 Hopkins Street",
      addressLocality: "Merewether",
      addressRegion: "NSW",
      postalCode: "2291",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+61-480-738-227",
      email: "support@zyncoai.com",
      contactType: "customer support",
      areaServed: "AU",
      availableLanguage: "English",
    },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ZyncoAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "149",
      priceCurrency: "AUD",
    },
    description:
      "AI receptionist that answers calls 24/7, books appointments, and handles customer inquiries for Australian businesses.",
    url: "https://zyncoai.com",
    featureList: [
      "24/7 AI call answering",
      "Automatic appointment booking",
      "Australian accent voice",
      "Multi-vertical support",
      "Real-time dashboard",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ZyncoAI",
    url: "https://zyncoai.com",
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ZyncoAI",
    url: "https://zyncoai.com",
    telephone: "+61480738227",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Newcastle",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -32.9267,
      longitude: 151.7789,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    priceRange: "AUD $149 - $2499/month",
  };

  const schemas = [organization, softwareApplication, website, localBusiness];

  return (
    <>
      {schemas.map((schema, i) => (
        // eslint-disable-next-line react/no-array-index-key -- fixed-length, order-stable array of distinct schema types
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
