import * as envalid from "envalid";
import { makeStructuredValidator } from "envalid/dist/makers";
import path from "node:path";
import fs from "node:fs";
import { GlobalRef } from "@/lib/models/GlobalRef";
import { Configuration } from "@/lib/models/Configuration";

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
            filePaths.push(path.resolve(absolutePath, dirent.name));
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
    nextBasePath: env.INPUT_NEXT_BASE_PATH,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
    searchEndpoint:
      env.INPUT_SEARCH_ENDPOINT.length > 0 ? env.INPUT_SEARCH_ENDPOINT : null,
    sparqlEndpoint:
      env.INPUT_SPARQL_ENDPOINT.length > 0 ? env.INPUT_SPARQL_ENDPOINT : null,
  } satisfies Configuration;
}
export default configuration.value as Configuration;
