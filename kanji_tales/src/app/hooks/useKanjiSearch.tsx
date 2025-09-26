"use client";

import { useState, useCallback } from "react";
import { JishoApiResponse, Kanji, KanjiSearchResult } from "../types/kanji";

export default function useKanjiSearch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KanjiSearchResult | null>(null);

  // Helper function to extract kanji characters from text
  const extractKanji = (text: string): string[] => {
    const kanjiRegex = /[\u4e00-\u9faf]/g;
    return text.match(kanjiRegex) || [];
  };

  // Helper function to transform Jisho API data to our Kanji interface
  const transformJishoData = (
    data: JishoApiResponse,
    searchTerm: string
  ): KanjiSearchResult => {
    const kanjiSet = new Set<string>();
    const kanjiData: Kanji[] = [];

    data.data.forEach((entry) => {
      // Extract kanji from the word/reading
      entry.japanese.forEach((japanese) => {
        if (japanese.word) {
          const kanjiChars = extractKanji(japanese.word);
          kanjiChars.forEach((char) => {
            if (!kanjiSet.has(char)) {
              kanjiSet.add(char);

              // Extract meanings from senses
              const meanings = entry.senses
                .flatMap((sense) => sense.english_definitions)
                .filter((def, index, arr) => arr.indexOf(def) === index); // Remove duplicates

              // Extract readings - this is simplified as Jisho doesn't separate on/kun clearly
              const readings = entry.japanese
                .filter((j) => j.reading)
                .map((j) => j.reading!)
                .filter(
                  (reading, index, arr) => arr.indexOf(reading) === index
                );

              // JLPT level
              const jlptLevel =
                entry.jlpt.length > 0 ? entry.jlpt[0] : undefined;

              const kanji: Kanji = {
                character: char,
                meanings: meanings.slice(0, 5), // Limit to first 5 meanings
                readings: {
                  on: readings.filter((r) => /^[ァ-ヴー]+$/.test(r)), // Katakana readings (on'yomi)
                  kun: readings.filter(
                    (r) => /[ひらがな]/.test(r) || /^[ぁ-ゟ]+$/.test(r)
                  ), // Hiragana readings (kun'yomi)
                },
                jlptLevel,
                isCommon: entry.is_common,
              };

              kanjiData.push(kanji);
            }
          });
        }
      });
    });

    return {
      kanji: kanjiData,
      totalResults: kanjiData.length,
      searchTerm,
    };
  };

  const searchKanji = useCallback(
    async (query: string): Promise<KanjiSearchResult | null> => {
      if (!query.trim()) {
        setResults(null);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/kanji?keyword=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: JishoApiResponse = await response.json();
        const searchResult = transformJishoData(data, query);

        setResults(searchResult);
        setLoading(false);

        return searchResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search kanji";
        setError(errorMessage);
        setLoading(false);
        setResults(null);
        return null;
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    searchKanji,
    clearResults,
    loading,
    error,
    results,
  };
}
