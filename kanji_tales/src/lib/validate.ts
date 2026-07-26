// Kanji whitelist validation. LLMs reliably leak kanji outside a prompted
// allow-list, so every generated story is checked in code and regenerated
// with the specific violations fed back until it passes.

const HAN_REGEX = /\p{Script=Han}/gu;

export function extractHan(text: string): string[] {
  return text.match(HAN_REGEX) ?? [];
}

export function findViolations(text: string, allowedKanji: Set<string>): string[] {
  const seen = new Set<string>();
  for (const char of extractHan(text)) {
    if (!allowedKanji.has(char)) seen.add(char);
  }
  return [...seen];
}

export interface StorySegment {
  t: string; // text run
  f?: string; // furigana, present when t contains kanji
}

export interface StoryPayload {
  title: string;
  segments: StorySegment[];
  vocab: { word: string; reading: string; meaning: string }[];
  translation: string;
}

// Kana + basic Japanese punctuation, used to sanity-check furigana fields.
const KANA_ONLY = /^[぀-ゟ゠-ヿー]+$/u;

export interface ValidationResult {
  ok: boolean;
  violations: string[]; // kanji outside the allow-list
  badFurigana: string[]; // furigana fields that are not pure kana
  tooShort: boolean; // segments don't contain an actual story
}

const MIN_STORY_CHARS = 30;

export function validateStory(story: StoryPayload, allowedKanji: Set<string>): ValidationResult {
  const storyText = story.segments.map((s) => s.t).join("");
  const violations = findViolations(storyText + story.title, allowedKanji);
  const badFurigana = story.segments
    .map((s) => s.f)
    .filter((f): f is string => f !== undefined && f !== "" && !KANA_ONLY.test(f));
  const tooShort = storyText.length < MIN_STORY_CHARS;
  return {
    ok: violations.length === 0 && badFurigana.length === 0 && !tooShort,
    violations,
    badFurigana,
    tooShort,
  };
}
