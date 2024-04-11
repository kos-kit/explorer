import { GlobalRef } from "@/lib/models/GlobalRef";
import { Configuration } from "@/lib/models/Configuration";
import * as envalid from "envalid";
import { makeStructuredValidator } from "envalid/dist/makers";
import path from "node:path";
import fs from "node:fs";

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
        throw new Error("not specified");
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
    INPUT_DATA_PATHS: filePathArrayValidator(),
    INPUT_DEFAULT_LANGUAGE_TAG: envalid.str({ default: "en" }),
    INPUT_RELATED_CONCEPTS_PER_SECTION: intValidator({ default: 10 }),
  });

  configuration.value = {
    cacheDirectoryPath: env.INPUT_CACHE_DIRECTORY_PATH,
    dataFilePaths: env.INPUT_DATA_PATHS,
    defaultLanguageTag: env.INPUT_DEFAULT_LANGUAGE_TAG,
    conceptsPerPage: env.INPUT_CONCEPTS_PER_PAGE,
    relatedConceptsPerSection: env.INPUT_RELATED_CONCEPTS_PER_SECTION,
  } satisfies Configuration;
  // console.log("Configuration:", JSON.stringify(configuration.value));
}
export default configuration.value as Configuration;
