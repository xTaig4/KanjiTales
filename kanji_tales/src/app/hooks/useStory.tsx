"use client";

import { useCallback, useState } from "react";

export interface StorySegment {
  t: string;
  f?: string;
}

export interface Story {
  title: string;
  segments: StorySegment[];
  vocab: { word: string; reading: string; meaning: string }[];
  translation: string;
  attempts: number;
  violationsFixed: string[];
  knownKanjiCount: number;
  knownVocabCount: number;
}

export type Difficulty = "easy" | "normal" | "hard";

export interface WaniKaniStatus {
  connected: boolean;
  reason?: string;
  username?: string;
  level?: number;
  kanjiCount?: number;
  vocabCount?: number;
}

export default function useStory() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { story, loading, error, generate };
}

export async function fetchWaniKaniStatus(): Promise<WaniKaniStatus> {
  try {
    const res = await fetch("/api/wanikani");
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
