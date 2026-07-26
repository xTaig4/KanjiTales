import { describe, expect, test } from "bun:test";
import { extractHan, findViolations, validateStory, StoryPayload } from "../src/lib/validate";

const allowed = new Set(["人", "日", "一", "大", "山"]);

describe("extractHan", () => {
  test("finds kanji, ignores kana and punctuation", () => {
    expect(extractHan("わたしは人です。山が大きい！")).toEqual(["人", "山", "大"]);
  });
  test("empty for kana-only text", () => {
    expect(extractHan("こんにちは、カタカナ。")).toEqual([]);
  });
  test("handles rare/extension kanji", () => {
    expect(extractHan("𠮟る")).toEqual(["𠮟"]);
  });
});

describe("findViolations", () => {
  test("passes when all kanji are allowed", () => {
    expect(findViolations("人は日に一つ", allowed)).toEqual([]);
  });
  test("catches leaked kanji, deduplicated", () => {
    expect(findViolations("猫が猫と学校へ", allowed)).toEqual(["猫", "学", "校"]);
  });
});

describe("validateStory", () => {
  const base: StoryPayload = {
    title: "大きい山",
    segments: [
      { t: "人", f: "ひと" },
      { t: "は" },
      { t: "山", f: "やま" },
      { t: "をみます。やまはとてもきれいです。ひとはうれしいです。" },
    ],
    vocab: [{ word: "山", reading: "やま", meaning: "mountain" }],
    translation: "The person looks at the mountain. It is beautiful. They are happy.",
  };

  test("valid story passes", () => {
    expect(validateStory(base, allowed)).toEqual({
      ok: true,
      violations: [],
      badFurigana: [],
      tooShort: false,
    });
  });

  test("story shorter than 30 chars fails as tooShort", () => {
    const short = { ...base, segments: [{ t: "山", f: "やま" }, { t: "です。" }] };
    const result = validateStory(short, allowed);
    expect(result.ok).toBe(false);
    expect(result.tooShort).toBe(true);
  });

  test("kanji leak in segments fails", () => {
    const bad = { ...base, segments: [...base.segments, { t: "学校", f: "がっこう" }] };
    const result = validateStory(bad, allowed);
    expect(result.ok).toBe(false);
    expect(result.violations.sort()).toEqual(["学", "校"]);
  });

  test("kanji leak in title fails", () => {
    const bad = { ...base, title: "猫の話" };
    expect(validateStory(bad, allowed).ok).toBe(false);
  });

  test("kanji inside furigana field fails", () => {
    const bad = { ...base, segments: [{ t: "山", f: "山" }] };
    const result = validateStory(bad, allowed);
    expect(result.ok).toBe(false);
    expect(result.badFurigana).toEqual(["山"]);
  });

  test("katakana and long vowel mark are valid furigana", () => {
    const ok = { ...base, segments: [...base.segments, { t: "人", f: "ヒトー" }] };
    expect(validateStory(ok, allowed).ok).toBe(true);
  });
});
