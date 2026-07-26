// Independent end-to-end verification: re-fetches the known set straight
// from WaniKani and re-checks a generated story JSON against it, without
// trusting the pipeline's own validation.
// Run: bun run scripts/e2e-verify.ts <path-to-story.json>

import { readFileSync } from "node:fs";
import { getKnownItems } from "../src/lib/wanikani";
import { StoryPayload } from "../src/lib/validate";

const path = process.argv[2];
if (!path) {
  console.error("usage: bun run scripts/e2e-verify.ts <story.json>");
  process.exit(1);
}

const story = JSON.parse(readFileSync(path, "utf8")) as StoryPayload & {
  attempts?: number;
  violationsFixed?: string[];
};
const known = await getKnownItems(true);
const allowed = new Set(known.kanji.map((k) => k.char));

const storyText = story.segments.map((s) => s.t).join("");
const leaked = [...new Set([...(storyText + story.title).matchAll(/\p{Script=Han}/gu)].map((m) => m[0]))]
  .filter((c) => !allowed.has(c));

console.log(`known kanji: ${allowed.size} (level ${known.level}, ${known.username})`);
console.log(`story length: ${storyText.length} chars, attempts=${story.attempts}, fixed=[${(story.violationsFixed ?? []).join(",")}]`);
console.log(`story: ${storyText}`);

if (leaked.length > 0) {
  console.error(`FAIL: kanji outside the known set: ${leaked.join("、")}`);
  process.exit(1);
}
console.log("PASS: every kanji in the story is in the live WaniKani known set");
