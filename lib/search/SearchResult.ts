export interface SearchResult {
  readonly identifier: string;
  readonly prefLabel: string;
  readonly type: "Concept" | "ConceptScheme";
}
