"use client";
import React, { useEffect, useState } from "react";
import useStory, { Sentence } from "../hooks/useStory";

const StoryBox: React.FC = () => {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchStory = useStory();

  useEffect(() => {
    // Only fetch once on mount.
    // fetchStory is stable or memoized (from a custom hook), so it's safe to omit from the dependency array.
    fetchStory()
      .then((sentenceData) => {
        setSentence(sentenceData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : String(error));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-2xl flex flex-col gap-4">
      {sentence && (
        <div className="flex flex-col gap-2">
          <div>
            <strong>Japanese:</strong> {sentence.japanese}
          </div>
          <div>
            <strong>English:</strong> {sentence.english}
          </div>
          <div>
            <strong>Romaji:</strong> {sentence.romaji}
          </div>
        </div>
      )}
      <button className="border-1 border-border rounded-2xl p-2 hover:bg-red-300">
        Generate Sentence
      </button>
    </div>
  );
};

export default StoryBox;
