"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useKanjiSearch from "../hooks/useKanjiSearch";
import { Kanji } from "../types/kanji";

interface KanjiCardProps {
  kanji: Kanji;
  onClick?: (kanji: string) => void;
}

const KanjiCard: React.FC<KanjiCardProps> = ({ kanji, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => onClick?.(kanji.character)}
    >
      <div className="text-4xl font-bold text-center mb-2">
        {kanji.character}
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Meanings:</span>
          <div className="text-gray-600">
            {kanji.meanings.slice(0, 3).join(", ")}
            {kanji.meanings.length > 3 && "..."}
          </div>
        </div>

        {kanji.readings.on.length > 0 && (
          <div>
            <span className="font-semibold">On:</span>
            <span className="text-gray-600 ml-1">
              {kanji.readings.on.slice(0, 2).join(", ")}
            </span>
          </div>
        )}

        {kanji.readings.kun.length > 0 && (
          <div>
            <span className="font-semibold">Kun:</span>
            <span className="text-gray-600 ml-1">
              {kanji.readings.kun.slice(0, 2).join(", ")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {kanji.jlptLevel && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {kanji.jlptLevel.toUpperCase()}
            </span>
          )}
          {kanji.isCommon && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Common
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const KanjiSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const { searchKanji, clearResults, loading, error, results } =
    useKanjiSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchKanji(searchTerm.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear results when input is empty
    if (!value.trim()) {
      clearResults();
    }
  };

  const handleKanjiClick = (kanji: string) => {
    // Navigate to the individual kanji detail page
    router.push(`/kanjis/${encodeURIComponent(kanji)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Kanji Dictionary</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search for kanji, words, or meanings..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {results && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Search Results for "{results.searchTerm}"
            </h2>
            <p className="text-gray-600">Found {results.totalResults} kanji</p>
          </div>

          {results.kanji.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.kanji.map((kanji, index) => (
                <KanjiCard
                  key={`${kanji.character}-${index}`}
                  kanji={kanji}
                  onClick={handleKanjiClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No kanji found for "{results.searchTerm}"
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">漢字</div>
          <p>Enter a search term to find kanji and their meanings</p>
          <p className="text-sm mt-2">
            Try searching for words like "水" or "water"
          </p>
        </div>
      )}
    </div>
  );
};

export default KanjiSearch;
