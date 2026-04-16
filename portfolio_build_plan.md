# Siladityaa — Portfolio Build Plan

*A handoff brief for Claude Code. Everything below is the spec: read it top to bottom before writing any code, then work through the build phases in order.*

---

## 0. Who this is for

**Siladityaa** — Senior Product Designer at Meta, working in the Wearables and AI space. Creative with a deep nerd streak for hardware, AI, and the weird edges of consumer tech. Influences cluster around two poles: the quiet confidence of Apple / Polestar / mid-century modern, and the tactile, instrumented playfulness of Nothing / Teenage Engineering / brutalist editorial. Music taste (Kanye, Drake, Novo Amor, Daft Punk) leans toward things that feel crafted, layered, and a little defiant.

The portfolio has to do three jobs at once:

1. Convince a recruiter or hiring manager in 15 seconds that this person has taste and rigor.
2. Give a tasteful glimpse into Meta work that is mostly under NDA, without feeling evasive or apologetic.
3. Feel like a person — not a template. Small, intentional details over generic polish.

**Chosen direction:** *Playful & tactile (Teenage Engineering / Nothing lean), sitting on top of an Apple-level quiet foundation.* Think: a minimal editorial base layer with hardware-panel details poking through — monospace labels, dot-matrix accents, tiny unit markers, a single signal color.

---

## 1. Design principles (the DNA)

These are non-negotiable. Every decision should be checked against them.

1. **Whitespace is the primary design element.** Restraint first, detail second. If a section feels empty, it's probably right.
2. **Type does the heavy lifting.** A serif display face + a monospace UI face carry 80% of the personality. Color and imagery are support.
3. **Every UI chrome element looks like it was labeled by an engineer.** Small mono labels, section numbers, unit suffixes, timestamps. Teenage Engineering's OP-1 as the reference — everything has a name, a number, a range.
4. **Motion is felt, not seen.** No gratuitous animation. Scroll reveals, cursor states, and small micro-interactions — never a loading hero video or a parallax skybox.
5. **NDA is a feature, not a disclaimer.** The way confidential work is presented should itself be a design moment that signals taste. Recruiters should walk away thinking "I *want* to see the full deck" — not "why is this blurry?"
6. **Nerd energy is welcome, but quiet.** An Easter egg in the console, a keyboard shortcut, a rotating playlist footer — yes. Glitch effects on every heading — no.

---

## 2. Visual system

### 2.1 Color palette

A 4-color system. Tailwind config at the end of section 2.

| Token | Light mode | Dark mode | Role |
|---|---|---|---|
| `paper` | `#F6F5F1` (warm off-white, mid-century paper) | `#0B0B0C` (near black, not pure) | Page background |
| `ink` | `#111113` | `#F6F5F1` | Primary text |
| `graphite` | `#6B6B70` | `#8A8A8F` | Secondary text, labels, rules |
| `signal` | `#FF3B00` (burnt orange — Polestar / Nothing red-orange lineage) | `#FF4A14` | Accent, links, the ONE color that does work |

**Rules of thumb:**
- The `signal` color appears in roughly 3% of the pixels on any given screen. It is reserved for: the custom cursor highlight state, the "Request full case study" CTA, the footer now-playing dot, and a single decorative mark next to section numbers.
- Never gradients. Solid fills only.
- No shadows except on the custom cursor (a single 1px hairline, not a blur).

### 2.2 Typography

Two families. Both free on Google Fonts / Fontshare.

- **Display:** *PP Editorial New* (Pangram Pangram) or fallback to *Instrument Serif*. Used for project titles, the hero statement, and case-study section headers. Variable weight used generously — thin for hero, regular for body.
- **Mono / UI:** *JetBrains Mono* or *Berkeley Mono* (if licensed). Used for everything that is metadata, chrome, labels, section numbers, unit markers, the custom cursor readout, footer, nav, timestamps.
- **Body:** there is no third family. Body copy in case studies uses the display serif at a smaller size. This is intentional — it reads like a design magazine, not a blog.

**Type scale (rem):**
```
display-xl  : 6.5rem / 1.02 / -0.04em tracking   // hero
display-l   : 4.25rem / 1.05 / -0.03em           // project titles
display-m   : 2.75rem / 1.1 / -0.02em            // section heads
display-s   : 1.75rem / 1.2                      // subsections
body        : 1.0625rem / 1.55                   // prose
mono-m      : 0.875rem / 1.4 / 0.02em            // chrome labels
mono-s      : 0.75rem / 1.3 / 0.04em / uppercase // metadata
```

### 2.3 Grid + spacing

- 12-column grid, 24px gutter, max container `1280px`, outer padding `clamp(24px, 4vw, 64px)`.
- Section vertical rhythm: `120px` mobile, `200px` desktop.
- Everything snaps to an 8px baseline. No half-pixels.
- Pages have a subtle 1px hairline graphite rule at the top edge of every major section (like a hardware panel seam). This is a signature detail — do not skip it.

### 2.4 Iconography

- Use **Phosphor Icons** (`@phosphor-icons/react`) at weight `regular` or `bold`, 1rem size. No filled icons except on interactive states.
- A handful of custom SVG marks: a small section-divider glyph (•—•), a "confidential" lock variant, a play/pause for the footer now-playing, and a directional arrow for next-project navigation. These go in `/public/marks/`.

### 2.5 Motion principles

- **Easing:** one curve only, used everywhere. `cubic-bezier(0.22, 1, 0.36, 1)` — a soft-out that feels deliberate. Expose as `--ease-out-soft` and Framer Motion `ease: [0.22, 1, 0.36, 1]`.
- **Duration:** 300ms for micro (hover, cursor), 600ms for meso (reveals, section transitions), 900ms for macro (page transitions).
- **Reveal pattern:** text rises 12px and fades from 0 → 1. Staggered by 40ms for word-level, 120ms for block-level.
- **Cursor:** see section 5.4. Always running, always smoothed with `spring({ damping: 30, stiffness: 400 })`.
- **Reduced motion:** respect `prefers-reduced-motion`. Disable reveal animations, keep cursor but remove smoothing, keep hover states.

### 2.6 Tailwind tokens (drop into `tailwind.config.ts`)

```ts
theme: {
  extend: {
    colors: {
      paper: { DEFAULT: '#F6F5F1', dark: '#0B0B0C' },
      ink:   { DEFAULT: '#111113', dark: '#F6F5F1' },
      graphite: { DEFAULT: '#6B6B70', dark: '#8A8A8F' },
      signal: { DEFAULT: '#FF3B00', dark: '#FF4A14' },
    },
    fontFamily: {
      display: ['"PP Editorial New"', 'Instrument Serif', 'serif'],
      mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
    transitionTimingFunction: {
      'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  }
}
```

---

## 3. Information architecture

A single Next.js app with the following routes:

```
/                          → Home (hero + selected work + about teaser + footer)
/work                      → Index of all case studies
/work/[slug]               → Individual case study page
/about                     → About / CV / influences
/playground                → Small experiments, side projects, writing (optional, Phase 2)
/contact                   → Contact (modal-first, page as fallback)
```

**Navigation chrome:**
- Fixed top-left: `SILADITYAA` wordmark in mono-s.
- Fixed top-right: three links `WORK / ABOUT / CONTACT` in mono-s.
- Fixed bottom-left: `NOW PLAYING ▸ [rotating track]` — a tiny now-playing widget cycling through 3-4 curated tracks from Kanye / Drake / Novo Amor / Daft Punk. Pure flavor. Pauses on hover.
- Fixed bottom-right: a tiny timestamp showing local time in Menlo Park (`MLP · 14:32 PT`). Updates every minute.

These four corners are always present. They frame every page like a hardware bezel.

---

## 4. Page-by-page specs

### 4.1 Home (`/`)

**Above the fold:**
- A single sentence in `display-xl` taking up 80% of the viewport height. No image, no hero video. Just type.
  > *"I design tools for a world that hasn't arrived yet — currently focused on wearables and AI at Meta."*
- Beneath, in mono-s: `SENIOR PRODUCT DESIGNER · WEARABLES + AI · BASED IN MENLO PARK`
- In the bottom-right of the hero block, a tiny `↓ SCROLL` mark that bounces subtly (3px, 2s loop).

**Inspiration:** Ashfall's sticky hero title, Local Studio's restraint, and Nothing's type-forward home pages. The sentence carries the whole intro — no photo of you, no fancy headshot reveal.

**Selected Work section:**
- Label: `01 — SELECTED WORK` (mono-s, graphite).
- Four projects max, displayed as a vertical list (not a grid). Each row is full-width, 240px tall, with a left side containing mono project metadata and a right side containing the project title in `display-l`.
- On hover of a row: the background fills with the project's key color, the title cursor changes, and a small still image slides in from the right (no video). Other rows dim to 40% opacity.
- Click → navigates to `/work/[slug]` with a shared-element transition using Framer Motion's `layoutId`.

**Row metadata format:**
```
PROJECT 001
2024 — 2025
META · CONFIDENTIAL
[● REQUEST ACCESS]     ← signal-colored dot if NDA
```

**Inspiration:** Phantom's scroll-narrative list, Caffè Design's magazine-index feel, Form & Fun's modular row. The "● REQUEST ACCESS" dot is our signature NDA move — introduced here, used everywhere.

**About teaser:**
- Two columns. Left: a paragraph of prose (`display` at body size) introducing you in 60 words. Right: a bulleted list of "currently / recently" in mono — `CURRENTLY · Wearables & AI @ Meta`, `READING · …`, `BUILDING · …`, `LISTENING · Daft Punk — Discovery`. Update-able via a single `now.ts` file.

**Inspiration:** Derek Sivers' `/now` page culture, filtered through a hardware-panel aesthetic.

**Footer:**
- Four columns: wordmark + tagline; nav links; external links (LinkedIn, Read.cv, Are.na, email); a "last deployed" timestamp in mono + a credit line (`DESIGNED & BUILT BY SILADITYAA · 2026`).

### 4.2 Work index (`/work`)

- Full list of projects in the same row format as the home selected list, now with filters as tiny mono chips at the top: `ALL · WEARABLES · AI · CONSUMER · CONCEPT`.
- Filter chips update the list client-side with a 600ms layout animation.
- Each project row displays a tiny `[NDA]` badge in signal color if confidential.

### 4.3 Case study (`/work/[slug]`)

This is the most important page template. It must handle both public and NDA-constrained projects from the same shape.

**Layout, top to bottom:**

1. **Header bar.** Sticky. Shows: project number (`CASE STUDY 001`), project title (display), timeline (`2024 — 2025`), and a right-aligned `REQUEST FULL DECK ↗` CTA. On scroll past 400px the title collapses into the top chrome and stays pinned.
   *Inspiration: Ashfall Studio's sticky hero title.*

2. **Hero image / still.** One full-width image, 60vh. Edge-to-edge. If the project is NDA, use a stylized abstraction or a cropped detail shot that was pre-approved by Meta comms.

3. **Quick facts strip.** Four mono labels in a row: `ROLE`, `TEAM`, `TIMELINE`, `STATUS`. Each with a one-line value beneath. Status reads `PUBLIC` or `NDA · ASK FOR DECK` in signal color.

4. **The brief.** One paragraph. Max 80 words. Plain prose in the display face.

5. **Modular case study body.** Each section is a component from a fixed set (see section 5.2). The order is free per project. Public sections render normally. **Confidential sections render as a single "Locked Section" component** — a full-width block with a hairline border, a lock glyph, a mono label (`03 · DESIGN SYSTEM · NDA`), and a short description of what lives behind it (1 sentence), plus the `[● REQUEST FULL CASE STUDY]` CTA. No blur, no underlay — a clean, intentional placeholder that says "this is on purpose."

6. **Impact section.** Always public. Three big numbers in `display-l` with mono sub-labels. If actual metrics are NDA, use qualitative statements (`"Shipped in the most recent flagship review"`) rather than fake numbers.

7. **Reflection.** One paragraph, first person, talking about what you learned. Humanizes the work. Ashfall and Bleibtgleich both do this.

8. **Next project.** Two-thirds of the viewport. Giant mono `NEXT →` and the next project's title in `display-xl`. Click or press `→` key to advance. Inspired by Local Studio's directional nav.

### 4.4 About (`/about`)

Structured as a long-form editorial page — the closest the site gets to magazine-feel.

- Top: a pulled quote in `display-xl`, something like *"I make things because I like understanding how they work."* Big, centered, lots of air.
- Below: a two-column prose bio. One column personal, one column professional.
- A timeline section styled like a hardware spec sheet: `2014 — 2018 · [COMPANY] · [ROLE]` in mono, with a one-line description in display. No logos.
- An **"Influences"** section. This is where you get to show your taste. A grid of 12 small cards, each representing an influence: Nothing, Teenage Engineering, Polestar, Dieter Rams, Alvar Aalto, Charles & Ray Eames, Massimo Vignelli, Bruno Munari, Satyajit Ray, Dayanita Singh, Kanye West, Daft Punk. Each card is monochrome with a single sentence about *why*. Not a mood board — a curation with opinions. **This section is the portfolio's secret weapon** — it's the part hiring managers will screenshot.
- A "Currently" and "Previously" block that lives off the same `now.ts` file as the home.

### 4.5 Playground (`/playground`) — Phase 2

- A loose collection of side experiments, essays, tinkering. One grid, slightly messier than the work page on purpose. Each card has a title, a tiny thumbnail, and a mono date. Click opens a modal or external link.
- Include 2-3 entries as placeholders so the section doesn't feel empty. Good candidates: "Teardown of the Nothing Phone 2a," "A week with the Humane pin," "Notes on designing for ambient AI."

### 4.6 Contact

- Primary: a contact modal triggered from the `CONTACT` nav link or the `REQUEST FULL CASE STUDY` CTAs. Single form — Name, Company, Role, "What caught your eye?", Email. Submit via a Next.js route handler that posts to Resend or Loops. Success state replaces the form with a mono receipt (`TRANSMISSION RECEIVED · 2026.04.10 · 14:32 PT`). This is a design moment — the receipt should look like a bank printer tape.
- Fallback: `/contact` page with the same form + direct email + calendar link.

---

## 5. Component library

### 5.1 Chrome

- `Wordmark` (top-left corner)
- `NavLinks` (top-right)
- `NowPlaying` (bottom-left, rotating through a curated playlist defined in `content/now-playing.ts`)
- `LocalClock` (bottom-right)
- `CustomCursor` (see 5.4)
- `PageTransition` (wraps pages, does a subtle iris-in reveal on route change)

### 5.2 Case-study modules

Each takes a single props object so case studies can be authored in MDX or a simple TypeScript content file.

- `<HeroImage src alt caption?/>`
- `<QuickFacts role team timeline status/>`
- `<Brief>{children}</Brief>`
- `<SectionHeader number title subtitle?/>`
- `<ProseBlock>{children}</ProseBlock>`
- `<ImageGrid images cols?={1|2|3}/>`
- `<PullQuote>{children}</PullQuote>`
- `<BeforeAfter before after labels/>`
- `<Metric value unit label/>`  ← used in the impact row
- `<LockedSection number title description/>`  ← **the NDA treatment, Siladityaa's signature**
- `<ReflectionBlock>{children}</ReflectionBlock>`
- `<NextProject slug title/>`

### 5.3 Shared

- `<RequestAccessButton variant="inline" | "cta" | "row-dot"/>` — three visual forms of the same action, all opening the same contact modal pre-filled with `subject: "Full case study — [project title]"`.
- `<ProjectRow number year client title status onHover/>` — used on home and work index.
- `<Chip label active/>` — filter chips.
- `<Marquee>{children}</Marquee>` — only used once, in the about-page influences transition. Resist using it elsewhere.

### 5.4 Custom cursor (core detail)

- A 20px circle, hairline `ink` border, no fill. Follows cursor with a spring.
- On hover of any link: circle expands to 56px, fills signal color, and displays a tiny mono label inside — `VIEW ↗`, `OPEN`, or `REQUEST` depending on the element's `data-cursor` attribute.
- On hover of a `LockedSection` or `[● REQUEST ACCESS]` dot: label reads `REQUEST FULL DECK` and the circle gets a tiny lock glyph to the left.
- On text selection: circle becomes a vertical I-beam mono `|`.
- On the home hero: circle becomes a tiny crosshair with live `X: 412 Y: 204` readout in mono-s. This is the one moment the cursor gets *nerdy* — a nod to CAD software. Disable on mobile.

**Inspiration:** Bleibtgleich's 40+ cursor states, Ashfall's custom cursor hierarchy. The CAD crosshair on the hero is our original riff.

---

## 6. NDA case-study handling — the detailed approach

This is the single most important product decision in the portfolio. The research on award-winning sites showed that **no one explicitly handles NDA work well** — most award-winners either don't have that constraint or hide it by omission. That's our opening.

**The principle:** treat confidentiality like a design system primitive, not an apology. Every confidential moment uses the same component and the same language. Consistency makes it read as deliberate, not as cover-up.

**The treatment, from least to most hidden:**

1. **Project row on home/work index.** A small signal-colored dot sits next to the title. On hover, mono subtitle appears: `NDA · HIGHLIGHTS PUBLIC · FULL DECK ON REQUEST`. The project is still clickable.

2. **Case study hero.** Hero image is a pre-approved still (an ambient shot, a detail, or an abstract render). No blurring. The status in the quick-facts strip reads `NDA · ASK FOR DECK` in signal color.

3. **Public sections.** Rendered normally — the brief, the reflection, ambient imagery, any publicly announced information, and high-level problem framing are all shown. You can almost always write about the *problem* publicly even when the *solution* is confidential.

4. **Confidential sections.** Rendered as `<LockedSection>` — a clean full-width card with:
   - Section number (`03`) in mono-s graphite.
   - Section title (`DESIGN SYSTEM EXPLORATION`) in display-m.
   - A single hairline lock glyph in signal color.
   - One sentence describing what lives there: *"A component library for sensor feedback states, with 140+ variants across five device postures."*
   - The `REQUEST FULL CASE STUDY` CTA.
   - **No redacted black bars, no fake blur effects, no "[REDACTED]" jokes.** Those read as defensive. A confident blank card reads as deliberate.

5. **The modal.** When the CTA is clicked, the contact modal opens pre-filled with `Subject: Full case study — [Project Title]` and a sentence at the top that says: *"Happy to walk through the full deck over a 30-minute conversation. Share a bit of context and I'll send a calendar link."* This reframes the ask as an invitation to a conversation, not a gate.

**Copy library (reuse across the site):**
- Row subtitle: `NDA · HIGHLIGHTS PUBLIC · FULL DECK ON REQUEST`
- Status chip: `NDA · ASK FOR DECK`
- Locked section micro-description template: `"A [noun] exploring [domain], with [one quantitative or qualitative detail]."`
- Modal header: `"Happy to walk through the full deck. 30 minutes is usually enough."`
- Never use the word "proprietary." Never say "sorry." Never say "I wish I could share more."

---

## 7. Content you need to provide (author's checklist)

Claude Code should scaffold the site with placeholder content and flag these gaps with `TODO(siladityaa)` comments in the code and a `content/README.md` file listing what's needed:

1. **Hero sentence** (one, ~15 words).
2. **About prose** (two paragraphs, ~120 words total).
3. **Timeline** (employers, years, one-line role descriptions).
4. **4-6 case studies**, each with: title, timeline, role, team, status (public/NDA), brief (80 words), 3-6 body sections, hero image, reflection paragraph (60 words), three impact statements. For NDA projects, note which sections are public and which are locked.
5. **12 influences** for the About grid — one sentence each on why it matters to you.
6. **Now-playing playlist** (4 tracks, for the bottom-left widget).
7. **Currently / Previously block** — three to five "currently X / previously Y" items.
8. **Contact form destination** — Resend API key or Loops endpoint.
9. **Headshot** — optional. If you include one, it lives on `/about` only, and it should be black-and-white, tight crop, no smile-for-camera energy. Francesco Michelini's portrait treatment is a good reference.

---

## 8. Tech stack and implementation

- **Framework:** Next.js 15 (App Router) + TypeScript.
- **Styling:** Tailwind CSS v4 + CSS variables for tokens.
- **Motion:** Framer Motion. Add GSAP ScrollTrigger *only* if Framer Motion's `whileInView` can't handle the case-study pinning (unlikely at our scope).
- **Content:** MDX for case studies (`/content/work/*.mdx`) with frontmatter for status, title, timeline. Use `@content-collections/next` or `contentlayer` for typed MDX content.
- **Fonts:** `next/font` with the two families. Self-host to avoid flicker.
- **Analytics:** Vercel Analytics + Plausible. No cookies, no banner.
- **Email:** Resend with a React Email template that matches the site's mono-receipt aesthetic.
- **Deploy:** Vercel, custom domain (e.g., `siladityaa.com`).
- **Accessibility:** WCAG 2.1 AA. Reduced motion respected. Keyboard navigable (arrow keys for next/prev project on case study pages). Focus states use the signal color in a 2px outline.
- **Performance targets:** Lighthouse ≥ 95 all categories. Largest Contentful Paint < 1.5s on 4G. Total JS under 150KB gzipped on the home page.
- **Dark mode:** supported via `class` strategy. A tiny `◑` toggle lives in the footer. Defaults to system preference. Persists in `localStorage`.

**Project structure:**
```
app/
  layout.tsx          → chrome + providers + cursor
  page.tsx            → home
  work/page.tsx       → work index
  work/[slug]/page.tsx
  about/page.tsx
  playground/page.tsx
  contact/page.tsx
  api/contact/route.ts
components/
  chrome/             → Wordmark, NavLinks, NowPlaying, LocalClock, CustomCursor
  case-study/         → all modular section components from 5.2
  shared/             → buttons, chips, ProjectRow, marks
content/
  work/*.mdx          → case studies
  now.ts              → now-playing + currently/previously
  influences.ts       → the 12-card grid data
lib/
  motion.ts           → shared easing + reveal presets
  cursor.ts           → custom cursor state machine
styles/
  globals.css         → tokens, base, hairlines
public/
  fonts/              → PP Editorial New, JetBrains Mono
  marks/              → custom SVG glyphs
```

---

## 9. Build phases (Claude Code should tackle in this order)

### Phase 1 — Foundations (1-2 sessions)
1. Scaffold Next.js 15 + Tailwind + TypeScript.
2. Install fonts via `next/font`, configure Tailwind tokens from section 2.6.
3. Build the chrome: `CustomCursor`, `Wordmark`, `NavLinks`, `NowPlaying`, `LocalClock`. Wire into root layout.
4. Build the home page structure with placeholder copy from section 7.
5. Ship a working dark mode toggle.
6. Set up `content/` directory with typed MDX and a sample case study using every module type.

**Gate before moving on:** the home page should *feel* right with placeholder content. If it doesn't, don't proceed — the foundations are the site.

### Phase 2 — Case studies (1-2 sessions)
1. Build every module component from section 5.2.
2. Build the `/work/[slug]` template and render the sample case study end-to-end.
3. Build the `LockedSection` component and the `RequestAccessButton` variants.
4. Build the contact modal + Resend integration.
5. Build the `/work` index page with filter chips.

### Phase 3 — About + polish (1 session)
1. Build `/about` with the influences grid.
2. Build the page transition.
3. Add keyboard navigation on case-study pages.
4. Pass a full accessibility + reduced-motion audit.
5. Write the receipt success state for the contact form.

### Phase 4 — Content pass (Siladityaa)
1. Write the real case studies in MDX.
2. Swap placeholder images for real ones.
3. Fill in the 12 influences.
4. Set environment variables for Resend.
5. Deploy to Vercel and point the domain.

### Phase 5 — Nice-to-haves (optional)

**From the original brief:**
1. `/playground` page.
2. An RSS feed for `/playground` entries.
3. Console Easter egg — when you open devtools, a mono-formatted message logs: `// you're the kind of person I want to talk to — siladityaa@gmail.com`.
4. Keyboard shortcut `⌘K` opens a command palette that can navigate to any project.
5. A tiny hidden page at `/colophon` describing the fonts, the grid, and the build tools — a love letter to the people who notice.

**Polish beats added during the chapter-layout pass (2026-04-10):**
6. **Draggable Before/After comparison slider.** Currently `BeforeAfter.tsx` ships as a static side-by-side with labeled pill chips. The xiangyi version is a true drag handle with `clip-path` revealing the after over the before. Pointer-event handling, touch support, keyboard control, reduced-motion fallback.
7. **Sticky-collapse the case-study eyebrow into the chrome on deep scroll.** When the user has scrolled past the hero, the active chapter title compacts into a small fixed pill at the top of the viewport (similar to the Phase 2 `StickyHeaderPill` that was deleted in the chapter rewrite). Should not collide with `Wordmark` or `NavLinks`.
8. **Real imagery filling the placeholder blocks.** Every `ImageGrid`, `BeforeAfter`, `MockupFrame`, `TabGroup`, and `CardGrid` currently renders graphite-tinted placeholder rectangles. Phase 4 drops real files under `/public/work/[slug]/*` and the components hot-swap to `<img>` / `<Image>` with width/height inferred from the source. The `aria-label` already in place becomes the alt text.
9. **The hero sentence on the home page.** Currently set to "Experimentation. Ethics. Technology. Where People Come First. — currently focused on wearables and AI at Meta." That's the chosen sentence, but it's worth one more pass against the brief's "convince a recruiter in 15 seconds" gate.
10. **The pulled quote on `/about`.** Currently "I make things because I like understanding how they work." — the brief's example. Replace with a real line in Siladityaa's voice.
11. **The personal column of the bio on `/about`.** The professional column is sourced from LinkedIn; the personal column is `TODO(siladityaa)` placeholder. Around 60 words in your own voice.
12. **Real influence-card copy on `/about`.** `content/influences.ts` has 12 entries with placeholder "why" lines. Refine each to your real take in 15–20 words.
13. **Real `now.ts` content** — currently playing tracks, currently/reading/building/listening, previously block. Update before Phase 4 deploy.
14. **Mobile responsive pass on the case-study chapter layout.** Below 1280px the TOC and ruler hide and the body becomes single-column — verified working but could use tighter vertical rhythm and a "scroll to top" affordance on long pages.
15. **Replace `gray-matter` with `@content-collections/next`** for typed MDX at build time. Phase 1 deferred this — the gray-matter loader is fine at this scale, but typed content collections give compile-time errors when an MDX frontmatter doesn't match the schema. *(Superseded by Phase 6 — content moved off MDX to typed JSON + Zod.)*

### Phase 6 — CMS (/admin), GitHub-backed, single-user (shipped 2026-04-16)

The goal: edit every piece of content — case studies, home, about, now — without prompting Claude. Built in six sequenced steps; each independently verifiable.

**What shipped:**

1. **Content layer migration (Step 0).** All five case studies moved from `.mdx` → `.json`. `gray-matter` removed. New JSON sources at `content/{home,about,now,timeline,influences}.json` + `content/work/*.json`. Zod schemas in `content/schemas.ts` are now the single source of truth — `content/types.ts` re-exports `z.infer` types, killing the drift between runtime validation and TypeScript.
2. **Route group split (Step 1).** Root `app/layout.tsx` stripped to html/body/fonts/theme-bootstrap only. Public chrome moved to `app/(site)/layout.tsx`. Admin lives in `app/(admin)/` with `metadata.robots = { index: false }`.
3. **Admin shell + read-only lists (Step 2).** `AdminShell` (top bar + sidebar nav) matches the public site's design language — Instrument Serif + JetBrains Mono, hairline seams, paper/ink/graphite palette. Four collection list views + edit page scaffolding.
4. **Forms on react-hook-form + Zod (Step 3).** `HomeForm`, `AboutForm`, `NowForm`, `CaseStudyForm`, `ChapterEditor`, `SectionAccordion`, all 10 section `*Fields` subforms, `AddSectionCombobox`, `defaultSection` factory. Dirty-state tracking via `DirtyWarning` (`beforeunload` handler).
5. **GitHub write path (Step 4).** `lib/github.ts` wraps `@octokit/rest`: `readJsonFile` (returns `{sha, data}` or `null` on 404), `writeJsonFile` (409/422 → typed `ConflictError`). Server actions in `app/(admin)/admin/actions.ts` re-parse via Zod on the server, commit with `cms: update <collection> — <slug>`, call `revalidatePath` on success. First verified against a throwaway `cms-test` branch.
6. **Branch flip (Step 5).** `GITHUB_REPO_BRANCH` switched from `cms-test` to `main`. `cms-test` branch deleted. Every save now ships.
7. **Single-user OAuth gate (Step 6).** GitHub OAuth App with `public_repo` scope. Callback re-checks the allow-list (`ADMIN_GITHUB_LOGIN`) — mismatched logins bounce to `/admin/forbidden` with the session cookie cleared. Session is a JWE (`jose`, `dir` alg, `A256GCM`) in an httpOnly, `sameSite=lax`, 7-day cookie. `proxy.ts` (Next 16 renamed `middleware.ts`) gates `/admin/:path*` — unauthed nav redirects to `/admin/login?from=<path>` preserving the intended destination. Server actions read the OAuth token from the session cookie; commits are attributed to the real GitHub identity automatically. Dev-only fallback to `GITHUB_TEST_TOKEN` gated on `NODE_ENV !== "production"`.

**First real CMS commit on `main`:** `4802a7f` — `cms: update home — home`, attributed to `@siladityaa`, touching only `content/home.json`.

**v1 cuts (deferred to Phase 6.5 if they earn their keep):**
- Drag-and-drop reorder (up/down buttons ship in v1).
- Live preview pane.
- Autosave / draft state.
- Image upload (path strings with inline `<img>` preview validation).
- Edit history beyond `git log`.
- Rich-text editor for prose blocks (plain `<textarea>` ships in v1).
- Production OAuth App registration — v1 is `localhost`-only; register a second app or add a callback URL when promoting to prod.

**Environment contract (see `.env.example`):** 6 required vars — `GITHUB_REPO_{OWNER,NAME,BRANCH}`, `GITHUB_OAUTH_CLIENT_{ID,SECRET}`, `ADMIN_GITHUB_LOGIN`, `SESSION_COOKIE_SECRET` (≥32 chars, rotate = invalidates all sessions), `ADMIN_BASE_URL`. One dev-only optional: `GITHUB_TEST_TOKEN`.

**What stays out of the admin:** `content/timeline.json`, `content/influences.json`, and the hardcoded chapter-ruler labels. v1 covers the four collections that actually change week-to-week; timeline + influences are annual edits and not worth a form yet.

---

## 10. Inspiration → decision map

A quick index so you can trace every choice back to a specific award-winner.

| Decision | Source | Remixed how |
|---|---|---|
| Single-sentence hero, no image | Local Studio, Ashfall | Scaled up to fill 80vh with a `display-xl` sans any decoration |
| Sticky project title on case studies | Ashfall Studio | Used to anchor the NDA transition moments |
| Vertical project list (not grid) on home | Phantom, Caffè Design | Adopted wholesale, with hover-fill color |
| Custom cursor with state machine | Bleibtgleich, Ashfall | Added CAD crosshair on hero + lock state on NDA |
| Modular case-study components | Form & Fun | Extracted to MDX + a fixed module set |
| `LockedSection` for NDA | *No one does this well* | Original — our signature |
| Now-playing footer widget | Derek Sivers `/now` culture + Nothing's system bar | Music-first, hardware-panel styling |
| Local clock in corner | Teenage Engineering product UI | Literal transposition |
| Influences grid on About | Are.na channels | Curated with opinions instead of a mood board |
| Receipt-style form success state | Bank printers + Nothing's OS receipts | One of the strongest taste signals on the site |
| Mono + serif pairing | Phantom, Bleibtgleich | The serif is warmer (PP Editorial) to offset Nothing's coldness |
| Directional keyboard nav | Local Studio, Bruno Simon | Added arrow-key support |
| Two-tone paper + ink + single signal color | Polestar, Nothing | Burnt orange picked for warmth over Nothing's cool red |
| Hairline section seams | Teenage Engineering OP-1 panel seams | 1px graphite rules at every section edge |

---

## 11. What Claude Code should ask before starting

Before writing code, Claude Code should confirm:
1. Preferred font licensing path — self-host *PP Editorial New* (paid) vs free *Instrument Serif* fallback?
2. Contact form backend — Resend (recommended), Loops, or plain `mailto:`?
3. Deployment target confirmed as Vercel?
4. Should `/playground` ship in Phase 2 or Phase 5?
5. Headshot: include or omit?

Everything else in this brief is decided — implement as specified.

---

## 12. Success criteria

The portfolio is working if:

1. A recruiter can understand *what you do and what you care about* within 15 seconds of landing.
2. Any NDA case study reads as *intentionally curated* rather than *partially censored*.
3. A visitor who requests access does so because they're excited, not because they're stuck.
4. At least one recruiter screenshots the About / Influences page to share internally.
5. When you open the site a year from now, you still like it. The design holds up.

---

*End of brief. Hand this file to Claude Code and start with Phase 1.*
