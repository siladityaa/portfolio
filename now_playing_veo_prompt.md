# Gemini Omni / Veo prompt — Now Playing widget showcase

> Paste the **Single-block prompt** below into Gemini's video generator. Use the **Setup parameters** to constrain aspect ratio, duration, and style. The **Notes** at the bottom explain what to do if text rendering goes sideways (it often does on AI video models).

---

## Setup parameters

- **Aspect ratio:** 16:9
- **Resolution:** 1920×1080 (or higher if the model offers it)
- **Duration:** 7 seconds
- **Frame rate:** 24 fps
- **Style tag:** motion graphics / editorial / minimal UI showcase
- **Camera:** locked-off, no movement, no zoom, no parallax
- **Audio:** none (silent loop)

---

## Single-block prompt

A static, locked-off, 7-second cinematic motion-graphics shot of a minimal editorial design layout, rendered like a high-end Swiss design publication crossed with a Teenage Engineering product page. The composition is calm, flat, and 2D — there is no camera movement, no 3D, no depth of field, no shadows, no parallax. Every element lives on a single plane of paper.

**Canvas and palette.** The background is a warm, slightly textured off-white paper (hex #F6F5F1) filling the entire frame. Text is rendered in a deep near-black ink (hex #0B0B0C). Secondary labels are in soft graphite grey. There is exactly one accent color: a saturated burnt orange (hex #FF3B00), used only once or twice in the frame. Hairline rules are 1px in a faint warm grey.

**Composition (locked throughout).** Generous whitespace. Two horizontal hairline rules: one near the top of the frame, one near the bottom, both inset from the edges by about 4% of the canvas width. Above the top rule, on the left in a small all-caps monospace label: `FIG. 01 — NOW PLAYING WIDGET`. Above the top rule, on the right, the same monospace style: `SILADITYAA.COM · 2026`. Below the bottom rule, on the left: `POLL 60s · PREVIEW 30s · FALLBACK 3-STEP`. Below the bottom rule, on the right: `DETAIL — LOWER LEFT`. On the far right edge, just under the top rule, a short 40px-tall vertical accent stripe in burnt orange. The centerpiece of the frame is a single large italic serif headline, lowercase, perfectly centered horizontally and slightly above vertical center, reading exactly: *a small heartbeat.* — set in an elegant transitional italic serif similar to Instrument Serif Italic, with generous letterspacing and a final period. Directly below the headline, in small all-caps monospace, a thin subhead reads `ONE PART OF THE SITE THAT ISN'T FROZEN.` and beneath that subhead a row of evenly-spaced tiny 1px tick marks, like a Teenage Engineering measurement scale.

**The widget (bottom-left of the frame).** Anchored about 7% from the left edge and about 22% up from the bottom. Above the widget, in a tiny monospace caption: a burnt-orange `01` followed by a graphite `— WIDGET`. The widget itself is just two lines, with no card or container — pure text on the paper. Top line: a small flat black speaker icon (trapezoid shape, no detail, no waves), followed by a generous gap, followed by a monospace label, followed by a small right-pointing triangle ▸, followed by the song title in spaced monospace caps. Bottom line, in small graphite monospace, a single line of secondary metadata describing where the data came from.

**Fonts.** All caps mono text is set in JetBrains Mono Medium for labels and JetBrains Mono Regular for song titles. The center headline is set in Instrument Serif Italic. Type is rendered crisply — no fake-print grain, no analog scan effects, no glitch. The look is precise, editorial, restrained.

**Motion sequence (7 seconds, 24 fps).**

- **0.0s → 0.7s:** Everything fades in cleanly from paper-white. The top and bottom hairline rules draw in from the center outward in a quick 0.4-second pull. The corner labels and the vertical burnt-orange accent stripe fade in alongside.
- **0.2s → 1.1s:** The italic headline *a small heartbeat.* fades up with a subtle 6-pixel rise, then settles. The subhead and tick marks follow 0.3 seconds later.
- **0.4s → 1.4s:** The widget fades in. The first state is visible: `[speaker icon] NOW PLAYING ▸ OPPOSITE — DON TOLIVER`. Below it in graphite: `LAST.FM — LIVE SCROBBLE`.
- **2.1s:** A clean 0.22-second crossfade. The widget now reads `[speaker icon] 12M AGO ▸ ANCHOR — NOVO AMOR`. Subline: `LAST.FM — 12 MIN AGO`.
- **3.5s:** Another clean 0.22-second crossfade. Now reads `[speaker icon] ON REPEAT ▸ RUNAWAY — KANYE WEST`. Subline: `PINNED — EDITORIAL`.
- **4.4s → 5.3s:** A small black mouse-arrow cursor enters from the right of the widget and glides on a gentle easing curve toward the speaker icon, decelerating into position over 0.9 seconds. No trail, no sparkle, no glow — just a clean arrow.
- **5.3s → 5.45s:** The cursor lands on the speaker icon. A faint 1-pixel circular ripple expands once around the icon and dissipates.
- **5.4s → 5.8s:** The speaker icon smoothly transitions from black to burnt orange (#FF3B00). The label `NOW PLAYING` in the widget also turns burnt orange. Three small concentric arc-shaped sound waves emerge from the right side of the speaker icon, fading in and pulsing outward in a staggered rhythm (roughly one full pulse cycle per second). The subline below the widget changes to `PREVIEW — 0:07 / 0:30`.
- **5.9s → 6.4s:** The cursor fades out gently while the speaker continues to pulse.
- **6.4s → 7.0s:** Everything holds. The arcs continue their quiet pulse. The frame is calm, alive, and settled.

**Mood and tone.** Quiet, tactile, premium, restrained. Think Apple keynote calm crossed with Teenage Engineering's playful technical labeling. The animation should feel mechanical-precise and graphic-design-pure, never bouncy, never cartoonish, never glossy. No 3D, no specular highlights, no drop shadows, no blur effects, no scan lines, no film grain, no chromatic aberration. The only accent color in the entire frame is the single burnt orange, used sparingly. The frame should feel like a printed page that briefly came to life.

**Critical constraints.** All text must be rendered exactly as specified — no misspellings, no font substitutions, no extra characters. The triangle marker is the unicode `▸` (a small right-pointing solid triangle). The em-dashes are `—` (U+2014), not hyphens. The italic headline is lowercase, including the period.

---

## Notes

- **Text rendering risk.** Veo and similar models still misrender small typography occasionally. If the song titles or labels come out garbled, regenerate, or fall back to compositing the text overlays in After Effects on top of a generated paper-texture loop.
- **Loop point.** The final hold from 6.4s onward is designed so the clip can loop back to 0.0s without a visible cut, since both moments are calm and most elements are static.
- **What to avoid.** No music, no voiceover, no transitions like slide-in/slide-out, no logo whooshes, no particle effects, no light leaks, no faux-3D depth, no camera shake. This is a typographic editorial piece, not a tech ad.
- **If the model offers a reference image input,** feed it `now_playing_widget.gif` as a style/composition anchor — it will dramatically improve fidelity.
