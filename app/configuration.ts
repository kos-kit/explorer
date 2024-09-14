import { Configuration } from "@/lib/models/Configuration";
import { GlobalRef } from "@kos-kit/next-utils";
import {
  existingPathsValidator,
  intValidator,
  languageTagArrayValidator,
  pathValidator,
} from "@kos-kit/next-utils/envalidValidators";
import * as envalid from "envalid";

const configurationGlobalRef = new GlobalRef<Configuration>("configuration");
if (!configurationGlobalRef.value) {
  const env = envalid.cleanEnv(process.env, {
    INPUT_CACHE_DIRECTORY_PATH: pathValidator({
      default: ".kos-kit/explorer/cache",
    }),
    INPUT_CONCEPTS_PER_PAGE: intValidator({ default: 25 }),
    INPUT_DATA_PATHS: existingPathsValidator({ default: [] }),
    INPUT_DEFAULT_LANGUAGE_TAG: envalid.str({ default: "en" }),
    INPUT_LANGUAGE_TAGS: languageTagArrayValidator({ default: [] }),
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
    defaultLanguageTag: env.INPUT_DEFAULT_LANGUAGE_TAG,
    dynamic: env.INPUT_NEXT_OUTPUT.toLowerCase() === "standalone",
    languageTags:
      env.INPUT_LANGUAGE_TAGS.length > 0
        ? env.INPUT_LANGUAGE_TAGS
        : [env.INPUT_DEFAULT_LANGUAGE_TAG],
    nextBasePath: env.INPUT_NEXT_BASE_PATH,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
    searchEndpoint:
      env.INPUT_SEARCH_ENDPOINT.length > 0 ? env.INPUT_SEARCH_ENDPOINT : null,
    sparqlEndpoint:
      env.INPUT_SPARQL_ENDPOINT.length > 0 ? env.INPUT_SPARQL_ENDPOINT : null,
  } satisfies Configuration;
}
export const configuration: Configuration = configurationGlobalRef.value;
