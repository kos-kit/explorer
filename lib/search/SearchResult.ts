import { SearchResultType } from "@/lib/search/SearchResultType";

export interface SearchResult {
  readonly identifier: string;
  readonly prefLabel: string;
  readonly score: number;
  readonly type: SearchResultType;
}
