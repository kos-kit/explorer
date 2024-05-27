import { LanguageTag } from "@kos-kit/client/models";

export interface Configuration {
  readonly cacheDirectoryPath: string;
  readonly conceptsPerPage: number;
  readonly dataFilePaths: readonly string[];
  readonly defaultLanguageTag: LanguageTag;
  readonly nextBasePath: string;
  readonly relatedConceptsPerSection: number;
  readonly searchEndpoint: string | null;
  readonly sparqlEndpoint: string | null;
}
