"use client";

import React, { useEffect, useState } from "react";
import useStory, {
  Difficulty,
  fetchWaniKaniStatus,
  Story,
  StorySegment,
  WaniKaniStatus,
} from "./hooks/useStory";

const DIFFICULTIES: { value: Difficulty; jp: string; en: string }[] = [
  { value: "easy", jp: "やさしい", en: "well-known items only" },
  { value: "normal", jp: "ふつう", en: "everything started" },
  { value: "hard", jp: "きたえる", en: "drill newest items" },
];

// Stage directions type out one by one while Claude writes.
const DIRECTIONS: { after: number; text: string }[] = [
  { after: 0, text: "（幕が上がる。）" },
  { after: 4, text: "（作家、筆をとる。）" },
  { after: 14, text: "（作家、まだ書いている。）" },
  { after: 26, text: "（検閲官、漢字をあらためる。）" },
  { after: 42, text: "（検閲官、書きなおしを命じる。）" },
  { after: 60, text: "（客席、静まりかえる。）" },
  { after: 90, text: "（幕の奥で、まだ筆の音がする——）" },
];

// Group ruby segments into sentences so each line can enter on its own beat.
function toLines(segments: StorySegment[]): StorySegment[][] {
  const lines: StorySegment[][] = [[]];
  for (const seg of segments) {
    lines[lines.length - 1].push(seg);
    if (/[。！？]」?\s*$/.test(seg.t)) lines.push([]);
  }
  return lines.filter((l) => l.length > 0);
}

export default function Home() {
  const { story, loading, error, generate } = useStory();
  const [status, setStatus] = useState<WaniKaniStatus | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  useEffect(() => {
    fetchWaniKaniStatus().then(setStatus);
  }, []);

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {story && !loading ? `新作「${story.title}」、開演。` : ""}
      </div>
      <Masthead status={status} />
      <main className="flex flex-1 flex-col gap-10 pt-10">
        <StageForm
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          disabled={loading || !status?.connected}
          onSubmit={() => generate(difficulty)}
          idle={!story && !loading && !error}
        />
        {status !== null && !status.connected && (
          <StageNote
            title="接続エラー / connection error"
            body={status.reason ?? "WaniKani unreachable"}
            hint=".env.localのトークンとサーバーを確認して、ページを再読み込みしてください。"
          />
        )}
        {loading && <StageDirections />}
        {error && !loading && (
          <StageNote
            title="上演中止 / an error occurred"
            body={error}
            hint="もう一度「上演する」を押してみてください。"
          />
        )}
        {story && !loading && <StoryStage story={story} />}
      </main>
      <Footer />
    </>
  );
}

function Masthead({ status }: { status: WaniKaniStatus | null }) {
  return (
    <header className="flex flex-col gap-6">
      <div>
        <h1
          className="kt-display kt-rough -rotate-1 text-6xl leading-none tracking-tight sm:text-8xl"
          lang="en"
        >
          KANJI
          <wbr />
          TALES
        </h1>
        <p className="kt-caption mt-3">
          かんじ・ものがたり ── the page is the stage.
        </p>
      </div>
      <hr className="kt-rule" />
      <dl className="flex flex-wrap items-end gap-x-8 gap-y-3">
        {[
          { label: "LEVEL", value: status?.level },
          { label: "漢字 KANJI", value: status?.kanjiCount },
          { label: "語彙 VOCAB", value: status?.vocabCount },
        ].map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <dt className="kt-tag">{s.label}</dt>
            <dd className="kt-display text-2xl leading-none">
              {s.value ?? "—"}
            </dd>
          </div>
        ))}
        <p className="kt-caption ml-auto self-end">
          {status === null
            ? "reading the records…"
            : status.connected
              ? `WaniKani同期済み・${status.username}`
              : "未接続 / not connected"}
        </p>
      </dl>
    </header>
  );
}

function StageForm({
  difficulty,
  setDifficulty,
  disabled,
  onSubmit,
  idle,
}: {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  disabled: boolean;
  onSubmit: () => void;
  idle: boolean;
}) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {idle && (
        <p className="kt-caption">
          （幕は下りている。今夜の一話を待っている。）
        </p>
      )}
      <fieldset className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
        <legend className="kt-tag float-left mr-4">むずかしさ</legend>
        {DIFFICULTIES.map((d) => (
          <label
            key={d.value}
            className="flex cursor-pointer items-baseline gap-2"
          >
            <input
              type="radio"
              name="difficulty"
              value={d.value}
              checked={difficulty === d.value}
              onChange={() => setDifficulty(d.value)}
              className="kt-radio"
            />
            <span
              className={`kt-display text-lg ${
                difficulty === d.value
                  ? "underline decoration-[var(--ink)] decoration-[3px] underline-offset-4"
                  : ""
              }`}
            >
              {d.jp}
            </span>
            <span className="kt-caption">{d.en}</span>
          </label>
        ))}
      </fieldset>
      <div>
        <button type="submit" className="kt-button" disabled={disabled}>
          上演する
        </button>
      </div>
    </form>
  );
}

function StageDirections() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const visible = DIRECTIONS.filter((d) => elapsed >= d.after);
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="generating">
      <div className="kt-scatter text-3xl" aria-hidden="true">
        {"ものがたりを待つ".split("").map((ch, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {ch}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {visible.map((d) => (
          <span key={d.after} className="kt-direction kt-caption text-sm">
            {d.text}
          </span>
        ))}
      </div>
      <p aria-hidden="true" className="kt-caption text-xs">
        {elapsed}s ── 15〜60秒ほどかかります
      </p>
    </div>
  );
}

function StoryStage({ story }: { story: Story }) {
  const [showFurigana, setShowFurigana] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const lines = toLines(story.segments);

  useEffect(() => {
    setShowSubtitles(false);
  }, [story]);

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-5">
        <span className="kt-stamp text-sm" role="img" aria-label="new story">
          新作
        </span>
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
        <span className="kt-stamp text-2xl" role="img" aria-label="kanji check passed">
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
                <span className="kt-caption ml-auto text-right">{v.meaning}</span>
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

function StageNote({
  title,
  body,
  hint,
}: {
  title: string;
  body: string;
  hint: string;
}) {
  return (
    <div role="alert" className="flex flex-col gap-2">
      <p className="kt-tag inline-block self-start border-[var(--voice-red)] text-[var(--voice-red-deep)]">
        {title}
      </p>
      <p className="text-sm">{body}</p>
      <p className="kt-caption">{hint}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-3 pb-2">
      <hr className="kt-rule--thin kt-rule" />
      <nav aria-label="links" className="kt-caption flex flex-wrap gap-x-6">
        <a
          href="https://www.wanikani.com/dashboard"
          target="_blank"
          rel="noreferrer"
        >
          WaniKani
        </a>
        <a
          href="https://github.com/xTaig4/KanjiTales"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span className="ml-auto">
          作・Taig4 ／ 言葉のあいだに、なにもない。
        </span>
      </nav>
    </footer>
  );
}
