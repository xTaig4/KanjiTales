"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import KanjiSearch from "../../components/KanjiSearch";

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
  const [isEmpty, setIsEmpty] = useState(true);

  const handleKanjiClick = (character: string) => {
    setMarkedKanji((prev) =>
      prev.includes(character)
        ? prev.filter((k) => k !== character)
        : [...prev, character]
    );
  };

  useEffect(() => {
    if (markedKanji.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [markedKanji]);

  const displayedList = showMarked ? markedKanji : kanji_list;

  return (
    <div className="w-full ">
      {/* Kanji Search Dictionary */}
      <KanjiSearch />

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Existing Kanji Learning Section */}
      <section className="text-black flex items-center flex-col gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Your Learned Kanji</h2>
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
                    : "bg-white hover:bg-gray-200/90"
                }`}
              >
                <p className="text-3xl">{character}</p>
              </div>
            ))
          )}
        </div>
        {}
        <button
          disabled={isEmpty}
          className="border-1 border-gray-200 rounded-lg p-3 bg-blue-500 text-white  hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setShowMarked((prev) => !prev)}
        >
          {showMarked ? "Show All Kanji" : "Show Marked Kanji"}
        </button>
      </section>
    </div>
  );
};

export default KanjisPage;
