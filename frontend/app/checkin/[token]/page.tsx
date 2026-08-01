import CheckInPageClient from "./CheckInPageClient";

// Server page.tsx + client component split so this route can carry real
// metadata — a tokenized per-appointment check-in page has nothing generic
// for a search engine to index, and shouldn't be discoverable by crawling.
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckInPage() {
  return <CheckInPageClient />;
}
