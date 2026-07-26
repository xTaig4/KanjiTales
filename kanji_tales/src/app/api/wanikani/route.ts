import { NextResponse } from "next/server";
import { getKnownItems } from "@/lib/wanikani";

export async function GET() {
  if (!process.env.WANIKANI_API_TOKEN) {
    return NextResponse.json({
      connected: false,
      reason: "WANIKANI_API_TOKEN missing — add it to kanji_tales/.env.local and restart the dev server",
    });
  }
  try {
    const known = await getKnownItems();
    return NextResponse.json({
      connected: true,
      username: known.username,
      level: known.level,
      kanjiCount: known.kanji.length,
      vocabCount: known.vocab.length,
    });
  } catch (err) {
    return NextResponse.json({
      connected: false,
      reason: err instanceof Error ? err.message : String(err),
    });
  }
}
