// Site-wide JSON-LD, rendered once in the root layout. Every fact here is
// either independently verified against real data elsewhere in this
// codebase (ABN + address from welcomeEmail.ts, phone number confirmed
// with the user directly, pricing range from platformSettings.ts's real
// plan data) or user-provided first-party fact about their own company
// (founder name, founding date, suburb-level address) — nothing fabricated.
//
// Deliberately omitted vs. a generic SEO template:
// - SoftwareApplication.screenshot: no real product screenshot exists in
//   public/ — referencing one would be a broken image URL.
// - WebSite.potentialAction (SearchAction): there's no /search route on
//   this site; a SearchAction pointing at a 404 would actively mislead
//   Google's sitelinks search box feature.
//
// 2026-08-05: offers.price was hardcoded "149" (Restaurant's Starter,
// real, but no longer the true sitewide cheapest — Salon undercuts it at
// $99) — derived from SITEWIDE_CHEAPEST_PLAN_PRICE now so this can't drift
// from the visible /pricing page again. priceRange's upper bound ($2,499,
// Bank's Enterprise tier — see platformSettings.ts's DEFAULT_BANK_PLANS)
// stays a manual literal: Enterprise/custom tiers store priceMonthly as 0
// (shown as "Contact us") in data.ts, so there's no queryable number to
// derive this from the same way; update by hand if that real number ever
// changes.
import { SITEWIDE_CHEAPEST_PLAN_PRICE } from "../marketing/receptionist/data";

export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZyncoAI",
    // Real registered trading name (PlatformSettings.legalEntityName in the
    // DB — same value the invoice footer and /legal/dpa render), not just
    // the brand name repeated.
    legalName: "Shah Shakil trading as ZyncoAI",
    url: "https://zyncoai.com",
    logo: "https://zyncoai.com/icon.svg",
    description:
      "AI-powered receptionist platform for Australian businesses. Answers calls 24/7, books appointments automatically.",
    // Real ABN — PlatformSettings.zyncoAbn in the DB, the same number
    // already printed on /about, /privacy, and every invoice.
    taxID: "38 138 129 187",
    foundingDate: "2026",
    founders: [
      {
        "@type": "Person",
        name: "Shah Md Ahsan Habib Shakil",
        jobTitle: "Founder & CEO",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Victoria Institute of Technology",
        },
      },
    ],
    // 2026-08-19 — suburb-level only, deliberately: streetAddress and the
    // street-level postcode were dropped at the user's request (that
    // precision publishes their home address in machine-readable
    // structured data, which they don't want).
    address: {
      "@type": "PostalAddress",
      addressLocality: "Newcastle",
      addressRegion: "NSW",
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
    // 2026-08-19 — real ZyncoAI social profiles, user-provided (same
    // first-party-fact standard as founder name/address above; this file
    // previously deliberately omitted sameAs specifically because no real
    // account had been confirmed — see the file header comment).
    // Facebook/Instagram deliberately left out, not stubbed with placeholder
    // URLs — those profiles don't exist yet. Add each one here the day it's
    // real.
    sameAs: ["https://www.linkedin.com/company/143046371", "https://x.com/ZyncoAI"],
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ZyncoAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: String(SITEWIDE_CHEAPEST_PLAN_PRICE),
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
    // 2026-08-19 — aligned to the exact same suburb-level address as
    // `organization` above (was streetAddress + postalCode down to
    // Merewether; the user asked to drop street-level precision from
    // published structured data, so both entries now stop at suburb/
    // region/country).
    address: {
      "@type": "PostalAddress",
      addressLocality: "Newcastle",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    image: "https://zyncoai.com/icon.svg",
    // 2026-08-19 — was precise coordinates (4 decimal places) that
    // pinpointed the exact Merewether street address; same privacy request
    // as `address` above. Kept geo (useful for local SEO/map-pack signals)
    // but rounded to Newcastle NSW's city-centre coordinates at 2 decimal
    // places (~1km precision) — a real, public city location, not tied to
    // any specific street address.
    geo: {
      "@type": "GeoCoordinates",
      latitude: -32.93,
      longitude: 151.78,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    priceRange: `AUD $${SITEWIDE_CHEAPEST_PLAN_PRICE} - $2499/month`,
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
