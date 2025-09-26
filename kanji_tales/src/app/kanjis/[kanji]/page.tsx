"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useKanjiSearch from "../../hooks/useKanjiSearch";
import { Kanji } from "../../types/kanji";

const KanjiDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { searchKanji, loading, error } = useKanjiSearch();
  const [kanjiDetails, setKanjiDetails] = useState<Kanji | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const kanjiCharacter = params.kanji as string;

  useEffect(() => {
    if (kanjiCharacter) {
      // Decode the URL parameter in case it's encoded
      const decodedKanji = decodeURIComponent(kanjiCharacter);
      
      // Search for the specific kanji
      searchKanji(decodedKanji).then((results) => {
        if (results && results.kanji.length > 0) {
          // Find the exact kanji character in the results
          const foundKanji = results.kanji.find(k => k.character === decodedKanji);
          if (foundKanji) {
            setKanjiDetails(foundKanji);
          } else {
            // If not found in results, use the first kanji from the search
            setKanjiDetails(results.kanji[0]);
          }
        } else {
          setNotFound(true);
        }
      });
    }
  }, [kanjiCharacter, searchKanji]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading kanji details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (notFound || !kanjiDetails) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😅</div>
          <h1 className="text-2xl font-bold mb-2">Kanji Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find details for the kanji "{kanjiCharacter}".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back to Search
        </button>
      </div>

      {/* Main kanji display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-6">
          <div className="text-8xl font-bold mb-4">{kanjiDetails.character}</div>
          <div className="flex justify-center gap-2 flex-wrap">
            {kanjiDetails.jlptLevel && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {kanjiDetails.jlptLevel.toUpperCase()}
              </span>
            )}
            {kanjiDetails.isCommon && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Common
              </span>
            )}
          </div>
        </div>

        {/* Meanings */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Meanings</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {kanjiDetails.meanings.map((meaning, index) => (
                <span
                  key={index}
                  className="bg-white px-3 py-1 rounded-md border text-gray-700"
                >
                  {meaning}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Readings */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* On'yomi (Chinese readings) */}
          {kanjiDetails.readings.on.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                On'yomi (音読み)
              </h3>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Chinese readings</p>
                <div className="space-y-1">
                  {kanjiDetails.readings.on.map((reading, index) => (
                    <div key={index} className="text-lg font-medium text-red-700">
                      {reading}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kun'yomi (Japanese readings) */}
          {kanjiDetails.readings.kun.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Kun'yomi (訓読み)
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Japanese readings</p>
                <div className="space-y-1">
                  {kanjiDetails.readings.kun.map((reading, index) => (
                    <div key={index} className="text-lg font-medium text-blue-700">
                      {reading}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No readings message */}
        {kanjiDetails.readings.on.length === 0 && kanjiDetails.readings.kun.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No specific readings found for this kanji.</p>
            <p className="text-sm">This might be a rare kanji or the data might be incomplete.</p>
          </div>
        )}
      </div>

      {/* Additional info section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Study Tips</h3>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>Practice writing this kanji by hand to improve memorization</li>
          <li>Look for this kanji in compound words to understand its usage</li>
          <li>Try creating sentences using words that contain this kanji</li>
          {kanjiDetails.jlptLevel && (
            <li>This kanji appears in {kanjiDetails.jlptLevel.toUpperCase()} level materials</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default KanjiDetailPage;