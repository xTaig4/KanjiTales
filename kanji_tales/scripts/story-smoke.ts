// Integration smoke test: runs the REAL generation pipeline (claude -p +
// kanji-whitelist validation loop) against a synthetic level-2-ish known set.
// Run: bun run scripts/story-smoke.ts

import { generateStoryFromKnown } from "../src/lib/story";
import { KnownItems } from "../src/lib/wanikani";

const known: KnownItems = {
  username: "smoke-test",
  level: 2,
  kanji: [
    { char: "人", meaning: "Person", srsStage: 5 },
    { char: "日", meaning: "Sun", srsStage: 5 },
    { char: "一", meaning: "One", srsStage: 6 },
    { char: "二", meaning: "Two", srsStage: 5 },
    { char: "大", meaning: "Big", srsStage: 4 },
    { char: "山", meaning: "Mountain", srsStage: 4 },
    { char: "川", meaning: "River", srsStage: 3 },
    { char: "口", meaning: "Mouth", srsStage: 2 },
    { char: "女", meaning: "Woman", srsStage: 2 },
    { char: "木", meaning: "Tree", srsStage: 1 },
  ],
  vocab: [
    { word: "人", reading: "ひと", meaning: "person", srsStage: 5 },
    { word: "一人", reading: "ひとり", meaning: "alone, one person", srsStage: 4 },
    { word: "大きい", reading: "おおきい", meaning: "big", srsStage: 4 },
    { word: "山", reading: "やま", meaning: "mountain", srsStage: 4 },
    { word: "川", reading: "かわ", meaning: "river", srsStage: 3 },
    { word: "木", reading: "き", meaning: "tree", srsStage: 1 },
    { word: "女の人", reading: "おんなのひと", meaning: "woman", srsStage: 2 },
  ],
  fetchedAt: Date.now(),
};

const started = Date.now();
const story = await generateStoryFromKnown(known, "normal");
const seconds = ((Date.now() - started) / 1000).toFixed(1);

const storyText = story.segments.map((s) => s.t).join("");
console.log(`OK in ${seconds}s, attempts=${story.attempts}, violationsFixed=[${story.violationsFixed.join(",")}]`);
console.log(`title: ${story.title}`);
console.log(`story: ${storyText}`);
console.log(`translation: ${story.translation}`);
console.log(`vocab: ${story.vocab.map((v) => v.word).join("、")}`);
console.log(`segments: ${JSON.stringify(story.segments, null, 0).slice(0, 800)}`);

// Hard re-assertion, independent of the pipeline's own validation
const allowed = new Set(known.kanji.map((k) => k.char));
const leaked = [...(storyText + story.title).matchAll(/\p{Script=Han}/gu)]
  .map((m) => m[0])
  .filter((c) => !allowed.has(c));
if (leaked.length > 0) {
  console.error(`FAIL: leaked kanji reached the final story: ${leaked.join(",")}`);
  process.exit(1);
}
console.log("PASS: no kanji outside the known set");
