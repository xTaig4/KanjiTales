"use client";

import React from "react";
import { useState } from "react";

const KanjisPage = () => {
  const kanji_list: string[] = [
    "日",
    "一",
    "国",
    "人",
    "年",
    "大",
    "十",
    "二",
    "本",
    "中",
    "長",
    "出",
    "三",
    "時",
    "行",
    "見",
    "月",
    "後",
    "前",
    "生",
  ];

  const [markedKanji, setMarkedKanji] = useState<string[]>([]);
  const [showMarked, setShowMarked] = useState(false);

  const handleKanjiClick = (character: string) => {
    setMarkedKanji((prev) =>
      prev.includes(character)
        ? prev.filter((k) => k !== character)
        : [...prev, character]
    );
  };

  const displayedList = showMarked ? markedKanji : kanji_list;

  return (
    <div>
      <section className="text-black flex items-center flex-col gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Kanji Characters</h2>
          <p className="p-3">
            This is the Kanji you've learned so far, Goshujin-sama~!😍
          </p>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-9 gap-4 mt-4">
          {displayedList.length === 0 ? (
            <p className="col-span-9">
              {showMarked ? "No marked kanji yet." : "No kanji available."}
            </p>
          ) : (
            displayedList.map((character, index) => (
              <div
                key={index}
                onClick={() => handleKanjiClick(character)}
                className={`p-4 rounded-lg ring-1 ring-gray-300 shadow-md transition-colors duration-300 cursor-pointer ${
                  markedKanji.includes(character)
                    ? "bg-red-300"
                    : "bg-white hover:bg-gray-700/90"
                }`}
              >
                <p className="text-3xl">{character}</p>
              </div>
            ))
          )}
        </div>
        <button
          className="border-1 border-gray-200 shadow-md rounded-2xl p-2 hover:bg-red-300"
          onClick={() => setShowMarked((prev) => !prev)}
        >
          {showMarked ? "Show All Kanji" : "Show Marked Kanji"}
        </button>
      </section>
    </div>
  );
};

export default KanjisPage;
