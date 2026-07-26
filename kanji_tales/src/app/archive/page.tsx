import type { Metadata } from "next";
import Link from "next/link";
import { listStories } from "@/lib/archive";
import { Difficulty } from "@/lib/story";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KanjiTales｜過去公演",
  description: "これまでに上演された物語の記録",
};

const DIFF_JP: Record<Difficulty, string> = {
  easy: "やさしい",
  normal: "ふつう",
  hard: "きたえる",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export default async function ArchivePage() {
  const stories = await listStories();
  return (
    <>
      <header className="flex flex-col gap-6">
        <div>
          <p className="kt-caption">
            <Link href="/">← 舞台へ ── back to the stage</Link>
          </p>
          <h1 className="kt-display kt-rough mt-4 -rotate-1 text-5xl leading-none tracking-tight sm:text-6xl">
            過去公演
          </h1>
          <p className="kt-caption mt-3">
            past performances ── the programme. 全{stories.length}回
          </p>
        </div>
        <hr className="kt-rule" />
      </header>
      <main className="flex flex-1 flex-col pt-8">
        {stories.length === 0 ? (
          <p className="kt-caption">
            （まだ公演の記録がありません。
            <Link href="/">舞台</Link>
            で最初の一話を。）
          </p>
        ) : (
          <ol className="flex flex-col">
            {stories.map((s, i) => (
              <li
                key={s.id}
                className={
                  i > 0 ? "border-t border-[var(--gray-20)]" : undefined
                }
              >
                <Link
                  href={`/archive/${s.id}`}
                  className="kt-plain group flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4"
                >
                  <span className="kt-caption w-24">{formatDate(s.savedAt)}</span>
                  <span
                    className="kt-display text-2xl group-hover:text-[var(--voice-red)]"
                    lang="ja"
                  >
                    {s.title}
                  </span>
                  <span className="kt-caption ml-auto">
                    {DIFF_JP[s.difficulty] ?? s.difficulty} ・ 習得
                    {s.knownKanjiCount}字
                    {s.attempts > 1 && " ・ 書きなおし有"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
      <footer className="mt-16 flex flex-col gap-3 pb-2">
        <hr className="kt-rule kt-rule--thin" />
        <p className="kt-caption">作・Taig4 ／ 言葉のあいだに、なにもない。</p>
      </footer>
    </>
  );
}
