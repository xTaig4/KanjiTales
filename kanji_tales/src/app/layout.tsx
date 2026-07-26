import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KanjiTales｜漢字物語",
  description: "WaniKaniで習った漢字だけで読める、あなた専用の物語の舞台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/*
        THESIS: The page is a stage and tonight's story performs on it;
        refuses both the study-app dashboard and decorative japonisme.
        OWN-WORLD: Washi-paper ground with faint grain; sumi ink; one
        vermilion voice (#d7332a) for stamps, hover, and emphasis; heavy
        Shippori Mincho display run through a rough stamp-ink SVG filter;
        Courier typewriter captions with hard name-tag underlines; hairline
        rules, no boxes; red hanko stamps (新作, 検) as state.
        STORY: Tai arrives after reviews, chooses a difficulty line in the
        script, presses 上演する; stage directions type out while kana
        letters drift; the story enters sentence by sentence in heavy
        mincho with furigana; the red 検 seal certifies the kanji check;
        cast list of vocabulary; subtitles (字幕) reveal the translation.
        FIRST VIEWPORT: KANJITALES masthead huge in rough mincho over a
        hard rule, stats as three underlined name-tags, then the stage:
        one stage-direction caption, the difficulty script (selection
        marked in ink), and the single black 上演する button. Vermilion
        speaks only as stamps, hover, and focus — never at rest.
        FORM: massin-stage-page (dealt challenger, user-chosen over the
        assigned transit direction), fused with Japanese materials; seed
        key 62735228; staging: single-column stage, sentences staggered,
        kitsch-free — expression lives in type scale, texture, and timing.
      */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* rough stamp-ink filter used by .kt-rough / .kt-stamp */}
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <filter id="kt-rough-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.55"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <div className="mx-auto flex min-h-screen w-full max-w-[760px] flex-col px-5 py-10 sm:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
