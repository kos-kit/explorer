import * as envalid from "envalid";
import { makeStructuredValidator } from "envalid/dist/makers";
import path from "node:path";
import fs from "node:fs";
import { GlobalRef } from "@/lib/GlobalRef";
import { Configuration } from "@/lib/Configuration";

const configuration = new GlobalRef("configuration");
if (!configuration.value) {
  const directoryPathValidator = envalid.makeExactValidator((value) => {
    if (value.length === 0) {
      throw new Error("not specified");
    }
    return path.resolve(value);
  });

  const filePathArrayValidator: envalid.StructuredValidator =
    makeStructuredValidator((value) => {
      if (value.length === 0) {
        return [];
      }
      return value.split(path.delimiter).flatMap((relativePath) => {
        const absolutePath = path.resolve(relativePath);
        const stat = fs.statSync(absolutePath);
        if (stat.isFile()) {
          return [absolutePath];
        } else if (stat.isDirectory()) {
          const filePaths: string[] = [];
          for (const dirent of fs.readdirSync(absolutePath, {
            withFileTypes: true,
          })) {
            if (!dirent.isFile()) {
              continue;
            }
            filePaths.push(dirent.path);
          }
          return filePaths;
        } else {
          throw new Error(`${relativePath}`);
        }
      });
    });

  const intValidator = envalid.makeExactValidator<number>(parseInt);

  const env = envalid.cleanEnv(process.env, {
    INPUT_CACHE_DIRECTORY_PATH: directoryPathValidator({
      default: ".kos-kit/explorer/cache",
    }),
    INPUT_CONCEPTS_PER_PAGE: intValidator({ default: 25 }),
    INPUT_DATA_PATHS: filePathArrayValidator({ default: "" }),
    INPUT_DEFAULT_LANGUAGE_TAG: envalid.str({ default: "en" }),
    INPUT_NEXT_BASE_PATH: envalid.str({ default: "" }),
    INPUT_RELATED_CONCEPTS_PER_SECTION: intValidator({ default: 10 }),
    INPUT_SEARCH_ENDPOINT: envalid.str({ default: "" }),
    INPUT_SPARQL_ENDPOINT: envalid.str({ default: "" }),
  });

  configuration.value = {
    cacheDirectoryPath: env.INPUT_CACHE_DIRECTORY_PATH,
    conceptsPerPage: env.INPUT_CONCEPTS_PER_PAGE,
    dataFilePaths: env.INPUT_DATA_PATHS,
    defaultLanguageTag: env.INPUT_DEFAULT_LANGUAGE_TAG,
    nextBasePath: env.INPUT_NEXT_BASE_PATH,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
    searchEndpoint:
      env.INPUT_SEARCH_ENDPOINT.length > 0 ? env.INPUT_SEARCH_ENDPOINT : null,
    sparqlEndpoint:
      env.INPUT_SPARQL_ENDPOINT.length > 0 ? env.INPUT_SPARQL_ENDPOINT : null,
  } satisfies Configuration;

  const checkConfiguration = configuration.value as Configuration;
  if (checkConfiguration.dataFilePaths.length === 0) {
    if (checkConfiguration.searchEndpoint === null) {
      throw new Error(
        "must specify a search endpoint in the configuration if no data paths are specified",
      );
    }
    if (checkConfiguration.sparqlEndpoint === null) {
      throw new Error(
        "must specify a SPARQL endpoint in the configuration if no data paths are specified",
      );
    }
  }

  // console.log("Configuration:", JSON.stringify(configuration.value));
}
export default configuration.value as Configuration;
