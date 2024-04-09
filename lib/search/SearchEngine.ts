import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "../models/LanguageTag";
import { SearchEngineType } from "./SearchEngineType";

export interface SearchEngine {
  search(kwds: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;

  toJson(): { [index: string]: any; type: SearchEngineType };
}
