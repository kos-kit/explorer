import { Stats } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { dataFactory } from "@/lib/dataFactory";
import { logger } from "@/lib/logger";
import { Kos, LanguageTag } from "@/lib/models";
import { LanguageTagSet, NotImplementedKos } from "@kos-kit/models";
import { GlobalRef } from "@kos-kit/next-utils";
import { getRdfFileFormat } from "@kos-kit/next-utils/getRdfFileFormat";
import { parseRdfFile } from "@kos-kit/next-utils/parseRdfFile";
import * as rdfjsDataset from "@kos-kit/rdfjs-dataset-models";
import { HttpSparqlQueryClient } from "@kos-kit/sparql-client";
import * as sparql from "@kos-kit/sparql-models";
import { DatasetCore, DatasetCoreFactory, Quad } from "@rdfjs/types";
import * as N3 from "n3";
import configuration from "./configuration";

const datasetCoreFactory: DatasetCoreFactory = {
  dataset(quads?: Quad[]): DatasetCore {
    return new N3.Store(quads);
  },
};

type KosFactory = (kwds: { languageTag: LanguageTag }) => Promise<Kos>;

async function loadKosDataset(
  dataPaths: readonly string[],
): Promise<DatasetCore> {
  const store = new N3.Store();

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
    getRdfFileFormat(filePath)
      .ifLeft(async (error) => {
        logger.warn("%s is not an RDF file: %s", filePath, error.message);
      })
      .ifRight(async (rdfFileFormat) => {
        logger.debug("loading RDF file %s", filePath);
        await parseRdfFile({
          dataFactory,
          dataset: store,
          rdfFileFormat,
          rdfFilePath: filePath,
        });
        logger.debug("loading RDF file %s", filePath);
      });
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
      return new rdfjsDataset.DefaultKos({
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
    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      return new sparql.DefaultKos({
        datasetCoreFactory,
        includeLanguageTags: new LanguageTagSet(languageTag, ""),
        logger,
        sparqlQueryClient: new HttpSparqlQueryClient({
          dataFactory: N3.DataFactory,
          endpointUrl: configuration.sparqlEndpoint!,
          logger,
        }),
      });
    };
  } else {
    console.info("using NotImplementedKos");
    kosFactoryValue = () => Promise.resolve(new NotImplementedKos());
  }

  kosFactory.value = kosFactoryValue;
}
export default kosFactory.value as KosFactory;
