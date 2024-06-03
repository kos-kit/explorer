import * as envalid from "envalid";
import { GlobalRef } from "@/lib/models/GlobalRef";
import { Configuration } from "@/lib/models/Configuration";
import {
  existingFilePathArrayValidator,
  directoryPathValidator,
  intValidator,
  languageTagArrayValidator,
} from "@kos-kit/client/utilities/envalidValidators";

const configuration = new GlobalRef("configuration");
if (!configuration.value) {
  const env = envalid.cleanEnv(process.env, {
    INPUT_CACHE_DIRECTORY_PATH: directoryPathValidator({
      default: ".kos-kit/explorer/cache",
    }),
    INPUT_CONCEPTS_PER_PAGE: intValidator({ default: 25 }),
    INPUT_DATA_PATHS: existingFilePathArrayValidator({ default: [] }),
    INPUT_DEFAULT_LANGUAGE_TAG: envalid.str({ default: "en" }),
    INPUT_LANGUAGE_TAGS: languageTagArrayValidator({ default: ["en"] }),
    INPUT_NEXT_BASE_PATH: envalid.str({ default: "" }),
    INPUT_NEXT_OUTPUT: envalid.str({ default: "" }),
    INPUT_RELATED_CONCEPTS_PER_SECTION: intValidator({ default: 10 }),
    INPUT_SEARCH_ENDPOINT: envalid.str({ default: "" }),
    INPUT_SPARQL_ENDPOINT: envalid.str({ default: "" }),
  });

  configuration.value = {
    cacheDirectoryPath: env.INPUT_CACHE_DIRECTORY_PATH,
    conceptsPerPage: env.INPUT_CONCEPTS_PER_PAGE,
    dataFilePaths: env.INPUT_DATA_PATHS,
    defaultLanguageTag: env.INPUT_DEFAULT_LANGUAGE_TAG,
    dynamic: env.INPUT_NEXT_OUTPUT.toLowerCase() == "standalone",
    languageTags: env.INPUT_LANGUAGE_TAGS,
    nextBasePath: env.INPUT_NEXT_BASE_PATH,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
    searchEndpoint:
      env.INPUT_SEARCH_ENDPOINT.length > 0 ? env.INPUT_SEARCH_ENDPOINT : null,
    sparqlEndpoint:
      env.INPUT_SPARQL_ENDPOINT.length > 0 ? env.INPUT_SPARQL_ENDPOINT : null,
  } satisfies Configuration;
}
export default configuration.value as Configuration;
