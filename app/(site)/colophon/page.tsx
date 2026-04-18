import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon — Siladityaa Sharma",
  description:
    "The fonts, the grid, and the build tools behind siladityaa.com. A love letter to the people who notice.",
};

/**
 * Brief §5.5 — A tiny hidden page describing the fonts, the grid, and
 * the build tools. A love letter to the people who notice.
 */
export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-[720px] px-[clamp(24px,4vw,64px)] pt-[clamp(140px,22vh,260px)] pb-[clamp(80px,12vh,160px)]">
      {/* Header */}
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        COLOPHON
      </span>
      <h1 className="mt-6 max-w-[20ch] text-display-l italic text-[color:var(--surface-ink)]">
        How this site was made
      </h1>
      <p className="mt-8 max-w-[52ch] text-body text-[color:var(--surface-graphite)]">
        A love letter to the people who view-source. Every decision here was
        intentional — if something feels a certain way, it&apos;s because
        someone sat with it until it did.
      </p>

      {/* Sections */}
      <div className="mt-24 flex flex-col gap-20">
        <Section
          number="01"
          title="Typography"
          entries={[
            {
              label: "DISPLAY",
              value: "Instrument Serif",
              note: "Google Fonts — free fallback for PP Editorial New. Regular + italic, no variable weight. Hierarchy comes from size and leading, not weight.",
            },
            {
              label: "MONO",
              value: "JetBrains Mono",
              note: "400 + 500 weights. Every label, timestamp, and breadcrumb. The brief says: every UI chrome element looks like it was labeled by an engineer.",
            },
          ]}
        />

        <Section
          number="02"
          title="Colors"
          entries={[
            {
              label: "PAPER",
              value: "#F6F5F1 / #0B0B0C",
              note: "Warm off-white in light, near-black (not pure) in dark. Mid-century paper feel.",
            },
            {
              label: "INK",
              value: "#111113 / #F6F5F1",
              note: "Primary text. Inverts cleanly.",
            },
            {
              label: "GRAPHITE",
              value: "#6B6B70 / #8A8A8F",
              note: "Secondary text, labels, rules. Does 60% of the layout work.",
            },
            {
              label: "SIGNAL",
              value: "#FF3B00 / #FF4A14",
              note: "Burnt orange. Polestar / Nothing lineage. Appears in ~3% of pixels. Reserved for: cursor highlight, CTA, now-playing dot, section numbers.",
            },
          ]}
        />

        <Section
          number="03"
          title="Grid"
          entries={[
            {
              label: "CASE STUDY",
              value: "3-column at 1280px+",
              note: "TOC rail (160-200px) | content (up to 920px) | ruler (40-80px). Below 1280px the rails collapse to single column.",
            },
            {
              label: "PROSE",
              value: "60ch max-width",
              note: "Optimal reading measure. Never wider.",
            },
            {
              label: "SPACING",
              value: "clamp() everywhere",
              note: "No fixed breakpoint jumps. Fluid from 375px to 1600px.",
            },
          ]}
        />

        <Section
          number="04"
          title="Stack"
          entries={[
            {
              label: "FRAMEWORK",
              value: "Next.js 16 + App Router",
              note: "TypeScript, React 19, Turbopack.",
            },
            {
              label: "STYLING",
              value: "Tailwind CSS v4",
              note: "CSS-first configuration. Design tokens in @theme, no tailwind.config.",
            },
            {
              label: "MOTION",
              value: "Framer Motion",
              note: "Spring physics for the cursor, scroll-triggered reveals, page transitions. GSAP stayed on the bench.",
            },
            {
              label: "CONTENT",
              value: "JSON + Zod schemas",
              note: "Content lives as .json files committed to the repo. Zod schemas are the single source of truth for types + validation.",
            },
            {
              label: "CMS",
              value: "Custom /admin",
              note: "React Hook Form + Zod. Saves commit directly to GitHub via Octokit. Single-user OAuth gate.",
            },
            {
              label: "DEPLOY",
              value: "Vercel",
              note: "Git-push deploys. Every CMS save triggers a rebuild.",
            },
          ]}
        />

        <Section
          number="05"
          title="Influences"
          entries={[
            {
              label: "DIRECTION",
              value: "Playful & tactile on a quiet foundation",
              note: "Teenage Engineering / Nothing lean, sitting on Apple-level restraint. A minimal editorial base with hardware-panel details poking through.",
            },
            {
              label: "REFERENCES",
              value: "OP-1, Polestar, mid-century modern",
              note: "Monospace labels, dot-matrix accents, tiny unit markers. Everything has a name, a number, a range.",
            },
            {
              label: "PRINCIPLE",
              value: "Whitespace is the primary design element",
              note: "Restraint first, detail second. If a section feels empty, it's probably right.",
            },
          ]}
        />
      </div>

      {/* Sign-off */}
      <div className="mt-32 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] pt-8">
        <p className="text-mono-s text-[color:var(--surface-graphite)]">
          DESIGNED AND BUILT BY SILADITYAA SHARMA
        </p>
        <p className="mt-2 text-mono-s text-[color:var(--surface-graphite)]">
          LOS ANGELES, {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Section({
  number,
  title,
  entries,
}: {
  number: string;
  title: string;
  entries: { label: string; value: string; note: string }[];
}) {
  return (
    <section className="border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] pt-8">
      <div className="flex items-baseline gap-3">
        <span className="text-mono-s text-[color:var(--surface-signal)]">
          {number}
        </span>
        <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
          {title}
        </h2>
      </div>

      <dl className="mt-10 flex flex-col gap-8">
        {entries.map((entry) => (
          <div key={entry.label} className="grid grid-cols-1 gap-2 md:grid-cols-12">
            <dt className="text-mono-s text-[color:var(--surface-graphite)] md:col-span-3">
              {entry.label}
            </dt>
            <dd className="md:col-span-9">
              <span className="block text-mono-m text-[color:var(--surface-ink)]">
                {entry.value}
              </span>
              <span className="mt-1 block text-body text-[color:var(--surface-graphite)]">
                {entry.note}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
