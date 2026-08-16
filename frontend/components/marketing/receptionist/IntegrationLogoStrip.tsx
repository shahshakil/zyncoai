"use client";
import { motion, useReducedMotion } from "framer-motion";

// 2026-08-16 — "Works with the tools you already use" strip. ONLY the
// integrations that actually have real, working sync code today (verified
// against source, not memory, before writing this file):
//   - Square: backend/src/lib/square.ts (per-business OAuth catalog sync)
//   - Google Calendar: backend/src/lib/googleCalendar.ts
//   - Microsoft Outlook: backend/src/lib/microsoftGraph.ts (real Graph API
//     OAuth + createMicrosoftCalendarEvent)
//   - Cliniko / Halaxy / Nookal / Jane App: backend/src/lib/staffSync/
//     providers/{cliniko,halaxy,nookal,janeapp}.ts, and
//     MEDICAL_PMS_PROVIDERS in ./data.ts marks all four hasDirectSync:true
// Nothing roadmap/coming-soon appears here — that distinction is already
// handled honestly elsewhere (VerticalIntegrationsSection.tsx's three-tier
// live/manual/roadmap badges). This strip is homepage-level and
// deliberately live-only, so it never needs a badge.
//
// Logo sourcing: Square and Google Calendar have real marks in the
// `simple-icons` package (CC0-licensed SVG data, the standard way to show
// a third-party brand's icon without hosting/scraping image files). The
// four practice-management vendors and Microsoft Outlook aren't in that
// library (niche/regional or product-specific), so they render as a clean
// typographic wordmark instead of an invented icon — real vendor name,
// no fabricated logomark standing in for one that doesn't exist here.
//
// Path/hex data below is copy-pasted (not imported) from simple-icons's
// siSquare/siGooglecalendar exports — verified 2026-08-16 that importing
// the package itself pulls its entire ~5MB/3453-icon barrel file into the
// client bundle (no working per-icon tree-shaken entry point in this
// version), which measured a real mobile Lighthouse regression: TBT
// 0-60ms -> 570-710ms, score 97-98 -> 78-79. Two constants instead of a
// runtime dependency gets the identical real vendor artwork with zero
// bundle cost. `simple-icons` stays in package.json only as the sourcing
// reference for future icons, not imported anywhere at runtime — to
// refresh/add one, run `node -e 'console.log(require("simple-icons").siX)'`
// and paste the result here, don't add the import back.
const SQUARE_HEX = "3E4348";
const SQUARE_PATH =
  "M4.01 0A4.01 4.01 0 000 4.01v15.98c0 2.21 1.8 4 4.01 4.01h15.98C22.2 24 24 22.2 24 19.99V4A4.01 4.01 0 0019.99 0H4zm1.62 4.36h12.74c.7 0 1.26.57 1.26 1.27v12.74c0 .7-.56 1.27-1.26 1.27H5.63c-.7 0-1.26-.57-1.26-1.27V5.63a1.27 1.27 0 011.26-1.27zm3.83 4.35a.73.73 0 00-.73.73v5.09c0 .4.32.72.72.72h5.1a.73.73 0 00.73-.72V9.44a.73.73 0 00-.73-.73h-5.1Z";
const GCAL_HEX = "4285F4";
const GCAL_PATH =
  "M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z";

interface LogoItem {
  name: string;
  kind: "icon" | "wordmark";
  path?: string;
  hex?: string;
}

const LOGOS: LogoItem[] = [
  { name: "Square", kind: "icon", path: SQUARE_PATH, hex: SQUARE_HEX },
  { name: "Google Calendar", kind: "icon", path: GCAL_PATH, hex: GCAL_HEX },
  { name: "Microsoft Outlook", kind: "wordmark" },
  { name: "Cliniko", kind: "wordmark" },
  { name: "Halaxy", kind: "wordmark" },
  { name: "Nookal", kind: "wordmark" },
  { name: "Jane App", kind: "wordmark" },
];

function LogoMark({ item }: { item: LogoItem }) {
  if (item.kind === "icon" && item.path) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill={`#${item.hex}`} aria-hidden="true">
        <path d={item.path} />
      </svg>
    );
  }
  return <span className="text-base font-bold tracking-tight text-[#334155]">{item.name}</span>;
}

export function IntegrationLogoStrip() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-y border-[#e2e8f0] bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">
          Works with the tools you already use
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {LOGOS.map((item, i) => (
            <motion.div
              key={item.name}
              className="flex items-center gap-2.5"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.05, ease: "easeOut" }}
            >
              <LogoMark item={item} />
              {item.kind === "icon" && <span className="text-base font-semibold text-[#334155]">{item.name}</span>}
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#94a3b8]">
          Automatic two-way sync — no CSV exports, no manual re-entry.
        </p>
      </div>
    </section>
  );
}
