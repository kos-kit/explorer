import { SearchResult } from "@/lib/search/SearchResult";
import { SearchEngineJson } from "@/lib/search/SearchEngineJson";

export interface SearchEngine {
  search(kwds: {
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;

  searchCount(kwds: { query: string }): Promise<number>;

  toJson(): SearchEngineJson;
}
