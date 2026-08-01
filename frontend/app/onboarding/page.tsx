import OnboardingPageClient from "./OnboardingPageClient";

// Split into a server page.tsx + client component so this route can carry
// real metadata — the interactive wizard itself needs "use client" (state,
// effects, router), and a Client Component can't export `metadata` at all.
// Onboarding requires an authenticated, business-less user; there's
// nothing here for a search engine to usefully index.
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return <OnboardingPageClient />;
}
