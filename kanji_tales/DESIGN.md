---
name: KanjiTales
description: A Massin stage page fused with Japanese materials — sumi ink performing on washi paper, one vermilion voice.
colors:
  paper: "#faf9f5"
  ink: "#111110"
  ink-soft: "#55524b"
  gray-20: "#e8e6df"
  voice-red: "#d7332a"
  voice-red-deep: "#a3231c"
typography:
  display:
    fontFamily: "Shippori Mincho B1, Hiragino Mincho ProN, serif"
    fontWeight: 800
    lineHeight: 1
  story:
    fontFamily: "Shippori Mincho B1, Hiragino Mincho ProN, serif"
    fontSize: "1.7rem"
    fontWeight: 600
    lineHeight: 2.4
    letterSpacing: "0.03em"
  caption:
    fontFamily: "Courier New, Zen Kaku Gothic New, monospace"
    fontSize: "0.8rem"
    letterSpacing: "0.02em"
  tag:
    fontFamily: "Courier New, Zen Kaku Gothic New, monospace"
    fontSize: "0.75rem"
    letterSpacing: "0.12em"
  body:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, Yu Gothic, sans-serif"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "0.55em 1.6em 0.55em 1.95em"
  button-primary-hover:
    backgroundColor: "{colors.voice-red}"
    textColor: "{colors.paper}"
  button-primary-disabled:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.paper}"
  stamp:
    textColor: "{colors.voice-red}"
    padding: "0.3em 0.32em"
  tag:
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
---

# Design System: KanjiTales

## Overview

**Creative North Star: "The Page Is the Stage"**

KanjiTales is a Massin stage page fused with Japanese materials. The whole page is one theatrical surface: washi paper as the ground, sumi ink as the actors, and a single vermilion voice that only speaks as stamps, hover, and focus. Tonight's story — a tiny kanji-validated tale — performs on it. The world explicitly refuses two easy defaults: the study-app dashboard (no cards, no progress widgets, no chrome) and decorative japonisme (no cherry blossoms, no torii clip-art; Japan is present as *material* — ink, paper, hanko, stage-script language — not as ornament). The Y2K homepage world shipped earlier is retired and is an anti-reference.

The system has three typographic voices in strict roles: a heavy Shippori Mincho display that performs (roughened by a stamp-ink SVG filter, tilted a degree or two off true), a Courier typewriter caption that stage-manages (small, gray, bilingual asides and stage directions), and a calm Zen Kaku Gothic body that simply reads. Expression is concentrated in chrome, timing, and scale — the story text itself is the largest, calmest, most readable thing on the page.

Copy is Japanese-first in a stage-script register: parenthetical stage directions （幕が上がる。）, theater vocabulary for actions and states (上演する to perform, 新作 new work, 検 inspected, 出演 CAST, 字幕 subtitles), with lowercase English typewriter asides trailing after ("the page is the stage.", "show translation").

**Key Characteristics:**
- One column, one stage: everything happens on a single 760px washi surface with visible paper grain.
- Ink hierarchy, not boxes: hairline rules and hard underlines carry all structure.
- Vermilion is an event: it appears only as hanko stamps, hover, and focus — never at rest.
- Rough ink as texture: one SVG turbulence filter distresses display type and stamps; nothing else is distressed.
- Theatrical timing: sentences enter on staggered beats; the generation wait is staged, not spun.

## Colors

Two materials and one voice: sumi ink on washi paper, with vermilion reserved for seals and response.

### Primary
- **Vermilion Seal Red** (#d7332a, `--voice-red`): the single accent voice — 朱, hanko-stamp red. Used only for the red stamps (新作, 検), primary-button hover, link hover, focus outlines, and the error name-tag border. It never appears in a resting, non-stateful surface.
- **Dried Seal Red** (#a3231c, `--voice-red-deep`): the darker vermilion for error text and the hovered button's border — vermilion's shadow, never used alone as a new voice.

### Neutral
- **Washi Paper** (#faf9f5, `--paper`): the page ground, always textured with the SVG fractal-noise grain (140px tile, ~3.5% alpha) so it reads as uncoated paper, not white pixels. Also the text color on ink-filled buttons.
- **Sumi Ink** (#111110, `--ink`): all resting text, rules, underlines, radio rings, and the primary button fill. Near-black with a warm cast — ink, not #000.
- **Faded Ink** (#55524b, `--ink-soft`): captions, furigana, stage directions, the scatter letters, and the disabled button fill — ink that has receded but stays warm.
- **Hairline Gray** (#e8e6df, `--gray-20`): the thin footer rule only — the quietest line on the page.

### Named Rules
**The One Voice Rule.** Vermilion speaks only as stamps, hover, and focus — never at rest. If a screen shows red without a stamp, a pointer, or a keyboard on it, the rule is broken.

**The Ink-Only Rest Rule.** At rest the page is exactly three tones of ink on paper (ink, faded ink, hairline gray). Every other color is a response to state.

## Typography

**Display Font:** Shippori Mincho B1 (with Hiragino Mincho ProN, serif) — loaded at weights 600/700/800
**Body Font:** Zen Kaku Gothic New (with Hiragino Kaku Gothic ProN, Yu Gothic, sans-serif)
**Label/Mono Font:** Courier New (with Zen Kaku Gothic New, monospace)

**Character:** A heavy mincho that performs against a deadpan typewriter. The display voice is pressed hard into the paper — weight 800, roughened by the stamp-ink filter, rotated slightly off true; the caption voice is a stage manager's typed script, small, gray, and calm. The body sans exists only to read.

### Hierarchy
- **Masthead** (800, 3.75rem mobile / 6rem desktop `text-6xl sm:text-8xl`, line-height 1, tight tracking): KANJITALES only. Rough-ink filtered (`.kt-rough`), rotated −1°, breaks across a `<wbr>`.
- **Story Title** (800, 2.25rem / 3rem `text-4xl sm:text-5xl`): the generated title, rough-ink filtered, rotated −1.2°, opened by the 新作 stamp.
- **Story** (600, 1.7rem, line-height 2.4, letter-spacing 0.03em, `.kt-story`): the performing text itself — the largest sustained type on the page, in display mincho but *unfiltered and unrotated*. Furigana render as 0.65rem `rt` in the body sans, faded ink.
- **Stat Value / Cast Word** (800, 1.5rem / 1.25rem `text-2xl` / `text-xl`, display): WaniKani numbers and cast-list vocabulary — small performances of the display voice.
- **Difficulty Option** (800, 1.125rem `text-lg`, display): the script's choice lines; the cast selection carries a 3px ink underline (offset 4px).
- **Body** (400, 1rem, leading-7, body sans, max 65ch): the English translation under 字幕 — plain reading text.
- **Caption** (0.8rem, letter-spacing 0.02em, Courier, faded ink, `.kt-caption`): stage directions, hints, sync status, footer.
- **Tag** (0.75rem, letter-spacing 0.12em, Courier, 2px ink underline, `.kt-tag`): name-tag labels — LEVEL, 漢字 KANJI, むずかしさ, 出演 CAST.

### Named Rules
**The Rough Ink Rule.** All distress comes from one source: the `#kt-rough-ink` SVG filter (fractalNoise, baseFrequency 0.55, 2 octaves, seed 7, displacement scale 2.6), defined once in the layout. It touches only performing display moments — masthead, story title, stamps, and the pressed button — never the story body, captions, or anything meant for sustained reading.

**The Calm Story Rule.** Expression lives in chrome, timing, and scale; the story text stays large, calm, and readable. The story is set in the display face but with the lighter 600 weight, generous 2.4 line-height, no filter, no rotation, and no motion beyond its one entrance.

## Layout

One centered column, `max-width: 760px`, padded 20px (32px from the 640px `sm` breakpoint) with 40px vertical page padding — a single tall stage, never a grid of panels. The page is a flex column to full viewport height so the footer sits at the bottom even before a story exists.

Vertical rhythm uses Tailwind's 4px scale: 40px (`gap-10`) between the major acts (masthead → form → stage), 24–32px inside the masthead and story article, 8–20px within component clusters. Horizontal grouping is baseline-aligned flex with wrapping (`flex-wrap items-baseline`); the only grid is the cast list, which goes two-column at `sm` (640px) with 40px column gutters.

Structure is drawn, not boxed: a 2px ink rule closes the masthead, a 2px ink top-border opens the 字幕 subtitle strip, a 1px hairline closes the page. Slight rotations (−1° masthead, −1.2° story title, −4° stamps) are the layout's only irregularity — everything else sits flush on the column.

## Elevation & Depth

None. The system is completely flat: no box-shadows, no layered surfaces, no overlays anywhere in the build. Depth is conveyed by material instead — the paper grain texture on the ground, the rough-ink displacement on pressed type, and tone (ink → faded ink → hairline gray) for recession. A surface that needs to come forward gets bigger, heavier, or stamped — never lifted.

### Named Rules
**The Flat Stage Rule.** Nothing floats above the paper. If an element needs emphasis, change its scale, weight, or ink — never add a shadow or a layer.

## Shapes

Everything is hard-edged and square: zero border-radius on buttons, tags, stamps, and rules. The only circle in the system is the radio control (a 2px ink ring). The recurring silhouettes are the *line* (2px ink rules and underlines; 1px hairline for the quietest divider; 3px for the selected difficulty and the stamp border) and the *stamp* (a 3px vermilion border pressed at −4° through the rough-ink filter). Irregularity comes exclusively from rotation and the ink filter, never from curves.

### Named Rules
**The No Boxes Rule.** Containers are never drawn. No cards, no panels, no filled or outlined boxes around content — structure is hairline rules, hard underlines, and whitespace. The hanko stamp is the single sanctioned closed shape, and it is a seal, not a container.

## Components

### Buttons
- **Character:** a block of set ink pressed onto the paper.
- **Shape:** hard rectangle, no radius, 2px border.
- **Primary** (`.kt-button`): sumi ink fill (#111110) with washi text (#faf9f5), display mincho 700 at 1.15rem, wide 0.35em letter-spacing (left padding 1.95em vs right 1.6em to optically balance the tracking), padding 0.55em vertical. Label is a stage verb: 上演する.
- **Hover:** fill turns vermilion (#d7332a) with dried-red border (#a3231c) — the button raises its voice.
- **Active:** the rough-ink filter is applied — the press physically distresses the stamp.
- **Focus:** global 3px vermilion outline, offset 2px.
- **Disabled:** faded-ink fill and border (#55524b); no hover, no filter.
- **Text/link buttons** (`.kt-link`): Courier 0.85rem, ink text with a 2px ink underline (offset 3px), no background or border; vermilion on hover. Used for ふりがな and 字幕 toggles; in-flow links inside `main` share the same treatment.

### Inputs / Fields
- **Radio** (`.kt-radio`): the only form control. `appearance: none`, a 1em circle with a 2px ink ring on bare paper, baseline-aligned (translateY 0.12em). Checked state fills with a radial ink pattern — solid ink core (0–38%), paper gap, ink ring — a small ink target, not a colored dot. Focus shows the global vermilion outline. The selected option's *label* answers with a 3px ink underline on the display text.

### Name Tags (`.kt-tag`)
- **Style:** Courier 0.75rem, 0.12em letter-spacing, a hard 2px ink underline (padding-bottom 2px) — like typed name tags pinned above a hairline. Used for stat labels, the difficulty legend, and 出演 CAST.
- **Error variant:** the border turns vermilion and the text dried red — the tag itself carries the alarm; the message below stays plain.

### Hanko Stamps (`.kt-stamp`)
- **Style:** display mincho 700 in vermilion inside a 3px vermilion border, line-height 1, padding 0.3em/0.32em, rotated −4°, run through the rough-ink filter so both glyph and border press unevenly.
- **Role:** state as certification. 新作 (small, 0.875rem) seals a fresh story; 検 (large, 1.5rem) certifies the kanji check passed. Stamps are statements of fact, not buttons.

### Rules (`.kt-rule`)
- **Default:** 2px solid ink — the masthead's proscenium line.
- **Thin** (`.kt-rule--thin`): 1px hairline gray — the footer's quiet close.

### The Stage (signature)
The story-rendering sequence, and the world's motion grammar in full:

- **Stage directions** (loading): while Claude writes, a scatter of kana （「ものがたりを待つ」） falters above typed stage directions. Scatter glyphs decay in size per character (4rem − 0.38rem × index), drift on `kt-drift` (2.6s ease-in-out, infinite alternate, −0.4s stagger per glyph, rising ~0.3em and rotating 4°+ as opacity swells 0.35→0.9). Courier directions （作家、筆をとる。） appear one at a time on a real-time script (`kt-enter`, 0.5s ease-out) — the 15–60s wait is staged as theater, per the product principle.
- **Story entrance:** sentences are split on 。！？ and each line enters as its own block on `kt-enter` — 0.6s `cubic-bezier(0.16, 1, 0.3, 1)`, rising 0.35em out of a 3px blur, staggered 450ms per line in reading order. The curtain-up is announced to screen readers via a polite live region (新作「…」、開演。).
- **After the entrance, stillness:** the story never animates again; furigana and 字幕 toggle with no transition.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, line and direction entrances collapse to instant (0.01ms, zero delay) and the kana scatter's drift animation is removed entirely — content order and visibility are identical, only the timing disappears.

**The Staggered Curtain Rule.** Motion exists only at entrances, moves on theatrical beats (450ms per sentence), and always degrades to instant under reduced motion. Nothing loops except the waiting kana, and nothing moves while the audience is reading.

## Do's and Don'ts

### Do:
- **Do** keep vermilion (#d7332a) stateful only — stamps, hover, focus, error tags — per the One Voice Rule.
- **Do** draw all structure with rules and underlines: 2px ink for structural lines, 1px hairline gray for the quietest, 3px for selection and stamp borders.
- **Do** run performing display type (masthead-scale headings, stamps) through `filter: url(#kt-rough-ink)` and tilt it −1° to −4°; the filter is defined once in `layout.tsx`.
- **Do** write UI copy Japanese-first in the stage-script register — parenthetical stage directions in full-width （）, theater verbs (上演する, 開演), with lowercase English asides in the Courier caption voice.
- **Do** stage every wait and entrance on the established beats: `kt-enter` with a 450ms per-line stagger for content, typed stage directions for long waits, and instant rendering under reduced motion.
- **Do** keep the story itself the calmest, largest text on the page: 1.7rem / 2.4 line-height, weight 600, unfiltered, max-width bound to the 760px column.

### Don't:
- **Don't** put content in boxes, cards, or panels — the retired Y2K panel world is the explicit anti-reference; the No Boxes Rule replaces it.
- **Don't** use shadows, gradients (outside the radio's ink fill), rounded corners, or any color beyond the six tokens.
- **Don't** apply the rough-ink filter or rotation to story text, captions, or anything read at length.
- **Don't** show vermilion at rest, and don't introduce a second accent voice.
- **Don't** decorate with japonisme imagery — Japan enters as material (paper, ink, hanko, script) only.
- **Don't** loop or auto-play motion while a story is on stage; after the entrance beats, the page is still.
