import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json(
      { error: "Keyword parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        keyword
      )}`,
      {
        headers: {
          "User-Agent": "KanjiTales-App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Jisho API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Kanji API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch kanji data" },
      { status: 500 }
    );
  }
}
