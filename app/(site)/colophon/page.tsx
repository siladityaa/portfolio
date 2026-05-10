import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon — Siladityaa Sharma",
  description:
    "The fonts, colors, grid, and stack behind siladityaa.com. Notes for the people who view-source.",
};

/**
 * Colophon — a tiny hidden page describing the fonts, the grid, and the
 * build tools. Notes for the people who notice.
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
        I get asked this enough that I figured I&rsquo;d write it down. Fonts,
        colors, the stack, the things I sat with too long. Roughly in the
        order it tends to come up.
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
              note: "I wanted PP Editorial New but didn't get around to licensing it. Instrument is on Google Fonts, free, and close enough that I haven't gone back.",
            },
            {
              label: "MONO",
              value: "JetBrains Mono",
              note: "Open-source. I use it in my editor, so the labels and timestamps on the site match what my code looks like. A bit selfish, but it works.",
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
              note: "Warm off-white instead of true white, near-black instead of pure black. Pure tones always look a bit cheap to me.",
            },
            {
              label: "INK",
              value: "#111113 / #F6F5F1",
              note: "Body text. Switches with the OS theme.",
            },
            {
              label: "GRAPHITE",
              value: "#6B6B70 / #8A8A8F",
              note: "All the secondary stuff — labels, dates, hairlines. Most of the design is just deciding which words are graphite and which are ink.",
            },
            {
              label: "SIGNAL",
              value: "#FF3B00 / #FF4A14",
              note: "Burnt orange. Polestar uses something close and I think their red is the best red on any product I've owned. Used sparingly. Cursor highlight, a couple of section numbers, the now-playing dot.",
            },
          ]}
        />

        <Section
          number="03"
          title="Grid"
          entries={[
            {
              label: "CASE STUDY",
              value: "Single column, ~1100px",
              note: "Title up top, big asset, body sections, then the rest of the assets. The first version had a TOC rail and a ruler rail on either side. I cut them — too much furniture for what is basically an article.",
            },
            {
              label: "PROSE",
              value: "68ch max",
              note: "Body text caps at 68 characters. Bigger screens get more whitespace, not wider lines.",
            },
            {
              label: "SPACING",
              value: "clamp() everywhere",
              note: "Everything uses CSS clamp(). I don't have breakpoints. The page just stretches.",
            },
          ]}
        />

        <Section
          number="04"
          title="Stack"
          entries={[
            {
              label: "FRAMEWORK",
              value: "Next.js 16",
              note: "App Router, TypeScript, Turbopack. Current stable version of all of it.",
            },
            {
              label: "STYLING",
              value: "Tailwind CSS v4",
              note: "Design tokens live in globals.css instead of a config file. There's exactly one place to look when something looks wrong.",
            },
            {
              label: "MOTION",
              value: "Framer Motion",
              note: "Cursor physics, scroll reveals, page transitions. I tried GSAP and didn't switch.",
            },
            {
              label: "CONTENT",
              value: "JSON + Zod",
              note: "All the editable copy is JSON in the repo. Zod gives me types and runtime validation from one schema. Add a field, and everything downstream complains until I update it. It saves me from myself.",
            },
            {
              label: "CMS",
              value: "Custom /admin",
              note: "React Hook Form + Zod. Saves commit straight to GitHub via Octokit. Single-user — only my GitHub login can sign in. Edits skip the Vercel build via cache tags, so updates show up in a few seconds instead of a minute.",
            },
            {
              label: "DEPLOY",
              value: "Vercel",
              note: "Git push deploys. Content-only commits skip the build via ignoreCommand. Code commits rebuild normally.",
            },
          ]}
        />

        <Section
          number="05"
          title="Influences"
          entries={[
            {
              label: "DIRECTION",
              value: "Tactile, on something quiet",
              note: "Tactile and a little playful, sitting on something quiet. The Teenage Engineering / Nothing thing in the details — labels, units, hairlines. Apple in the foundation — lots of air, very little color.",
            },
            {
              label: "REFERENCES",
              value: "OP-1, Polestar, mid-century print",
              note: "And the way Nothing photographs its products with every component called out. The throughline: nothing is unlabeled.",
            },
            {
              label: "PRINCIPLE",
              value: "Whitespace first",
              note: "If a section feels too empty, leave it. That's the test I keep coming back to.",
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
