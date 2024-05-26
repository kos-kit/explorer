import { LanguageTag } from "../../client/src/models/LanguageTag";

export interface Configuration {
  readonly cacheDirectoryPath: string;
  readonly conceptsPerPage: number;
  readonly dataFilePaths: readonly string[];
  readonly defaultLanguageTag: LanguageTag;
  readonly nextBasePath: string;
  readonly relatedConceptsPerSection: number;
}
