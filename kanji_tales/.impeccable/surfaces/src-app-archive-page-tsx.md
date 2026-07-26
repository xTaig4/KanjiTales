---
version: 1
slug: "src-app-archive-page-tsx"
primary_target: "src/app/archive/page.tsx"
related_targets: ["src/app/archive/[id]/page.tsx"]
---

# Surface: /archive (+ /archive/[id]) — 過去公演 the programme

Scope: story archive, extension of the established Massin-stage world. Visitor mode: Experience.

Job: revisit past stories for re-reading practice. Every generated story auto-saves (POST /api/story → saveStory) as JSON under data/stories/ (gitignored personal content, no DB).

Composition: programme list — date caption ・ title in display mincho (hover vermilion) ・ difficulty/kanji-count/rewrite-flag captions right-aligned; hairline separators; entries use the .kt-plain link opt-out (no underline voice on programme rows). Detail = 再演 (encore): reuses the shared StoryStage component (extracted from home), no 新作 stamp, date + encore caption header.

Constraints: inherits all DESIGN.md rules (one vermilion voice, calm story, no boxes). listStories skips corrupt files; getStory sanitizes ids (path traversal tested).

Unresolved: no delete/rename; no pagination (fine at personal scale); キリ番 celebration still unbuilt.
