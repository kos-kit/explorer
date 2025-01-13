import { ServerConfiguration } from "@/lib/models/ServerConfiguration";
import { GlobalRef } from "@kos-kit/next-utils/server";
import {
  existingPathsValidator,
  intValidator,
  languageTagArrayValidator,
  pathValidator,
} from "@kos-kit/next-utils/server/envalidValidators";
import * as envalid from "envalid";

const configurationGlobalRef = new GlobalRef<ServerConfiguration>(
  "configuration",
);
if (!configurationGlobalRef.value) {
  const env = envalid.cleanEnv(process.env, {
    INPUT_CACHE_DIRECTORY_PATH: pathValidator({
      default: ".kos-kit/explorer/cache",
    }),
    INPUT_CONCEPTS_PER_PAGE: intValidator({ default: 25 }),
    INPUT_DATA_PATHS: existingPathsValidator({ default: [] }),
    INPUT_DEFAULT_LOCALE: envalid.str({ default: "en" }),
    INPUT_LOCALES: languageTagArrayValidator({ default: [] }),
    INPUT_NEXT_BASE_PATH: envalid.str({ default: "" }),
    INPUT_NEXT_OUTPUT: envalid.str({ default: "" }),
    INPUT_RELATED_CONCEPTS_PER_SECTION: intValidator({ default: 10 }),
    INPUT_SEARCH_ENDPOINT: envalid.str({ default: "" }),
    INPUT_SPARQL_ENDPOINT: envalid.str({ default: "" }),
  });

  configurationGlobalRef.value = {
    cacheDirectoryPath: env.INPUT_CACHE_DIRECTORY_PATH,
    conceptsPerPage: env.INPUT_CONCEPTS_PER_PAGE,
    dataPaths: env.INPUT_DATA_PATHS,
    defaultLocale: env.INPUT_DEFAULT_LOCALE,
    dynamic: env.INPUT_NEXT_OUTPUT.toLowerCase() === "standalone",
    locales:
      env.INPUT_LOCALES.length > 0
        ? env.INPUT_LOCALES
        : [env.INPUT_DEFAULT_LOCALE],
    nextBasePath: env.INPUT_NEXT_BASE_PATH,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
    searchEndpoint:
      env.INPUT_SEARCH_ENDPOINT.length > 0 ? env.INPUT_SEARCH_ENDPOINT : null,
    sparqlEndpoint:
      env.INPUT_SPARQL_ENDPOINT.length > 0 ? env.INPUT_SPARQL_ENDPOINT : null,
  } satisfies ServerConfiguration;
}
export const configuration: ServerConfiguration = configurationGlobalRef.value;
