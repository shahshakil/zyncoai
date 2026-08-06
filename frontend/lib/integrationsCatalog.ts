// Settings -> Integrations: the full Australian ordering/POS/CRM catalog,
// filtered per business.vertical. Real (kind !== "coming_soon"): Square
// (RESTAURANT/SALON/RETAIL — one OAuth connection backs all three display
// entries, see integrationsCatalog.ts on the backend), Google Calendar (all
// verticals — links through to the Staff tab, since a calendar connects
// per staff member, not per business), Own Website menu scraping
// (RESTAURANT only), and Microsoft Outlook Calendar (BANK/UNIVERSITY —
// 2026-08-06, was coming-soon with no code behind it; the OAuth
// infrastructure already existed for staff-directory sync, widened scope +
// added real calendar event creation, see lib/microsoftGraph.ts). Everything
// else is a real, named vendor shown as Coming Soon with a "notify me"
// capture rather than silently omitted — an owner searching Settings for
// their POS should see it listed, even if ZyncoAI can't sync with it yet.
export type IntegrationKind = "square" | "google_calendar" | "microsoft_calendar" | "website_scrape" | "coming_soon";

export interface CatalogIntegration {
  key: string;
  name: string;
  description: string;
  kind: IntegrationKind;
  docsUrl?: string;
  // 2026-08-06 — for coming_soon entries only: the real, verified reason
  // this isn't built yet, so the card can say something honest instead of
  // a generic "coming soon" (see the vendor-classification audit).
  comingSoonReason?: string;
}

const GOOGLE_CALENDAR: CatalogIntegration = {
  key: "google_calendar",
  name: "Google Calendar",
  description: "Sync appointment availability and bookings with a staff member's Google Calendar. Connect per staff member from the Staff tab.",
  kind: "google_calendar",
};

const MICROSOFT_CALENDAR: CatalogIntegration = {
  key: "microsoft_calendar",
  name: "Microsoft Outlook Calendar",
  description: "Sync appointment bookings to your business's connected Outlook Calendar (Microsoft 365 / Azure AD).",
  kind: "microsoft_calendar",
};

const CATALOG: Record<string, CatalogIntegration[]> = {
  // 2026-08-06 — "Own Website" (website_scrape) and "Square for
  // Restaurants" (square) used to be listed here too. Both wrote into
  // Business.settings.menu, which nothing in the RESTAURANT product reads
  // — Ella's check_menu tool and the live phone menu read exclusively from
  // the MenuItem/MenuCategory tables (see restaurantMenu.ts), populated
  // only through Settings > Menu & Pricing's own review-gated PDF/photo/
  // website import. Connecting either card looked successful (real OAuth
  // grant for Square, a real GPT-4o extraction for the website scraper)
  // but was functionally inert for the phone AI — a real connection with
  // orphaned, never-read output, which is exactly the kind of honesty
  // violation the integrations catalog needs to avoid. Removed rather than
  // rewired: Settings > Menu & Pricing already covers "import from
  // website" for RESTAURANT correctly, with the mandatory owner-review
  // step this shortcut skipped.
  // 2026-08-06 — every coming_soon card below now carries a real,
  // web-verified comingSoonReason instead of a generic "coming soon" —
  // self-serve (needs only a ZyncoAI developer account), partner-gated
  // (needs the vendor's approval, application process given), no usable
  // API, or unverified (couldn't confirm — flagged rather than guessed).
  RESTAURANT: [
    GOOGLE_CALENDAR,
    { key: "foodhub", name: "FoodHub", description: "Flat monthly fee phone/online ordering platform.", kind: "coming_soon", docsUrl: "https://developer.foodhub.com", comingSoonReason: "Unverified — could not confirm this is the AU-market vendor (the docs found look UK takeaway-marketplace). Needs a direct check with the vendor." },
    { key: "posapt", name: "POSApt", description: "Australian built POS with online ordering.", kind: "coming_soon", docsUrl: "https://posaptapi.com.au", comingSoonReason: "No public developer docs found — likely requires a direct vendor enquiry." },
    { key: "lightspeed_restaurant", name: "Lightspeed Restaurant (K-Series)", description: "Full service POS.", kind: "coming_soon", docsUrl: "https://api-portal.lsk.lightspeed.app/", comingSoonReason: "Partner-gated — Lightspeed's API portal is reserved for approved partners/merchants, apply via their partner program." },
    { key: "ordermate", name: "OrderMate", description: "Australian hospitality POS.", kind: "coming_soon", docsUrl: "https://www.ordermate.com.au/integrations", comingSoonReason: "Partner-gated — no self-serve portal, integrations are built via a direct enquiry with OrderMate." },
    { key: "abacus_pos", name: "Abacus POS", description: "Multi-location restaurants.", kind: "coming_soon", docsUrl: "https://abacus.com.au", comingSoonReason: "Unverified — no official developer portal found. Needs a direct vendor enquiry." },
    { key: "impos", name: "Impos", description: "Australian built POS.", kind: "coming_soon", docsUrl: "https://impos.com.au", comingSoonReason: "No direct public API — only available via Doshii, a separate third-party integration aggregator with its own signup." },
    { key: "redcat", name: "Redcat", description: "Franchise and hotel groups.", kind: "coming_soon", docsUrl: "https://redcat.com.au", comingSoonReason: "Likely partner-gated — a Polygon API exists but no public self-serve docs/signup found." },
    { key: "swiftpos", name: "SwiftPOS", description: "Australian hospitality POS.", kind: "coming_soon", docsUrl: "https://help.swiftpos.com.au/api", comingSoonReason: "Partner-gated — docs/pricing available on request only, an NDA is required before any credentials are shared." },
    { key: "taptouch_pos", name: "TapTouch POS", description: "Australian built POS.", kind: "coming_soon", docsUrl: "https://taptouchpos.com.au", comingSoonReason: "No API or developer program exists — the vendor builds all integrations in-house." },
    { key: "zii_pos", name: "Zii POS", description: "Modern Australian POS.", kind: "coming_soon", docsUrl: "https://ziicloud.com", comingSoonReason: "Unverified — no API/developer section found on the vendor's site." },
    { key: "kounta_lightspeed", name: "Kounta (Lightspeed O-Series)", description: "Cafe and restaurant POS.", kind: "coming_soon", docsUrl: "https://o-series-support.lightspeedhq.com/hc/en-us/articles/31329349293211", comingSoonReason: "Partner-gated — requires submitting a Developer Application and becoming a certified developer." },
    { key: "opentable", name: "OpenTable", description: "Reservations for restaurants.", kind: "coming_soon", docsUrl: "https://www.opentable.com/restaurant-solutions/api-partners/become-a-partner/", comingSoonReason: "Partner-gated — a formal \"Know Your Partner\" application and review process is required." },
    { key: "resdiary", name: "ResDiary", description: "Australian restaurant reservations.", kind: "coming_soon", docsUrl: "https://sales.resdiary.com/api/", comingSoonReason: "Partner-gated — signup is a sales-qualification process bound to a commercial API license, not anonymous self-serve." },
  ],
  MECHANIC: [
    GOOGLE_CALENDAR,
    { key: "carmaster", name: "Carmaster", description: "Australian workshop management.", kind: "coming_soon", comingSoonReason: "Unverified — no real product by this exact name found. Confirm the actual vendor name." },
    { key: "maxxtraxx", name: "MaxxTraxx", description: "Workshop POS.", kind: "coming_soon", comingSoonReason: "No public API — existing integrations are built by the vendor (Motive Retail), not exposed to outside developers." },
    { key: "greasy_wrench", name: "Greasy Wrench", description: "Workshop software.", kind: "coming_soon", comingSoonReason: "Unverified — no evidence this is a real software vendor (searches only found an unrelated physical repair shop)." },
    { key: "automaster", name: "AutoMaster", description: "Dealer management.", kind: "coming_soon", comingSoonReason: "Unverified — name is ambiguous (at least 2 unrelated products found), neither shows a self-serve API. Confirm which vendor is meant." },
    { key: "workshop_mate", name: "Workshop Mate", description: "Australian built workshop software.", kind: "coming_soon", comingSoonReason: "No public API or developer program — existing integrations (Xero, MYOB) are closed, vendor-built connections." },
  ],
  LAW: [
    GOOGLE_CALENDAR,
    { key: "leap", name: "LEAP", description: "The most popular Australian legal practice management software.", kind: "coming_soon", comingSoonReason: "Self-serve API (register free at console.leap.build) — needs a ZyncoAI developer account + credentials before this can be built. Not gated on LEAP's approval." },
    { key: "smokeball", name: "Smokeball", description: "Australian law practice management.", kind: "coming_soon", comingSoonReason: "Partner-gated — the requesting firm must be on Smokeball's Prosper+ plan and submit an API access request." },
    { key: "clio", name: "Clio", description: "Cloud legal software.", kind: "coming_soon", comingSoonReason: "Self-serve API (docs.developers.clio.com) — needs a ZyncoAI developer account + credentials before this can be built. Not gated on Clio's approval." },
    { key: "myob_law", name: "MYOB Practice Management", description: "Accounting-integrated legal practice management.", kind: "coming_soon", comingSoonReason: "Unverified — no product literally called \"MYOB Law\" exists; likely means MYOB's accounting-focused Practice Management product. Confirm intended vendor." },
    { key: "actionstep", name: "ActionStep", description: "Matter management.", kind: "coming_soon", comingSoonReason: "Partner-gated — requires emailing Actionstep's Global Support Team, a US$500 setup fee, and their own API review process." },
  ],
  SALON: [
    // 2026-08-06 — description used to also claim "booking availability"
    // sync; only the service/price catalog is actually synced (the
    // APPOINTMENTS_READ scope is deliberately not requested — see
    // backend/src/lib/square.ts).
    { key: "square_appointments", name: "Square Appointments", description: "Syncs your service menu and pricing automatically.", kind: "square", docsUrl: "https://developer.squareup.com" },
    GOOGLE_CALENDAR,
    { key: "timely", name: "Timely", description: "Popular NZ/AU salon software.", kind: "coming_soon", comingSoonReason: "No public API — only native/Zapier connectors exist, confirmed by the vendor's own community." },
    { key: "shortcuts", name: "Shortcuts", description: "Australian salon software.", kind: "coming_soon", comingSoonReason: "Partner-gated — API keys are granted directly by Shortcuts on a request-by-request basis, no self-serve dashboard." },
    { key: "kitomba", name: "Kitomba", description: "Salon and spa management.", kind: "coming_soon", comingSoonReason: "No public API — confirmed by a verified user review; only pre-built integrations exist." },
    { key: "phorest", name: "Phorest", description: "Salon management.", kind: "coming_soon", comingSoonReason: "Partner-gated — Phorest's own docs say to contact their Support team with your account number to get API access." },
    { key: "fresha", name: "Fresha", description: "Free salon booking software.", kind: "coming_soon", comingSoonReason: "No merchant API — only a read-only Power BI/Tableau data connector exists, manually enabled per merchant." },
  ],
  REAL_ESTATE: [
    GOOGLE_CALENDAR,
    { key: "rex_crm", name: "Rex CRM", description: "Australian real estate CRM.", kind: "coming_soon", comingSoonReason: "Self-serve API (api-docs.rexsoftware.com, agency admin generates keys directly) — needs a ZyncoAI developer account + credentials before this can be built. Not gated on Rex's approval." },
    { key: "console_cloud", name: "Console Cloud (Reapit)", description: "Property management.", kind: "coming_soon", comingSoonReason: "Partner-gated — requires registering as a developer and submitting an app to the Reapit AppMarket for review." },
    { key: "propertyme", name: "PropertyMe", description: "Australian property management.", kind: "coming_soon", comingSoonReason: "Partner-gated — no self-serve portal; existing integrators are vetted \"official PropertyMe Partners.\"" },
    { key: "re_leased", name: "Re-Leased", description: "Commercial property management.", kind: "coming_soon", comingSoonReason: "Partner-gated — credentials are provisioned by your Re-Leased account manager, access depends on plan tier." },
  ],
  UNIVERSITY: [
    GOOGLE_CALENDAR,
    MICROSOFT_CALENDAR,
    { key: "calendly", name: "Calendly", description: "Simple scheduling links.", kind: "coming_soon", comingSoonReason: "Self-serve developer API exists (developer.calendly.com) — needs a ZyncoAI developer account + credentials before this can be built. Not gated on Calendly's approval." },
  ],
  RETAIL: [
    { key: "square_retail", name: "Square for Retail", description: "Syncs your product catalog automatically.", kind: "square", docsUrl: "https://developer.squareup.com" },
    { key: "shopify", name: "Shopify", description: "Ecommerce platform.", kind: "coming_soon", comingSoonReason: "Self-serve API — needs a ZyncoAI developer account + credentials before this can be built. Not gated on Shopify's approval." },
    { key: "lightspeed_retail", name: "Lightspeed Retail (X-Series / Vend)", description: "Retail POS.", kind: "coming_soon", comingSoonReason: "Self-serve API — needs a ZyncoAI developer account + credentials before this can be built. Not gated on Lightspeed's approval." },
    { key: "myob", name: "MYOB", description: "Australian accounting and retail.", kind: "coming_soon", comingSoonReason: "Requires applying to the MYOB Developer Program (paid tiers, from $110/mo AUD) before any API key is issued." },
  ],
  BANK: [
    GOOGLE_CALENDAR,
    MICROSOFT_CALENDAR,
  ],
  MEDICAL: [GOOGLE_CALENDAR],
  DENTAL: [GOOGLE_CALENDAR],
  OTHER: [GOOGLE_CALENDAR],
};

export function getIntegrationsCatalog(vertical: string | null | undefined): CatalogIntegration[] {
  if (!vertical || !CATALOG[vertical]) return [GOOGLE_CALENDAR];
  return CATALOG[vertical];
}
