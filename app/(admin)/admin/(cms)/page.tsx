import Link from "next/link";

import { loadAllCaseStudies } from "@/lib/content";

interface CollectionTile {
  number: string;
  label: string;
  description: string;
  href: string;
  count: string;
}

/**
 * Admin dashboard — shows the four editable collections with item counts.
 * Each tile links into its list page.
 *
 * Step 2 — read-only. The list pages also work read-only. Forms come in
 * Step 3, save flow in Step 4, auth in Step 6.
 */
export default async function AdminDashboard() {
  const caseStudies = await loadAllCaseStudies();

  const collections: CollectionTile[] = [
    {
      number: "01",
      label: "Case studies",
      description: "Edit case study chapters and section content.",
      href: "/admin/case-studies",
      count: `${caseStudies.length} ${caseStudies.length === 1 ? "ITEM" : "ITEMS"}`,
    },
    {
      number: "02",
      label: "About",
      description: "Pulled quote, personal + professional bio, timeline, influences.",
      href: "/admin/about",
      count: "1 PAGE",
    },
    {
      number: "03",
      label: "Home",
      description: "Hero sentence and the mono subline.",
      href: "/admin/home",
      count: "1 PAGE",
    },
    {
      number: "04",
      label: "Now",
      description: "Now-playing tracks, currently/reading/building/listening, previously block.",
      href: "/admin/now",
      count: "1 BLOCK",
    },
  ];

  return (
    <div className="mx-auto max-w-[920px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        DASHBOARD
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        What do you want to edit?
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Pick a collection. Edits commit straight to GitHub and the site
        rebuilds in about 60 seconds.
      </p>

      <ul className="mt-16 flex flex-col">
        {collections.map((collection) => (
          <li key={collection.href}>
            <Link
              href={collection.href}
              className="group grid grid-cols-12 gap-6 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-8 transition-colors duration-500 ease-[var(--ease-out-soft)] last:border-b hover:bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]"
            >
              <span className="col-span-1 text-mono-s text-[color:var(--surface-graphite)]">
                {collection.number}
              </span>
              <div className="col-span-9">
                <h2 className="text-display-m italic text-[color:var(--surface-ink)]">
                  {collection.label}
                </h2>
                <p className="mt-2 text-body text-[color:var(--surface-graphite)]">
                  {collection.description}
                </p>
              </div>
              <span className="col-span-2 self-start text-right text-mono-s text-[color:var(--surface-graphite)]">
                {collection.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
