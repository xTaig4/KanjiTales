// Server-side WaniKani API v2 client. Docs: https://docs.api.wanikani.com/20170710/
// Free accounts are capped to levels 1-3 by the API itself, which matches
// what the user has actually learned.

const BASE = "https://api.wanikani.com/v2";

export interface KnownKanji {
  char: string;
  meaning: string;
  srsStage: number; // 1-4 Apprentice, 5-6 Guru, 7 Master, 8 Enlightened, 9 Burned
}

export interface KnownVocab {
  word: string;
  reading: string;
  meaning: string;
  srsStage: number;
}

export interface KnownItems {
  username: string;
  level: number;
  kanji: KnownKanji[];
  vocab: KnownVocab[];
  fetchedAt: number;
}

class WaniKaniError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "WaniKaniError";
  }
}

function token(): string {
  const t = process.env.WANIKANI_API_TOKEN;
  if (!t) throw new WaniKaniError("WANIKANI_API_TOKEN is not set in .env.local");
  return t;
}

interface WkMeaning {
  meaning: string;
  primary: boolean;
}

interface WkReading {
  reading: string;
  primary: boolean;
}

interface WkResource {
  id: number;
  object: string;
  data: {
    subject_id?: number;
    srs_stage?: number;
    characters?: string;
    meanings?: WkMeaning[];
    readings?: WkReading[];
    username?: string;
    level?: number;
  };
}

interface WkPage {
  pages?: { next_url: string | null };
  data: WkResource[];
}

async function wkFetch(url: string): Promise<WkPage & WkResource> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Wanikani-Revision": "20170710",
    },
    cache: "no-store",
  });
  if (res.status === 401) throw new WaniKaniError("WaniKani rejected the API token (401)", 401);
  if (res.status === 429) throw new WaniKaniError("WaniKani rate limit hit (60 req/min) — try again in a minute", 429);
  if (!res.ok) throw new WaniKaniError(`WaniKani API error ${res.status} for ${url}`, res.status);
  return res.json();
}

async function fetchAllPages(firstUrl: string): Promise<WkResource[]> {
  const data: WkResource[] = [];
  let url: string | null = firstUrl;
  while (url) {
    const page = await wkFetch(url);
    data.push(...page.data);
    url = page.pages?.next_url ?? null;
  }
  return data;
}

let cache: KnownItems | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function getKnownItems(force = false): Promise<KnownItems> {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache;

  const user = await wkFetch(`${BASE}/user`);

  const assignments = await fetchAllPages(
    `${BASE}/assignments?started=true&subject_types=kanji,vocabulary,kana_vocabulary`
  );
  const srsBySubject = new Map<number, number>(
    assignments.map((a) => [a.data.subject_id ?? 0, a.data.srs_stage ?? 0])
  );

  const kanji: KnownKanji[] = [];
  const vocab: KnownVocab[] = [];
  const ids = [...srsBySubject.keys()];
  for (let i = 0; i < ids.length; i += 300) {
    const chunk = ids.slice(i, i + 300);
    const subjects = await fetchAllPages(`${BASE}/subjects?ids=${chunk.join(",")}`);
    for (const s of subjects) {
      const srsStage = srsBySubject.get(s.id) ?? 0;
      const meaning = s.data.meanings?.find((m) => m.primary)?.meaning ?? "";
      const characters = s.data.characters ?? "";
      if (!characters) continue;
      if (s.object === "kanji") {
        kanji.push({ char: characters, meaning, srsStage });
      } else if (s.object === "vocabulary" || s.object === "kana_vocabulary") {
        const reading = s.data.readings?.find((r) => r.primary)?.reading ?? characters;
        vocab.push({ word: characters, reading, meaning, srsStage });
      }
    }
  }

  cache = {
    username: user.data.username ?? "",
    level: user.data.level ?? 0,
    kanji,
    vocab,
    fetchedAt: Date.now(),
  };
  return cache;
}
