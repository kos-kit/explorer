export interface ServerConfiguration {
  readonly cacheDirectoryPath: string;
  readonly conceptsPerPage: number;
  readonly dataPaths: readonly string[];
  readonly defaultLocale: string;
  readonly dynamic: boolean;
  readonly locales: readonly string[];
  readonly nextBasePath: string;
  readonly relatedConceptsPerSection: number;
  readonly searchEndpoint: string | null;
  readonly sparqlEndpoint: string | null;
}
