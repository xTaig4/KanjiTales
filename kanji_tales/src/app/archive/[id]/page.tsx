import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory } from "@/lib/archive";
import StoryStage from "../../components/StoryStage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  return { title: `KanjiTales｜${story?.title ?? "過去公演"}` };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export default async function ArchivedStoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  return (
    <>
      <header className="flex flex-col gap-6">
        <div>
          <p className="kt-caption">
            <Link href="/archive">← 過去公演 ── the programme</Link>
          </p>
          <p className="kt-caption mt-4">
            {formatDate(story.savedAt)} 上演 ── 再演 (encore)
          </p>
        </div>
        <hr className="kt-rule" />
      </header>
      <main className="flex flex-1 flex-col pt-8">
        <StoryStage story={story} isNew={false} />
      </main>
      <footer className="mt-16 flex flex-col gap-3 pb-2">
        <hr className="kt-rule kt-rule--thin" />
        <nav aria-label="links" className="kt-caption flex flex-wrap gap-x-6">
          <Link href="/">舞台へ</Link>
          <Link href="/archive">過去公演</Link>
          <span className="ml-auto">作・Taig4</span>
        </nav>
      </footer>
    </>
  );
}
