// Server-only helper — fetches the operating legal entity name + ABN from
// the real platform settings (not a hardcoded frontend literal), so an
// incorporation change (sole trader -> Pty Ltd) is a settings edit on the
// admin side, not a frontend code hunt. Used by the marketing footer and
// the three legal docs (privacy, terms, DPA) that need a formal party name.
import { BACKEND_BASE } from "@/lib/backendAuth";

export interface LegalEntity {
  abn: string | null;
  legalEntityName: string | null;
}

const FALLBACK: LegalEntity = { abn: null, legalEntityName: null };

export async function getLegalEntity(): Promise<LegalEntity> {
  try {
    // Revalidated hourly — this changes maybe once a lifetime (an
    // incorporation event), not worth a live round-trip on every request.
    const res = await fetch(`${BACKEND_BASE}/api/legal-entity/public`, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    return { abn: data.abn ?? null, legalEntityName: data.legalEntityName ?? null };
  } catch {
    return FALLBACK;
  }
}

// "Shah Shakil trading as ZyncoAI (ABN 38 138 129 187)" — the full formal
// party-identification form for legal-doc clauses. Falls back to the brand
// name alone if either piece isn't configured yet, rather than printing a
// broken/partial sentence.
export function formatLegalParty(entity: LegalEntity): string {
  if (!entity.legalEntityName) return "ZyncoAI";
  return entity.abn ? `${entity.legalEntityName} (ABN ${entity.abn})` : entity.legalEntityName;
}
