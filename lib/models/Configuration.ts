import { LanguageTag } from "./LanguageTag";

export interface Configuration {
  readonly dataFilePaths: readonly string[];
  readonly defaultLanguageTag: LanguageTag;
  readonly conceptsPerPage: number;
  readonly relatedConceptsPerSection: number;
}
