import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href: string;
}

// One component for both the visible breadcrumb nav and its matching
// BreadcrumbList schema — Google's guidelines expect structured data to
// mirror visible content, same reasoning as the FAQ sections built last
// task. `crumbs` excludes the current page's own trailing entry only if
// you want it non-linked; typical usage includes Home as the first entry.
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `https://zyncoai.com${c.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#94a3b8]">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {isLast ? (
                  <span className="font-medium text-[#475569]" aria-current="page">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-[#0f172a]">
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
