// Real-stakes archive test: saves a story through the production lib,
// lists and re-reads it, and verifies the roundtrip. The saved story
// stays in data/stories/ — it doubles as a seed for the archive page.
// Run: bun run scripts/archive-test.ts <path-to-story.json>

import { readFileSync } from "node:fs";
import { saveStory, listStories, getStory } from "../src/lib/archive";
import { StoryPayload } from "../src/lib/validate";

const path = process.argv[2];
if (!path) {
  console.error("usage: bun run scripts/archive-test.ts <story.json>");
  process.exit(1);
}

const payload = JSON.parse(readFileSync(path, "utf8")) as StoryPayload & {
  attempts?: number;
  violationsFixed?: string[];
  knownKanjiCount?: number;
  knownVocabCount?: number;
};

const saved = await saveStory({
  title: payload.title,
  segments: payload.segments,
  vocab: payload.vocab,
  translation: payload.translation,
  difficulty: "normal",
  attempts: payload.attempts ?? 1,
  violationsFixed: payload.violationsFixed ?? [],
  knownKanjiCount: payload.knownKanjiCount ?? 0,
  knownVocabCount: payload.knownVocabCount ?? 0,
});
console.log(`saved: id=${saved.id} savedAt=${saved.savedAt}`);

const all = await listStories();
if (!all.some((s) => s.id === saved.id)) {
  console.error("FAIL: saved story not in listStories()");
  process.exit(1);
}
console.log(`list: ${all.length} stories, newest first: ${all[0].title}`);

const back = await getStory(saved.id);
if (!back || back.title !== saved.title || back.segments.length !== saved.segments.length) {
  console.error("FAIL: getStory roundtrip mismatch");
  process.exit(1);
}

const evil = await getStory("../../.env.local");
if (evil !== null) {
  console.error("FAIL: path traversal not rejected");
  process.exit(1);
}

console.log("PASS: save/list/get roundtrip + id sanitization");
