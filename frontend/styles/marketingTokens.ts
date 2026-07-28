export const MK = {
  /*
  ============================================
  CONTAINER SYSTEM (Zapier-style structure)
  ============================================
  1280px → clean SaaS look
  1440px → slightly wider modern SaaS
  */

  container: "mx-auto w-full max-w-[1440px] px-6 lg:px-8",
  sectionY: "py-16 lg:py-24",

  /*
  ============================================
  SURFACES
  ============================================
  */

  card:
    "rounded-2xl border border-neutral-200 bg-white shadow-sm",

  cardSoft:
    "rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur",

  tableWrap:
    "rounded-2xl border border-neutral-200 bg-white overflow-hidden",

  panel:
    "rounded-3xl border border-neutral-200 bg-neutral-50",

  /*
  ============================================
  TYPOGRAPHY
  ============================================
  */

  h1:
    "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900",

  h2:
    "text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900",

  h3:
    "text-xl sm:text-2xl font-semibold text-neutral-900",

  lead:
    "mt-4 text-lg text-neutral-600 max-w-2xl",

  body:
    "text-base text-neutral-600",

  muted:
    "text-sm text-neutral-500",

  /*
  ============================================
  BUTTONS (Approved Style)
  ============================================
  */

  btnPrimary:
    "inline-flex items-center justify-center rounded-xl bg-[rgb(var(--brand))] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(var(--brand-hover))]",

  btnSecondary:
    "inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50",

  btnGhost:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition",

  /*
  ============================================
  INPUTS
  ============================================
  */

  input:
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-500",

  /*
  ============================================
  BADGES
  ============================================
  */

  badge:
    "inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700",

  badgeBrand:
    "inline-flex items-center rounded-full bg-[rgb(var(--brand))]/10 px-3 py-1 text-xs font-medium text-[rgb(var(--brand))]",
};
