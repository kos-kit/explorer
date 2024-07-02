import { Kos as MemKos } from "@kos-kit/mem-models";
import {
  Kos,
  LanguageTag,
  LanguageTagSet,
  NotImplementedKos,
} from "@kos-kit/models";
import { GlobalRef } from "@kos-kit/next-utils";
import { parseRdfFile } from "@kos-kit/next-utils/parseRdfFile";
import { SparqlClient, Kos as SparqlKos } from "@kos-kit/sparql-models";
import { DatasetCore } from "@rdfjs/types";
import { Store } from "n3";
import configuration from "./configuration";
import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "@/lib/logger";

type KosFactory = (kwds: { languageTag: LanguageTag }) => Promise<Kos>;

async function parseRdfFiles(
  dataPath: string,
  intoDataset: DatasetCore,
): Promise<void> {
  const absoluteDataPath = path.resolve(dataPath);

  const stat = await fs.stat(absoluteDataPath);
  if (stat.isFile()) {
    logger.debug("parsing RDF file %s", absoluteDataPath);
    await parseRdfFile(absoluteDataPath, intoDataset);
    logger.debug("parsed RDF file %s", absoluteDataPath);
  } else if (stat.isDirectory()) {
    for (const dirent of await fs.readdir(absoluteDataPath, {
      withFileTypes: true,
    })) {
      if (!dirent.isFile()) {
        continue;
      }
      const absoluteDataFilePath = path.resolve(absoluteDataPath, dirent.name);
      logger.debug("parsing RDF file %s", absoluteDataFilePath);
      await parseRdfFile(absoluteDataFilePath, intoDataset);
      logger.debug("parsed RDF file %s", absoluteDataFilePath);
    }
  } else {
    logger.warn("data path %s does not exist", absoluteDataPath);
  }
}

const kosDataset = new GlobalRef("kosDataset");
const kosFactory = new GlobalRef("kosFactory");
if (!kosFactory.value) {
  let kosFactoryValue: KosFactory;

  if (configuration.dataPaths.length > 0) {
    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      if (!kosDataset.value) {
        const store = new Store();
        for (const dataPath of configuration.dataPaths) {
          await parseRdfFiles(dataPath, store);
        }
        kosDataset.value = store;
      }
      return new MemKos({
        dataset: kosDataset.value as DatasetCore,
        includeLanguageTags: new LanguageTagSet(languageTag, ""),
      });
    };
  } else if (configuration.sparqlEndpoint !== null) {
    console.info(
      "using SPARQL endpoint",
      configuration.sparqlEndpoint,
      "as KOS",
    );
    kosFactoryValue = ({ languageTag }: { languageTag: LanguageTag }) =>
      Promise.resolve(
        new SparqlKos({
          includeLanguageTags: new LanguageTagSet(languageTag, ""),
          sparqlClient: new SparqlClient({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            endpointUrl: configuration.sparqlEndpoint!,
          }),
        }),
      );
  } else {
    console.info("using NotImplementedKos");
    kosFactoryValue = () => Promise.resolve(new NotImplementedKos());
  }

  kosFactory.value = kosFactoryValue;
}
export default kosFactory.value as KosFactory;
