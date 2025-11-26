import { LanguageTag } from "@kos-kit/models";
import { SearchEngineJson } from "./SearchEngineJson.js";
import { SearchResults } from "./SearchResults.js";

export interface SearchEngine {
  search(kwds: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults>;
  toJson(): SearchEngineJson;
}
