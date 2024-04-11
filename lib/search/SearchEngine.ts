import { SearchResult } from "@/lib/search/SearchResult";
import { SearchEngineType } from "./SearchEngineType";

export interface SearchEngine {
  search(kwds: {
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;

  searchCount(kwds: { query: string }): Promise<number>;

  toJson(): { [index: string]: any; type: SearchEngineType };
}
