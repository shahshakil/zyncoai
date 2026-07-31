// Settings -> Integrations: the full Australian ordering/POS/CRM catalog,
// filtered per business.vertical. Three integrations are real (kind !==
// "coming_soon"): Square (RESTAURANT/SALON/RETAIL — one OAuth connection
// backs all three display entries, see integrationsCatalog.ts on the
// backend), Google Calendar (all verticals — links through to the Staff
// tab, since a calendar connects per staff member, not per business), and
// Own Website menu scraping (RESTAURANT only). Everything else is a real,
// named vendor shown as Coming Soon with a "notify me" capture rather than
// silently omitted — an owner searching Settings for their POS should see
// it listed, even if ZyncoAI can't sync with it yet.
export type IntegrationKind = "square" | "google_calendar" | "website_scrape" | "coming_soon";

export interface CatalogIntegration {
  key: string;
  name: string;
  description: string;
  kind: IntegrationKind;
  docsUrl?: string;
}

const GOOGLE_CALENDAR: CatalogIntegration = {
  key: "google_calendar",
  name: "Google Calendar",
  description: "Sync appointment availability and bookings with a staff member's Google Calendar. Connect per staff member from the Staff tab.",
  kind: "google_calendar",
};

const CATALOG: Record<string, CatalogIntegration[]> = {
  RESTAURANT: [
    { key: "own_website", name: "Own Website", description: "Paste your restaurant's website URL — GPT-4o automatically extracts and syncs your menu, updated weekly.", kind: "website_scrape" },
    { key: "square_restaurant", name: "Square for Restaurants", description: "Popular Australian POS — syncs your menu and pushes orders automatically.", kind: "square", docsUrl: "https://developer.squareup.com" },
    GOOGLE_CALENDAR,
    { key: "foodhub", name: "FoodHub", description: "Flat monthly fee phone/online ordering platform.", kind: "coming_soon", docsUrl: "https://developer.foodhub.com" },
    { key: "posapt", name: "POSApt", description: "Australian built POS with online ordering.", kind: "coming_soon", docsUrl: "https://posaptapi.com.au" },
    { key: "lightspeed_restaurant", name: "Lightspeed Restaurant", description: "Full service POS.", kind: "coming_soon", docsUrl: "https://developer.lightspeedhq.com" },
    { key: "ordermate", name: "OrderMate", description: "Australian hospitality POS.", kind: "coming_soon", docsUrl: "https://ordermate.com.au/api" },
    { key: "abacus_pos", name: "Abacus POS", description: "Multi-location restaurants.", kind: "coming_soon", docsUrl: "https://abacus.com.au" },
    { key: "impos", name: "Impos", description: "Australian built POS.", kind: "coming_soon", docsUrl: "https://impos.com.au" },
    { key: "redcat", name: "Redcat", description: "Franchise and hotel groups.", kind: "coming_soon", docsUrl: "https://redcat.com.au" },
    { key: "swiftpos", name: "SwiftPOS", description: "Australian hospitality POS.", kind: "coming_soon", docsUrl: "https://swiftpos.com.au" },
    { key: "taptouch_pos", name: "TapTouch POS", description: "Australian built POS.", kind: "coming_soon", docsUrl: "https://taptouchpos.com.au" },
    { key: "zii_pos", name: "Zii POS", description: "Modern Australian POS.", kind: "coming_soon", docsUrl: "https://ziigroup.com" },
    { key: "kounta_lightspeed", name: "Kounta / Lightspeed", description: "Cafe and restaurant POS.", kind: "coming_soon", docsUrl: "https://developer.lightspeedhq.com" },
    { key: "opentable", name: "OpenTable", description: "Reservations for restaurants.", kind: "coming_soon", docsUrl: "https://platform.opentable.com" },
    { key: "resdiary", name: "ResDiary", description: "Australian restaurant reservations.", kind: "coming_soon", docsUrl: "https://resdiary.com/api" },
  ],
  MECHANIC: [
    GOOGLE_CALENDAR,
    { key: "carmaster", name: "Carmaster", description: "Australian workshop management.", kind: "coming_soon" },
    { key: "maxxtraxx", name: "MaxxTraxx", description: "Workshop POS.", kind: "coming_soon" },
    { key: "greasy_wrench", name: "Greasy Wrench", description: "Workshop software.", kind: "coming_soon" },
    { key: "automaster", name: "AutoMaster", description: "Dealer management.", kind: "coming_soon" },
    { key: "workshop_mate", name: "Workshop Mate", description: "Australian built workshop software.", kind: "coming_soon" },
  ],
  LAW: [
    GOOGLE_CALENDAR,
    { key: "leap", name: "LEAP", description: "The most popular Australian legal practice management software.", kind: "coming_soon" },
    { key: "smokeball", name: "Smokeball", description: "Australian law practice management.", kind: "coming_soon" },
    { key: "clio", name: "Clio", description: "Cloud legal software.", kind: "coming_soon" },
    { key: "myob_law", name: "MYOB Law", description: "Accounting-integrated legal practice management.", kind: "coming_soon" },
    { key: "actionstep", name: "ActionStep", description: "Matter management.", kind: "coming_soon" },
  ],
  SALON: [
    { key: "square_appointments", name: "Square Appointments", description: "Syncs your service menu and booking availability automatically.", kind: "square", docsUrl: "https://developer.squareup.com" },
    GOOGLE_CALENDAR,
    { key: "timely", name: "Timely", description: "Popular NZ/AU salon software.", kind: "coming_soon" },
    { key: "shortcuts", name: "Shortcuts", description: "Australian salon software.", kind: "coming_soon" },
    { key: "kitomba", name: "Kitomba", description: "Salon and spa management.", kind: "coming_soon" },
    { key: "phorest", name: "Phorest", description: "Salon management.", kind: "coming_soon" },
    { key: "fresha", name: "Fresha", description: "Free salon booking software.", kind: "coming_soon" },
  ],
  REAL_ESTATE: [
    GOOGLE_CALENDAR,
    { key: "rex_crm", name: "Rex CRM", description: "Australian real estate CRM.", kind: "coming_soon" },
    { key: "console_cloud", name: "Console Cloud", description: "Property management.", kind: "coming_soon" },
    { key: "propertyme", name: "PropertyMe", description: "Australian property management.", kind: "coming_soon" },
    { key: "re_leased", name: "Re-Leased", description: "Commercial property management.", kind: "coming_soon" },
  ],
  UNIVERSITY: [
    GOOGLE_CALENDAR,
    { key: "microsoft_outlook_calendar", name: "Microsoft Outlook Calendar", description: "Sync advising sessions with Outlook.", kind: "coming_soon" },
    { key: "calendly", name: "Calendly", description: "Simple scheduling links.", kind: "coming_soon" },
  ],
  RETAIL: [
    { key: "square_retail", name: "Square for Retail", description: "Syncs your product catalog automatically.", kind: "square", docsUrl: "https://developer.squareup.com" },
    { key: "shopify", name: "Shopify", description: "Ecommerce platform.", kind: "coming_soon" },
    { key: "lightspeed_retail", name: "Lightspeed Retail", description: "Retail POS.", kind: "coming_soon" },
    { key: "vend_lightspeed", name: "Vend by Lightspeed", description: "Retail POS.", kind: "coming_soon" },
    { key: "myob", name: "MYOB", description: "Australian accounting and retail.", kind: "coming_soon" },
  ],
  BANK: [
    GOOGLE_CALENDAR,
    { key: "microsoft_outlook", name: "Microsoft Outlook", description: "Appointment booking sync.", kind: "coming_soon" },
  ],
  MEDICAL: [GOOGLE_CALENDAR],
  DENTAL: [GOOGLE_CALENDAR],
  OTHER: [GOOGLE_CALENDAR],
};

export function getIntegrationsCatalog(vertical: string | null | undefined): CatalogIntegration[] {
  if (!vertical || !CATALOG[vertical]) return [GOOGLE_CALENDAR];
  return CATALOG[vertical];
}
