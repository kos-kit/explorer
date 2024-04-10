import { GlobalRef } from "@/lib/models/GlobalRef";
import { Configuration } from "@/lib/models/Configuration";
import * as envalid from "envalid";
import { makeStructuredValidator } from "envalid/dist/makers";
import path from "node:path";
import fs from "node:fs";

const configuration = new GlobalRef("configuration");
if (!configuration.value) {
  const filePathArrayValidator: envalid.StructuredValidator =
    makeStructuredValidator((value) => {
      if (value.length === 0) {
        throw new Error("not specified");
      }
      return value.split(path.delimiter).map((filePath) => {
        const filePathResolved = path.resolve(filePath);
        const stat = fs.statSync(filePathResolved);
        if (!stat.isFile()) {
          throw new Error(`${filePathResolved} is not a file`);
        }
        return filePathResolved;
      });
    });

  const intValidator = envalid.makeExactValidator<number>(parseInt);

  const env = envalid.cleanEnv(process.env, {
    CONCEPTS_PER_PAGE: intValidator({ default: 25 }),
    DATA_FILE_PATHS: filePathArrayValidator(),
    DEFAULT_LANGUAGE_TAG: envalid.str({ default: "en" }),
    RELATED_CONCEPTS_PER_SECTION: intValidator({ default: 10 }),
  });

  configuration.value = {
    dataFilePaths: env.DATA_FILE_PATHS,
    defaultLanguageTag: env.DEFAULT_LANGUAGE_TAG,
    conceptsPerPage: env.CONCEPTS_PER_PAGE,
    relatedConceptsPerSection: env.RELATED_CONCEPTS_PER_SECTION,
  } satisfies Configuration;
  // console.log("Configuration:", JSON.stringify(configuration.value));
}
export default configuration.value as Configuration;
