# Content placeholders — running list

Every file in this directory that needs real content from Siladityaa.
Keep this in sync with `TODO(siladityaa)` comments in the codebase —
if you add a placeholder anywhere, add a line here too.

## Populated from LinkedIn (2026-04-10, via Chrome MCP)

- **Full name:** Siladityaa Sharma
- **Pronouns:** He/Him
- **Location:** Los Angeles, CA
- **Current title:** Senior Product Designer, Meta Reality Labs
- **Concurrent role:** Adjunct Instructor, ArtCenter College of Design
  (teaches Interactive Prototyping 2)
- **Public products shipped at Meta:** Ray-Ban Stories (first-gen) and the
  second-generation Ray-Ban Meta Smart Glasses
- **Education:** ArtCenter College of Design — BS Interaction Design,
  2017–2021 (Honors, Business minor)
- **Awards:** International Design Awards, Muse Design Awards, Adobe Design
  Achievement Awards
- **Full timeline:** see `content/timeline.ts` — ten entries from the current
  Meta role back to 2018, typed and ready for Phase 3's `/about` renderer.

These drive: metadata in `app/layout.tsx`, footer credit in
`components/home/Footer.tsx`, and the About-teaser prose in
`components/home/AboutTeaser.tsx`.

## Still needed (Phase 3 / Phase 4)

- **Hero sentence** — DONE ("Experimentation. Ethics. Technology. Where
  People Come First. — currently focused on wearables and AI at Meta.")
- **Real selected work rows** on the home page. Current rows are placeholder
  titles. The Ray-Ban Stories / Ray-Ban Meta products are safe to reference
  publicly, but the specific framing (case study title, hero image, status
  flag) is a decision for Siladityaa to make, not Claude.
- **Hero stills + imagery** for each case study — `/public/work/[slug]/*`.
  Needed in Phase 4.
- **About page long-form bio** (~120 words, first-person) for Phase 3.
- **Influences grid copy** in `content/influences.ts` — placeholder text is
  in place; refine to Siladityaa's voice in Phase 3.

## Case studies

- **4–6 real case studies** in `content/work/*.mdx`. The sample file in this
  directory (`work/sample-project.mdx`) exercises every module type — copy
  that file and replace the frontmatter for each real project.
- For each project you'll need: title, timeline, role, team, status (public/nda),
  keyColor (hex), brief (≤80 words), reflection (~60 words), three impact items,
  and the `sections` array. For NDA projects, note which sections are public
  and which should render as a `LockedSection`.

## About page

- **Timeline** — employers, years, one-line role descriptions. (Phase 3)
- **12 influences** in `content/influences.ts` — placeholder copy is in place;
  refine each entry's `why` to your voice.

## Now/Footer

- **4 now-playing tracks** in `content/now.ts`. Placeholders are drawn from
  your stated taste (Kanye, Novo Amor, Daft Punk, Drake); swap for whatever's
  actually on rotation.
- **CURRENTLY / READING / BUILDING / LISTENING** in `content/now.ts`.

## Imagery (Phase 4)

- `/public/work/[slug]/*` — hero stills, explorations, before/after shots.
  Keep hero stills at 60vh worth of width. For NDA projects: use pre-approved
  ambient shots only.

## Contact

- Currently wired as `mailto:` (Phase 1 decision). If the receipt success state
  is wanted back, add a Resend API key and flip the contact flow to a form.

## Tech / config

- **Domain:** point `siladityaa.com` at Vercel when Phase 4 deploys.
