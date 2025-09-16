"use client";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey });

export interface Sentence {
  japanese: string;
  english: string;
  romaji: string;
}

export default function useStory() {
  // Returns a function to fetch the story when called
  const fetchStory = async (level: string = "N5"): Promise<Sentence> => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Create one sentence in japanese in the ${level} level. Your respond has to be in json format, and with the following structure: { "japanese": "...", "english": "...", "romaji": "..."}`,
      config: {
        systemInstruction: `You are a helpful assistant that creates one sentence in Japanese, a translation in English, and a romaji version`,
      },
    });

    const result = response.text?.replaceAll("```", "").replace("json", "");

    try {
      const responseText = result || "{}";
      const sentence = JSON.parse(responseText);
      return {
        japanese: sentence.japanese || "N/A",
        english: sentence.english || "N/A",
        romaji: sentence.romaji || "N/A",
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        japanese: result || "No response available",
        english: "Translation not available",
        romaji: "Romaji not available",
      };
    }
  };
  return fetchStory;
}
