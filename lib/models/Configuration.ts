import { LanguageTag } from "@kos-kit/models";

export interface Configuration {
  readonly cacheDirectoryPath: string;
  readonly conceptsPerPage: number;
  readonly dataPaths: readonly string[];
  readonly defaultLanguageTag: LanguageTag;
  readonly dynamic: boolean;
  readonly languageTags: readonly LanguageTag[];
  readonly nextBasePath: string;
  readonly relatedConceptsPerSection: number;
  readonly searchEndpoint: string | null;
  readonly sparqlEndpoint: string | null;
}
