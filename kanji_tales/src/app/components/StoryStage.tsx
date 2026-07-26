"use client";

import React, { useEffect, useState } from "react";
import { Story, StorySegment } from "../hooks/useStory";

// Group ruby segments into sentences so each line can enter on its own beat.
function toLines(segments: StorySegment[]): StorySegment[][] {
  const lines: StorySegment[][] = [[]];
  for (const seg of segments) {
    lines[lines.length - 1].push(seg);
    if (/[。！？]」?\s*$/.test(seg.t)) lines.push([]);
  }
  return lines.filter((l) => l.length > 0);
}

export default function StoryStage({
  story,
  isNew = true,
}: {
  story: Story;
  isNew?: boolean;
}) {
  const [showFurigana, setShowFurigana] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const lines = toLines(story.segments);

  useEffect(() => {
    setShowSubtitles(false);
  }, [story]);

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-5">
        {isNew && (
          <span className="kt-stamp text-sm" role="img" aria-label="new story">
            新作
          </span>
        )}
        <h2 className="kt-display kt-rough rotate-[-1.2deg] text-4xl sm:text-5xl">
          {story.title}
        </h2>
        <button
          type="button"
          onClick={() => setShowFurigana((s) => !s)}
          aria-pressed={showFurigana}
          className="kt-link ml-auto"
        >
          {showFurigana ? "ふりがなを消す" : "ふりがなを出す"}
        </button>
      </div>

      <div className="kt-story" lang="ja">
        {lines.map((line, li) => (
          <span
            key={li}
            className="kt-line"
            style={{ "--line": li } as React.CSSProperties}
          >
            {line.map((seg, si) =>
              seg.f && showFurigana ? (
                <ruby key={si}>
                  {seg.t}
                  <rt>{seg.f}</rt>
                </ruby>
              ) : (
                <React.Fragment key={si}>{seg.t}</React.Fragment>
              )
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span
          className="kt-stamp text-2xl"
          role="img"
          aria-label="kanji check passed"
        >
          検
        </span>
        <p className="kt-caption">
          漢字チェック済み。習得{story.knownKanjiCount}
          字のみ使用。
          {story.attempts > 1 &&
            ` ${story.attempts}回目で合格（${story.violationsFixed.join("、")}を修正）。`}
        </p>
      </div>

      {story.vocab.length > 0 && (
        <section aria-label="vocabulary used">
          <h3 className="kt-tag inline-block">出演 CAST</h3>
          <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
            {story.vocab.map((v, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span className="kt-display text-xl" lang="ja">
                  {v.word}
                </span>
                <span className="kt-caption" lang="ja">
                  {v.reading}
                </span>
                <span className="kt-caption ml-auto text-right">
                  {v.meaning}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="border-t-2 border-[var(--ink)] pt-4">
        <button
          type="button"
          onClick={() => setShowSubtitles((s) => !s)}
          aria-expanded={showSubtitles}
          className="kt-link"
        >
          {showSubtitles ? "字幕をかくす" : "字幕 ── show translation"}
        </button>
        {showSubtitles && (
          <p className="mt-3 max-w-[65ch] text-base leading-7">
            {story.translation}
          </p>
        )}
      </div>
    </article>
  );
}
