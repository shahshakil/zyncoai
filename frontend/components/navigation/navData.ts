import { INDUSTRIES, USE_CASES, COMPANY_SIZES } from "@/components/marketing/receptionist/data";

export type NavItem = {
  key: string;
  label: string;
  href?: string;
  mega?: {
    title: string;
    subtitle?: string;
    columns: Array<{
      heading: string;
      items: Array<{ label: string; description?: string; href: string }>;
    }>;
    cta?: { label: string; href: string };
  };
};

export const NAV: NavItem[] = [
  {
    key: "solutions",
    label: "Solutions",
    mega: {
      title: "Solutions",
      subtitle: "One AI receptionist, tuned for how your business actually runs.",
      columns: [
        {
          heading: "By industry",
          items: INDUSTRIES.map((i) => ({ label: i.navLabel, description: i.tagline, href: `/solutions/${i.slug}` })),
        },
        {
          heading: "By use case",
          items: USE_CASES.map((u) => ({ label: u.navLabel, description: u.tagline, href: `/solutions/use-case/${u.slug}` })),
        },
        {
          heading: "By company size",
          items: COMPANY_SIZES.map((s) => ({ label: s.navLabel, description: s.tagline, href: `/solutions/size/${s.slug}` })),
        },
      ],
      cta: { label: "Try the live demo", href: "/demo" },
    },
  },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "addons", label: "Add-ons", href: "/addons" },
  {
    key: "resources",
    label: "Resources",
    mega: {
      title: "Resources",
      subtitle: "Documentation, API reference, trust materials, and help.",
      columns: [
        {
          heading: "Learn",
          items: [
            { label: "Documentation", description: "How ZyncoAI works, setup guides, compliance.", href: "/resources/docs" },
            { label: "API Reference", description: "Webhooks, endpoints, sample payloads.", href: "/resources/api" },
          ],
        },
        {
          heading: "Trust",
          items: [
            { label: "Trust & Security", description: "Encryption, access controls, data residency.", href: "/resources/trust" },
            { label: "System Status", description: "Live platform status.", href: "/resources/status" },
          ],
        },
        {
          heading: "Support",
          items: [
            { label: "Help Centre", description: "FAQs, troubleshooting, billing.", href: "/resources/help" },
            { label: "Changelog", description: "What's new, fixed, and improved.", href: "/resources/changelog" },
          ],
        },
      ],
      cta: { label: "Browse all resources", href: "/resources" },
    },
  },
  { key: "about", label: "About", href: "/about" },
];
