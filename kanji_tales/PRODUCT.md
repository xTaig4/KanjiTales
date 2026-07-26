# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tai — sole user. Fullstack dev studying Japanese kanji via WaniKani (level 4, ~83 kanji / ~192 vocab as of 2026-07). Uses KanjiTales locally (`npm run dev`) on his own machine, typically right after finishing WaniKani reviews.

## Product Purpose

Generate tiny Japanese stories constrained to the kanji/vocab Tai has actually learned on WaniKani, so he can *read real Japanese* with zero frustration. It is the reward after review grinding — the fun/surprise of the story matters more than study mechanics. Success: he looks forward to opening it after reviews and reads the story with delight.

## Positioning

Unlike graded readers or other generators, every kanji in the story is machine-validated against his live WaniKani known set (generate → validate → retry loop) — no leaks, ever. Generation runs on his Claude subscription via headless `claude -p`; no API keys.

## Operating Context

- Local Next.js 15 app, desktop browser, personal machine. No auth, no deployment.
- Data source: WaniKani API v2 (token in `.env.local`), synced known set grows weekly as he levels.
- Story generation takes 15–60s per story (headless Claude call + validation retries) — the wait is part of the ritual and needs to feel good.

## Capabilities and Constraints

- Core loop: sync known items → generate story (easy/normal/hard) → render with per-segment furigana (`<ruby>`) → vocab-used list → hidden English translation.
- Validation transparency available: attempts count, caught-kanji list.
- Story text is kana-heavy at low WaniKani levels by design (few known kanji) — that is correct behavior.
- DECIDED 2026-07-26: the legacy Jisho kanji-search page and manual kanji collection (Gemini era) are dropped; the app is purely WaniKani-driven stories.
- No persistence of past stories yet (undecided whether to add).

## Brand Commitments

- Name: **KanjiTales** (GitHub: xTaig4/KanjiTales).
- Binding visual constraint (user, 2026-07-26, supersedes the earlier retro/tech pin): **modern tech design that still reflects Japanese culture**. The Y2K retro world shipped earlier the same day is explicitly retired — treat as anti-reference.

## Evidence on Hand

- Real WaniKani data via API (live known set). Real generated stories via the pipeline (e.g. 「山の犬」 e2e test 2026-07-25).
- No testimonials/marketing claims apply — personal tool.

## Product Principles

1. Delight over drill — this is the treat after reviews, not another SRS screen.
2. Never show a kanji Tai can't read; trust in the validator is the product.
3. The generation wait is a moment, not a spinner — stage it.
4. Reading comes first: furigana on demand, translation hidden until asked.
5. Zero onboarding needed — the app can assume full context.
