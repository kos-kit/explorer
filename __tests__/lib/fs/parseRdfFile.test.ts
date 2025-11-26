import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataFactory, Store } from "n3";
import { describe, expect, it } from "vitest";
import { getRdfFileFormat } from "../../server/getRdfFileFormat.js";
import { parseRdfFile } from "../../server/parseRdfFile.js";

describe("parseRdfFile", () => {
  const testDataDirPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "..",
    "..",
    "__tests__",
    "data",
  );
  for (const fileName of fs.readdirSync(testDataDirPath)) {
    const rdfFilePath = path.resolve(testDataDirPath, fileName);
    if (fileName.startsWith("unesco-thesaurus")) {
      it(`should parse ${fileName}`, async () => {
        const dataset = new Store();
        await parseRdfFile({
          dataFactory: DataFactory,
          dataset,
          rdfFileFormat: getRdfFileFormat(rdfFilePath).unsafeCoerce(),
          rdfFilePath,
        });
        expect(dataset.size).toBe(88482);
      });
    } else if (fileName === "place.jsonld") {
      it(`should parse ${fileName}`, async () => {
        const dataset = new Store();
        await parseRdfFile({
          dataFactory: DataFactory,
          dataset,
          rdfFileFormat: getRdfFileFormat(rdfFilePath).unsafeCoerce(),
          rdfFilePath,
        });
        expect(dataset.size).toBe(6);
      });
    }
  }
});
