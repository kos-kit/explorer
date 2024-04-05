import { LanguageTag } from "./LanguageTag";

export interface Configuration {
  readonly defaultLanguageTag: LanguageTag;
  readonly conceptsPerPage: number;
  readonly relatedConceptsPerSection: number;
}
