// Story archive: every performance is saved as a JSON file under
// data/stories/ (gitignored — personal content). No database needed.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { StoryPayload } from "./validate";
import { Difficulty } from "./story";

export interface ArchivedStory extends StoryPayload {
  id: string;
  savedAt: string; // ISO timestamp
  difficulty: Difficulty;
  attempts: number;
  violationsFixed: string[];
  knownKanjiCount: number;
  knownVocabCount: number;
}

const DIR = path.join(process.cwd(), "data", "stories");
const ID_RE = /^[a-z0-9]+$/;

export async function saveStory(
  story: Omit<ArchivedStory, "id" | "savedAt">
): Promise<ArchivedStory> {
  await mkdir(DIR, { recursive: true });
  const now = new Date();
  const id = now.getTime().toString(36);
  const record: ArchivedStory = {
    ...story,
    id,
    savedAt: now.toISOString(),
  };
  await writeFile(
    path.join(DIR, `${id}.json`),
    JSON.stringify(record, null, 2),
    "utf8"
  );
  return record;
}

export async function listStories(): Promise<ArchivedStory[]> {
  let files: string[];
  try {
    files = await readdir(DIR);
  } catch {
    return []; // no performances yet
  }
  const stories = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        try {
          return JSON.parse(
            await readFile(path.join(DIR, f), "utf8")
          ) as ArchivedStory;
        } catch {
          return null; // skip corrupt files rather than break the programme
        }
      })
  );
  return stories
    .filter((s): s is ArchivedStory => s !== null)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export async function getStory(id: string): Promise<ArchivedStory | null> {
  if (!ID_RE.test(id)) return null;
  try {
    return JSON.parse(
      await readFile(path.join(DIR, `${id}.json`), "utf8")
    ) as ArchivedStory;
  } catch {
    return null;
  }
}
