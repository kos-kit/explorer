import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "../models/LanguageTag";

export interface SearchEngine {
  search(kwds: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;
}
