// Vertical-aware clinic/operations portal — display config. One shared
// engine (ClinicPatientPanel, finance/claims/documents pages, Settings
// compliance tab) reused across MEDICAL/DENTAL/MECHANIC/RESTAURANT/LAW/
// BANK/UNIVERSITY/SALON, not seven bespoke portals: Claim doubles as
// "insurance claim" / "legal matter" / "gift voucher" / "WorkCover incident"
// depending on vertical, same as Appointment already doubles as
// "job/order/session" via the pre-existing recordType/metadata convention.
//
// This is the DISPLAY half — labels, claim-type option text, extra-field
// form schemas, doc-type suggestions. The matching allow-lists that
// actually enforce which claimTypes/metadata keys a vertical may write
// live server-side in backend/src/lib/verticalOps.ts; keep the two in sync
// (same vertical key list, same claimType/field-key values) since this
// file only controls what renders, not what the API accepts.
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";

export type PortalVertical = "MEDICAL" | "DENTAL" | "MECHANIC" | "RESTAURANT" | "LAW" | "BANK" | "UNIVERSITY" | "SALON" | "RETAIL" | "REAL_ESTATE" | "OTHER";

export interface ExtraFieldSpec {
  key: string; // Contact.metadata key
  label: string;
  type: "text" | "date" | "number" | "select" | "checkbox";
  options?: string[]; // for type: "select"
  placeholder?: string;
}

export interface ClaimTypeOption {
  value: string; // PayerType enum member
  label: string;
}

export interface VerticalOpsConfig {
  vertical: PortalVertical;
  contactLabel: string;
  contactLabelPlural: string;
  providerLabel: string;
  bookingLabel: string; // reused from verticalTheme's panels.recordNoun
  insuranceTabLabel: string;
  extraFields: ExtraFieldSpec[];
  claimsEnabled: boolean;
  claimsLabel: string;
  claimTypes: ClaimTypeOption[];
  claimFieldLabels: {
    insurerName: string;
    claimNumber: string;
    billedAmountCents: string;
    approvedAmountCents: string;
    paidAmountCents: string;
  };
  claimStatusLabels?: Record<string, string>;
  documentsLabel: string;
  docLabelSuggestions: string[]; // quick-pick free-text labels (stored in ClinicDocument.scanType)
  providerNoteLabel: string; // relabel of the DOCTOR-only "Clinical" note kind
  vipLabel: string | null; // null hides the checkbox entirely
  atRiskLabel: string | null;
  trustLedgerEnabled: boolean; // LAW only
  timeRecordingEnabled: boolean; // LAW only
  menuEnabled: boolean; // RESTAURANT/SALON/RETAIL only
  menuLabel: string;
  // 2026-08-06 — the actual route-level feature flags for the two
  // vertical-exclusive dashboard pages (/dashboard/clinical,
  // /dashboard/kitchen). Previously each page hardcoded its own
  // vertical === "X" check (or, for /dashboard/clinical, had none at
  // all — see VerticalGate.tsx's comment for the bug this caused).
  // Centralized here so there's exactly one place that decides which
  // vertical gets which vertical-exclusive page.
  clinicalEnabled: boolean; // MEDICAL/DENTAL only
  kitchenEnabled: boolean; // RESTAURANT only
  complianceLogLabel: string;
  complianceLogPlaceholder: string;
  financeLabels: {
    byPayer: string; // "Revenue by Payer Type" / "Revenue by Claim Type" / hidden
    byPayerEnabled: boolean;
    byFundEnabled: boolean; // Private Health — by Fund tile, MEDICAL/DENTAL only
    byProvider: string; // "Revenue by Doctor" / "Revenue by Mechanic" / ...
    byService: string; // "Revenue by Service Type" / "Revenue by Job Type" / ...
    productivity: string; // "Doctor productivity" / "Mechanic productivity" / "Advisor workload" / ...
    rebateLabel: string | null; // "Medicare rebates" — null hides the tile
    gapLabel: string | null; // "Gap payments collected" — null hides the tile
    partsLabourEnabled: boolean; // MECHANIC only
  };
}

function base(vertical: PortalVertical, overrides: Partial<VerticalOpsConfig>): VerticalOpsConfig {
  return {
    vertical,
    contactLabel: "Contact",
    contactLabelPlural: "Contacts",
    providerLabel: "Staff",
    bookingLabel: getVerticalTheme(vertical).panels.recordNoun,
    insuranceTabLabel: "Details",
    extraFields: [],
    claimsEnabled: false,
    claimsLabel: "Claims",
    claimTypes: [],
    claimFieldLabels: { insurerName: "Insurer", claimNumber: "Claim number", billedAmountCents: "Billed", approvedAmountCents: "Approved", paidAmountCents: "Paid" },
    documentsLabel: "Documents",
    docLabelSuggestions: [],
    providerNoteLabel: "Staff note",
    vipLabel: "VIP",
    atRiskLabel: "At-risk flag",
    trustLedgerEnabled: false,
    timeRecordingEnabled: false,
    menuEnabled: false,
    menuLabel: "Menu & Pricing",
    clinicalEnabled: false,
    kitchenEnabled: false,
    complianceLogLabel: "Compliance Log",
    complianceLogPlaceholder: "e.g. Fridge temperature check — 3°C, within range",
    financeLabels: {
      byPayer: "Revenue by Payer Type", byPayerEnabled: false, byFundEnabled: false,
      byProvider: "Revenue by Staff", byService: "Revenue by Type", productivity: "Staff Productivity",
      rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
    },
    ...overrides,
  };
}

const MEDICAL_DENTAL = base("MEDICAL", {
  contactLabel: "Patient", contactLabelPlural: "Patients", providerLabel: "Doctor",
  insuranceTabLabel: "Insurance Details",
  claimsEnabled: true, claimsLabel: "Claims",
  claimTypes: [
    { value: "MEDICARE_BULK_BILL", label: "Medicare bulk billing" }, { value: "PRIVATE_HEALTH", label: "Private health fund" },
    { value: "PRIVATE_BILLING", label: "Private billing" }, { value: "DVA", label: "DVA" },
    { value: "WORKCOVER", label: "WorkCover" }, { value: "CTP", label: "CTP" }, { value: "NDIS", label: "NDIS" }, { value: "OTHER", label: "Other" },
  ],
  claimFieldLabels: { insurerName: "Insurer / fund", claimNumber: "Claim number", billedAmountCents: "Billed", approvedAmountCents: "Approved", paidAmountCents: "Paid" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Referral", "Specialist report", "Imaging report", "Pathology report", "Insurance form", "Consent form", "Scan result"],
  providerNoteLabel: "Clinical note",
  clinicalEnabled: true,
  vipLabel: "VIP patient", atRiskLabel: "At-risk flag (owner/admin only)",
  financeLabels: {
    byPayer: "Revenue by Payer Type", byPayerEnabled: true, byFundEnabled: true,
    byProvider: "Revenue by Doctor", byService: "Revenue by Service Type", productivity: "Doctor Productivity",
    rebateLabel: "Medicare rebates", gapLabel: "Gap payments collected", partsLabourEnabled: false,
  },
});

const MECHANIC = base("MECHANIC", {
  contactLabel: "Customer", contactLabelPlural: "Customers", providerLabel: "Mechanic/Technician",
  insuranceTabLabel: "Vehicle & Insurance",
  extraFields: [
    { key: "vehicleMake", label: "Vehicle make", type: "text", placeholder: "e.g. Toyota" },
    { key: "vehicleModel", label: "Vehicle model", type: "text", placeholder: "e.g. Corolla" },
    { key: "vehicleYear", label: "Year", type: "number" },
    { key: "vin", label: "VIN", type: "text" },
    { key: "registrationNumber", label: "Registration number", type: "text" },
    { key: "registrationExpiry", label: "Registration expiry", type: "date" },
    { key: "ctpInsurer", label: "CTP insurer", type: "text" },
    { key: "comprehensiveInsurer", label: "Comprehensive insurer", type: "text" },
    { key: "policyNumber", label: "Policy number", type: "text" },
  ],
  claimsEnabled: true, claimsLabel: "Claims & Warranty",
  claimTypes: [
    { value: "CTP", label: "CTP insurance" }, { value: "COMPREHENSIVE_INSURANCE", label: "Comprehensive insurance" },
    { value: "WARRANTY", label: "Warranty claim" }, { value: "OTHER", label: "Other" },
  ],
  claimFieldLabels: { insurerName: "Insurer", claimNumber: "Claim number", billedAmountCents: "Billed", approvedAmountCents: "Approved", paidAmountCents: "Paid" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Job quote", "Invoice", "Vehicle inspection report", "CTP claim form", "Insurance repair authority", "Warranty documentation", "Parts receipt"],
  providerNoteLabel: "Mechanic's note",
  vipLabel: "VIP customer", atRiskLabel: "Flagged customer (owner/admin only)",
  financeLabels: {
    byPayer: "Revenue by Claim Type", byPayerEnabled: true, byFundEnabled: false,
    byProvider: "Revenue by Mechanic", byService: "Revenue by Job Type", productivity: "Mechanic Productivity",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: true,
  },
});

const RESTAURANT = base("RESTAURANT", {
  contactLabel: "Customer", contactLabelPlural: "Customers", providerLabel: "Chef/Manager",
  insuranceTabLabel: "Customer Details",
  extraFields: [
    { key: "dietaryNotes", label: "Dietary notes", type: "text", placeholder: "Allergies, preferences" },
    { key: "preferredTable", label: "Preferred table", type: "text" },
    { key: "partySize", label: "Usual party size", type: "number", placeholder: "e.g. 4" },
  ],
  claimsEnabled: true, claimsLabel: "Incidents",
  claimTypes: [{ value: "WORKCOVER", label: "Kitchen injury (WorkCover)" }, { value: "OTHER", label: "Other incident" }],
  claimFieldLabels: { insurerName: "Insurer", claimNumber: "Incident number", billedAmountCents: "Claimed amount", approvedAmountCents: "Approved", paidAmountCents: "Paid" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Supplier invoice", "Menu", "Incident report"],
  providerNoteLabel: "Manager's note",
  vipLabel: "VIP customer", atRiskLabel: "Flagged customer (owner/admin only)",
  menuEnabled: true, menuLabel: "Menu & Pricing",
  kitchenEnabled: true,
  complianceLogLabel: "Food Safety Compliance Log",
  complianceLogPlaceholder: "e.g. Fridge temperature check — 3°C, within range",
  financeLabels: {
    byPayer: "Revenue by Incident Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Revenue by Chef/Manager", byService: "Revenue by Meal Period", productivity: "Staff Productivity",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const LAW = base("LAW", {
  contactLabel: "Client", contactLabelPlural: "Clients", providerLabel: "Solicitor/Barrister",
  insuranceTabLabel: "Matter Details",
  extraFields: [
    { key: "matterType", label: "Matter type", type: "text", placeholder: "e.g. Conveyancing, Family law" },
    { key: "conflictCheckCompleted", label: "Conflict of interest check completed", type: "checkbox" },
    { key: "conflictCheckDate", label: "Conflict check date", type: "date" },
    { key: "costAgreementSigned", label: "Cost agreement signed", type: "checkbox" },
    { key: "costAgreementDate", label: "Cost agreement date", type: "date" },
  ],
  claimsEnabled: true, claimsLabel: "Matters",
  claimTypes: [{ value: "OTHER", label: "Matter" }],
  claimFieldLabels: { insurerName: "Opposing party / court", claimNumber: "Matter number", billedAmountCents: "Fees billed", approvedAmountCents: "Fees quoted", paidAmountCents: "Fees paid" },
  claimStatusLabels: { LODGED: "Open", PENDING: "Active", APPROVED: "Closed", REJECTED: "Discontinued" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Affidavit", "Brief", "Contract", "Court order", "Cost agreement"],
  providerNoteLabel: "Solicitor's note",
  vipLabel: null, atRiskLabel: null,
  trustLedgerEnabled: true, timeRecordingEnabled: true,
  financeLabels: {
    byPayer: "Revenue by Matter Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Revenue by Solicitor", byService: "Revenue by Matter Type", productivity: "Solicitor Billable Hours",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const BANK = base("BANK", {
  contactLabel: "Customer", contactLabelPlural: "Customers", providerLabel: "Banker/Advisor",
  insuranceTabLabel: "KYC & Details",
  extraFields: [
    { key: "kycStatus", label: "KYC status", type: "select", options: ["Not started", "Pending", "Verified", "Rejected"] },
    { key: "kycVerifiedDate", label: "KYC verified date", type: "date" },
    { key: "branch", label: "Branch", type: "text" },
  ],
  claimsEnabled: false,
  documentsLabel: "Documents",
  docLabelSuggestions: [],
  providerNoteLabel: "Advisor's note",
  vipLabel: null, atRiskLabel: "Flagged customer (owner/admin only)",
  financeLabels: {
    byPayer: "Revenue by Service Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Branch Performance", byService: "Service Type Breakdown", productivity: "Banker Schedule Utilisation",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const UNIVERSITY = base("UNIVERSITY", {
  contactLabel: "Student", contactLabelPlural: "Students", providerLabel: "Advisor/Lecturer",
  insuranceTabLabel: "Student Details",
  extraFields: [
    { key: "studentId", label: "Student ID", type: "text" },
    { key: "enrolmentStatus", label: "Enrolment status", type: "select", options: ["Enrolled", "On leave", "Withdrawn", "Graduated"] },
    { key: "department", label: "Department", type: "text" },
  ],
  claimsEnabled: false,
  documentsLabel: "Documents",
  docLabelSuggestions: [],
  providerNoteLabel: "Course progress note",
  vipLabel: null, atRiskLabel: "Welfare flag (owner/admin only)",
  financeLabels: {
    byPayer: "Revenue by Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Advisor Workload", byService: "Department Breakdown", productivity: "Advisor Workload",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const SALON = base("SALON", {
  contactLabel: "Client", contactLabelPlural: "Clients", providerLabel: "Therapist/Stylist",
  insuranceTabLabel: "Client Preferences",
  extraFields: [
    { key: "preferredStylist", label: "Preferred therapist/stylist", type: "text" },
    { key: "allergyNotes", label: "Allergy / patch-test notes", type: "text" },
  ],
  claimsEnabled: true, claimsLabel: "Gift Vouchers",
  claimTypes: [{ value: "WARRANTY", label: "Gift voucher" }, { value: "OTHER", label: "Service warranty" }],
  claimFieldLabels: { insurerName: "Issued by", claimNumber: "Voucher code", billedAmountCents: "Voucher value", approvedAmountCents: "—", paidAmountCents: "Redeemed amount" },
  claimStatusLabels: { LODGED: "Active", PENDING: "Active", APPROVED: "Redeemed", REJECTED: "Expired" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Gift voucher", "Product receipt"],
  providerNoteLabel: "Therapist's note",
  vipLabel: "VIP client", atRiskLabel: "Flagged client (owner/admin only)",
  menuEnabled: true, menuLabel: "Service Menu & Pricing",
  financeLabels: {
    byPayer: "Revenue by Voucher Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Revenue by Therapist/Stylist", byService: "Revenue by Service Type", productivity: "Staff Commissions",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

// 2026-08-06 — added to close a real gap: these three were previously
// entirely absent from PortalVertical, so getVerticalOps() returned null
// for them and every claims/documents/finance/menu page fell back to
// generic labels (or, for claims/documents/finance, didn't render at all —
// see Sidebar.tsx's ops-gated nav items). RETAIL reuses SALON's shape
// (they already share pricing — platformSettings.ts's VERTICAL_PLAN_ALIAS)
// since a retail shop's "menu" is genuinely a product/price catalog.
// REAL_ESTATE and OTHER get honest, minimal configs — no invented
// claims/compliance content where the product doesn't actually have a
// verified feature backing it (LAW_REFERENCES stays empty for these three
// in the backend copy for the same reason).
const RETAIL = base("RETAIL", {
  contactLabel: "Customer", contactLabelPlural: "Customers", providerLabel: "Staff",
  insuranceTabLabel: "Customer Details",
  claimsEnabled: true, claimsLabel: "Returns & Warranty",
  claimTypes: [{ value: "WARRANTY", label: "Warranty claim" }, { value: "OTHER", label: "Return / refund" }],
  claimFieldLabels: { insurerName: "Supplier", claimNumber: "Reference number", billedAmountCents: "Claimed amount", approvedAmountCents: "Approved", paidAmountCents: "Refunded" },
  documentsLabel: "Documents",
  docLabelSuggestions: ["Receipt", "Warranty card", "Supplier invoice"],
  providerNoteLabel: "Staff note",
  vipLabel: "VIP customer", atRiskLabel: "Flagged customer (owner/admin only)",
  menuEnabled: true, menuLabel: "Product Catalog & Pricing",
  financeLabels: {
    byPayer: "Revenue by Claim Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Revenue by Staff", byService: "Revenue by Category", productivity: "Staff Productivity",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const REAL_ESTATE = base("REAL_ESTATE", {
  contactLabel: "Client", contactLabelPlural: "Clients", providerLabel: "Agent",
  insuranceTabLabel: "Property Details",
  extraFields: [
    { key: "propertyAddress", label: "Property address", type: "text" },
    { key: "listingType", label: "Listing type", type: "select", options: ["Sale", "Rental", "Property Management"] },
  ],
  claimsEnabled: false,
  documentsLabel: "Documents",
  docLabelSuggestions: ["Contract of sale", "Lease agreement", "Property report"],
  providerNoteLabel: "Agent's note",
  vipLabel: "VIP client", atRiskLabel: null,
  financeLabels: {
    byPayer: "Revenue by Listing Type", byPayerEnabled: false, byFundEnabled: false,
    byProvider: "Revenue by Agent", byService: "Revenue by Listing Type", productivity: "Agent Productivity",
    rebateLabel: null, gapLabel: null, partsLabourEnabled: false,
  },
});

const OTHER = base("OTHER", {
  // Deliberately generic — OTHER is the honest catch-all for a vertical
  // this product doesn't have a dedicated portal for yet, not a place to
  // invent industry-specific claims/document types with no real backing.
  claimsEnabled: false,
  vipLabel: "VIP", atRiskLabel: "Flagged (owner/admin only)",
});

export const VERTICAL_OPS: Record<PortalVertical, VerticalOpsConfig> = {
  MEDICAL: MEDICAL_DENTAL,
  DENTAL: { ...MEDICAL_DENTAL, vertical: "DENTAL" },
  MECHANIC, RESTAURANT, LAW, BANK, UNIVERSITY, SALON, RETAIL, REAL_ESTATE, OTHER,
};

export const PORTAL_VERTICALS = new Set(Object.keys(VERTICAL_OPS));

export function getVerticalOps(vertical: string | null | undefined): VerticalOpsConfig | null {
  if (!vertical || !PORTAL_VERTICALS.has(vertical)) return null;
  return VERTICAL_OPS[vertical as PortalVertical];
}

export function claimStatusLabel(ops: VerticalOpsConfig, status: string): string {
  return ops.claimStatusLabels?.[status] || status;
}
