import { NextRequest, NextResponse } from "next/server";
import { generateStory, Difficulty } from "@/lib/story";

// Generation shells out to `claude -p` and can take a minute with retries.
export const maxDuration = 300;

const DIFFICULTIES = new Set(["easy", "normal", "hard"]);

export async function POST(request: NextRequest) {
  let difficulty: Difficulty = "normal";
  try {
    const body = await request.json();
    if (DIFFICULTIES.has(body?.difficulty)) difficulty = body.difficulty;
  } catch {
    // no body → default difficulty
  }

  try {
    const story = await generateStory(difficulty);
    return NextResponse.json(story);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
