import { LanguageTag } from "./LanguageTag";

export interface Configuration {
  readonly cacheDirectoryPath: string;
  readonly dataFilePaths: readonly string[];
  readonly defaultLanguageTag: LanguageTag;
  readonly conceptsPerPage: number;
  readonly relatedConceptsPerSection: number;
}
