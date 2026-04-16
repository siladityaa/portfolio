# Project: Siladityaa — Personal Design Portfolio

You are Claude Code, working on Siladityaa's personal design portfolio.

## Before you write any code

1. **Read `portfolio_build_plan.md` in this directory from top to bottom.** It is the single source of truth for this project — visual system, information architecture, component library, NDA handling, build phases, and success criteria. Do not skim it.
2. Read `awwwards_portfolio_research.md` for background on the inspiration research that informed the plan.
3. Confirm the five open questions in section 11 of the build plan with Siladityaa before starting Phase 1:
   - Font licensing (PP Editorial New paid vs Instrument Serif free fallback)
   - Contact form backend (Resend recommended)
   - Deployment target (Vercel assumed)
   - Whether `/playground` ships in Phase 2 or Phase 5
   - Whether to include a headshot on the About page

## About Siladityaa

Senior Product Designer at Meta, working in the Wearables and AI space. Design influences: mid-century modern, brutalism, Italian and Indian design, Apple, Nothing, Polestar, Teenage Engineering. Music taste: Kanye, Drake, Novo Amor, Daft Punk. Creative with a nerd streak for hardware and AI. Most Meta work is under NDA — the portfolio must handle this tastefully (see section 6 of the build plan).

## Chosen direction

Playful & tactile (Teenage Engineering / Nothing lean) on top of an Apple-level quiet foundation. The build plan specifies everything: typography, colors, grid, motion, components, pages.

## Tech stack (decided)

- Next.js 15 with App Router + TypeScript
- Tailwind CSS v4
- Framer Motion (GSAP only if strictly necessary)
- MDX for case studies via content-collections or contentlayer
- `next/font` for self-hosted fonts
- Vercel for deployment

## Working agreements

- Implement exactly what the plan specifies. If you believe a decision should change, flag it and ask before deviating.
- Use `TODO(siladityaa)` comments anywhere real content is missing, and keep a running `content/README.md` listing placeholder areas.
- Work through the build phases in section 9 of the plan in order. Do not jump ahead.
- After each phase, pause and summarize what you built so Siladityaa can review before moving on.
- Respect reduced motion. Hit the Lighthouse performance targets in section 8.
- Every PR-worthy chunk should be committed with a short, descriptive message.

## Start here

After reading the plan and confirming the five open questions, begin **Phase 1 — Foundations** from section 9 of the build plan.
