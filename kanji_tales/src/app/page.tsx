"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useStory, {
  Difficulty,
  fetchWaniKaniStatus,
  WaniKaniStatus,
} from "./hooks/useStory";
import StoryStage from "./components/StoryStage";

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
        <Link href="/archive">過去公演</Link>
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
