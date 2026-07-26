import { askClaude, extractJson } from "./claude";
import { getKnownItems, KnownItems } from "./wanikani";
import { StoryPayload, validateStory } from "./validate";

export type Difficulty = "easy" | "normal" | "hard";

export interface StoryResult extends StoryPayload {
  attempts: number;
  violationsFixed: string[]; // kanji the retry loop caught and removed
  knownKanjiCount: number;
  knownVocabCount: number;
}

const MAX_ATTEMPTS = 3;

const SYSTEM_PROMPT = `You write tiny Japanese stories for a beginner learner, constrained to the kanji they know. You always reply with ONLY a single JSON object, no code fences, no commentary.`;

function buildPrompt(known: KnownItems, difficulty: Difficulty): { prompt: string; allowed: Set<string> } {
  const guruPlus = (srs: number) => srs >= 5;
  const kanjiPool = difficulty === "easy" && known.kanji.filter((k) => guruPlus(k.srsStage)).length >= 15
    ? known.kanji.filter((k) => guruPlus(k.srsStage))
    : known.kanji;
  const vocabPool = difficulty === "easy" && known.vocab.filter((v) => guruPlus(v.srsStage)).length >= 20
    ? known.vocab.filter((v) => guruPlus(v.srsStage))
    : known.vocab;

  const allowed = new Set(kanjiPool.map((k) => k.char));

  // Newest = lowest SRS stage; used to bias "hard" mode toward reinforcement.
  const newest = [...known.vocab]
    .filter((v) => v.srsStage <= 2)
    .slice(0, 15)
    .map((v) => v.word);

  const emphasis =
    difficulty === "hard" && newest.length > 0
      ? `Work in as many of these recently-learned words as you naturally can: ${newest.join("、")}.`
      : difficulty === "easy"
        ? "Keep it very simple and comfortable."
        : "";

  const prompt = `Write a very short Japanese story (3-6 sentences, roughly 100-200 characters) for a WaniKani level ${known.level} learner.

HARD CONSTRAINT — allowed kanji. Every kanji character in the story and title MUST come from this set. Any other word must be written entirely in hiragana or katakana, even if it is normally written with kanji:
${[...allowed].join("")}

Vocabulary the learner knows (prefer these words): ${vocabPool.map((v) => v.word).join("、")}

${emphasis}

Use only simple grammar (JLPT N5). Natural, story-like tone — not a textbook drill.

Reply with ONLY this JSON structure:
{
  "title": "story title in Japanese (same kanji constraint applies)",
  "segments": [
    {"t": "text run containing kanji", "f": "its reading in hiragana"},
    {"t": "text run with no kanji"}
  ],
  "vocab": [{"word": "...", "reading": "...", "meaning": "..."}],
  "translation": "full English translation"
}

Rules for segments: split the story so that every run containing kanji is its own segment with its hiragana reading in "f"; kana-only and punctuation runs have no "f". Concatenating all "t" values must reproduce the story exactly. "vocab" lists the learner's known words you used.`;

  return { prompt, allowed };
}

export async function generateStory(difficulty: Difficulty = "normal"): Promise<StoryResult> {
  const known = await getKnownItems();
  return generateStoryFromKnown(known, difficulty);
}

export async function generateStoryFromKnown(
  known: KnownItems,
  difficulty: Difficulty = "normal"
): Promise<StoryResult> {
  if (known.kanji.length === 0) {
    throw new Error("No started kanji found on this WaniKani account yet — do a few lessons first.");
  }
  const { prompt, allowed } = buildPrompt(known, difficulty);

  const violationsFixed: string[] = [];
  let feedback = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const raw = await askClaude(SYSTEM_PROMPT, feedback ? `${prompt}\n\n${feedback}` : prompt);
    const story = extractJson(raw) as StoryPayload;
    const check = validateStory(story, allowed);

    if (check.ok) {
      return {
        ...story,
        attempts: attempt,
        violationsFixed,
        knownKanjiCount: allowed.size,
        knownVocabCount: known.vocab.length,
      };
    }

    violationsFixed.push(...check.violations);
    const problems: string[] = [];
    if (check.violations.length > 0) {
      problems.push(
        `these kanji are NOT in the allowed set and must be rewritten in kana or replaced: ${check.violations.join("、")}`
      );
    }
    if (check.badFurigana.length > 0) {
      problems.push(`these "f" furigana values are not pure hiragana/katakana: ${check.badFurigana.join("、")}`);
    }
    if (check.tooShort) {
      problems.push(
        `the "segments" array must contain the FULL story text (3-6 sentences), split into runs — it currently reconstructs to almost nothing`
      );
    }
    feedback = `Your previous attempt was rejected by automatic validation: ${problems.join("; ")}. Rewrite the story fixing exactly these issues while keeping all other constraints.`;
  }

  throw new Error(
    `Story failed kanji-whitelist validation after ${MAX_ATTEMPTS} attempts (leaked: ${[...new Set(violationsFixed)].join("、")})`
  );
}
