// Types for Jisho API response structure

export interface JishoReading {
  reading: string;
  primary: boolean;
}

export interface JishoSense {
  english_definitions: string[];
  parts_of_speech: string[];
  links: any[];
  tags: string[];
  restrictions: string[];
  see_also: string[];
  antonyms: string[];
  source: any[];
  info: string[];
}

export interface JishoJapanese {
  word?: string;
  reading?: string;
}

export interface JishoData {
  slug: string;
  is_common: boolean;
  tags: string[];
  jlpt: string[];
  japanese: JishoJapanese[];
  senses: JishoSense[];
  attribution: {
    jmdict: boolean;
    jmnedict: boolean;
    dbpedia: boolean;
  };
}

export interface JishoApiResponse {
  meta: {
    status: number;
  };
  data: JishoData[];
}

// Simplified kanji interface for our app use
export interface Kanji {
  character: string;
  meanings: string[];
  readings: {
    on: string[];
    kun: string[];
  };
  jlptLevel?: string;
  isCommon: boolean;
  strokeCount?: number;
}

export interface KanjiSearchResult {
  kanji: Kanji[];
  totalResults: number;
  searchTerm: string;
}
