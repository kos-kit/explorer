export interface SearchResult {
  readonly identifier: string;
  readonly prefLabel: string;
  readonly score: number;
  readonly type: "Concept" | "ConceptScheme";
}
