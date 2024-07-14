import * as mem from "@kos-kit/mem-models";
import {
  Kos,
  LanguageTag,
  LanguageTagSet,
  NotImplementedKos,
} from "@kos-kit/models";
import { GlobalRef } from "@kos-kit/next-utils";
import { parseRdfFile } from "@kos-kit/next-utils/parseRdfFile";
import * as sparql from "@kos-kit/sparql-models";
import { DatasetCore } from "@rdfjs/types";
import { Store } from "n3";
import configuration from "./configuration";
import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "@/lib/logger";
import { Stats } from "node:fs";
import { dataFactory } from "@/lib/dataFactory";

type KosFactory = (kwds: { languageTag: LanguageTag }) => Promise<Kos>;

async function loadKosDataset(
  dataPaths: readonly string[],
): Promise<DatasetCore> {
  const store = new Store();

  async function loadDirectory(directoryPath: string): Promise<void> {
    for (const dirent of await fs.readdir(directoryPath, {
      withFileTypes: true,
    })) {
      const direntPath = path.resolve(directoryPath, dirent.name);
      if (dirent.isDirectory()) {
        await loadDirectory(direntPath);
      } else if (dirent.isFile()) {
        await loadFile(direntPath);
      } else {
        logger.warn("%s is not a directory or file", direntPath);
      }
    }
  }

  async function loadFile(filePath: string): Promise<void> {
    logger.debug("loading RDF file %s", filePath);
    await parseRdfFile({ dataFactory, dataset: store, rdfFilePath: filePath });
    logger.debug("loading RDF file %s", filePath);
  }

  for (const dataPath of dataPaths) {
    const absoluteDataPath = path.resolve(dataPath);
    let stat: Stats;
    try {
      stat = await fs.stat(absoluteDataPath);
    } catch {
      logger.warn("error stat'ing %s", absoluteDataPath);
      continue;
    }
    if (stat.isDirectory()) {
      await loadDirectory(absoluteDataPath);
    } else if (stat.isFile()) {
      await loadFile(absoluteDataPath);
    } else {
      logger.warn("%s is not a directory or a file", absoluteDataPath);
    }
  }

  return store;
}

const kosDataset = new GlobalRef("kosDataset");
if (!kosDataset.value) {
  kosDataset.value = await loadKosDataset(configuration.dataPaths);
}

const kosFactory = new GlobalRef("kosFactory");
if (!kosFactory.value) {
  let kosFactoryValue: KosFactory;

  if (configuration.dataPaths.length > 0) {
    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      return new mem.Kos({
        dataset: kosDataset.value as DatasetCore,
        modelFactory: new mem.DefaultModelFactory({
          conceptConstructor: mem.Concept,
          conceptSchemeConstructor: mem.ConceptScheme,
          includeLanguageTags: new LanguageTagSet(languageTag, ""),
          labelConstructor: mem.Label,
        }),
      });
    };
  } else if (configuration.sparqlEndpoint !== null) {
    console.info(
      "using SPARQL endpoint",
      configuration.sparqlEndpoint,
      "as KOS",
    );
    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      const sparqlClient = new sparql.HttpSparqlClient({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        endpointUrl: configuration.sparqlEndpoint!,
      });
      return new sparql.Kos({
        modelFetcher: new sparql.DefaultModelFetcher({
          conceptConstructor: sparql.Concept,
          conceptSchemeConstructor: sparql.ConceptScheme,
          memModelFactory: new mem.DefaultModelFactory({
            conceptConstructor: mem.Concept,
            conceptSchemeConstructor: mem.ConceptScheme,
            includeLanguageTags: new LanguageTagSet(languageTag, ""),
            labelConstructor: mem.Label,
          }),
          includeLanguageTags: new LanguageTagSet(languageTag, ""),
          sparqlClient,
        }),
        sparqlClient,
      });
    };
  } else {
    console.info("using NotImplementedKos");
    kosFactoryValue = () => Promise.resolve(new NotImplementedKos());
  }

  kosFactory.value = kosFactoryValue;
}
export default kosFactory.value as KosFactory;
