"use client";

export interface SubNavItem {
  id: string;
  label: string;
}

// Sticky in-page jump nav — real anchors to real sections below, no
// scroll-spy magic that could silently break; just smooth-scroll links.
export function SolutionSubNav({ items }: { items: SubNavItem[] }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6 py-2.5 text-sm scrollbar-none">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-[#475569] transition hover:bg-slate-100 hover:text-[#0f172a]"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
