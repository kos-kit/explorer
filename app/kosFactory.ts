import fs from "node:fs/promises";
import { dataFactory } from "@/lib/dataFactory";
import { logger } from "@/lib/logger";
import { Kos, LanguageTag } from "@/lib/models";
import { LanguageTagSet, NotImplementedKos } from "@kos-kit/models";
import { GlobalRef } from "@kos-kit/next-utils";
import { RdfDirectory } from "@kos-kit/next-utils/RdfDirectory";
import { RdfFile } from "@kos-kit/next-utils/RdfFile";
import * as fsEither from "@kos-kit/next-utils/fsEither";
import { getRdfFileFormat } from "@kos-kit/next-utils/getRdfFileFormat";
import * as rdfjsDataset from "@kos-kit/rdfjs-dataset-models";
import { HttpSparqlQueryClient } from "@kos-kit/sparql-client";
import * as sparql from "@kos-kit/sparql-models";
import { DatasetCore, DatasetCoreFactory, Quad } from "@rdfjs/types";
import * as N3 from "n3";
import { configuration } from "./configuration";

const datasetCoreFactory: DatasetCoreFactory = {
  dataset(quads?: Quad[]): DatasetCore {
    return new N3.Store(quads);
  },
};

type KosFactory = (kwds: { languageTag: LanguageTag }) => Promise<Kos>;

async function loadKosDataset(
  dataPaths: readonly string[],
): Promise<DatasetCore> {
  logger.info("loading KOS dataset from data paths: %s", dataPaths.join(":"));
  const dataset = new N3.Store();

  for (const dataPath of dataPaths) {
    const absoluteDataPath = await fs.realpath(dataPath);
    await (await fsEither.stat(absoluteDataPath))
      .mapLeft(async (error) => {
        logger.warn("error stat'ing %s: %s", absoluteDataPath, error.message);
      })
      .map(async (stat) => {
        if (stat.isDirectory()) {
          for await (const file of new RdfDirectory({
            logger,
            path: absoluteDataPath,
          }).files()) {
            await file.parse({ dataFactory, dataset });
          }
        } else if (stat.isFile()) {
          await getRdfFileFormat(absoluteDataPath)
            .mapLeft(async (error) => {
              logger.warn(
                "%s is not an RDF file: %s",
                absoluteDataPath,
                error.message,
              );
            })
            .map(async (rdfFileFormat) => {
              await new RdfFile({
                logger,
                path: absoluteDataPath,
                format: rdfFileFormat,
              }).parse({ dataFactory, dataset });
            })
            .extract();
        } else {
          logger.warn("%s is not a directory or a file", absoluteDataPath);
        }
      })
      .extract();
  }

  if (dataset.size === 0) {
    logger.warn("empty dataset after loading data paths");
  }

  return dataset;
}

const kosDatasetGlobalRef = new GlobalRef<DatasetCore>("kosDataset");

const kosFactoryGlobalRef = new GlobalRef<KosFactory>("kosFactory");
if (!kosFactoryGlobalRef.value) {
  let kosFactoryValue: KosFactory;

  if (configuration.sparqlEndpoint !== null) {
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
          defaultRequestOptions: {
            cache: "no-store",
            method: "POSTDirectly",
          },
        }),
      });
    };
  } else if (configuration.dataPaths.length > 0) {
    if (!kosDatasetGlobalRef.value) {
      kosDatasetGlobalRef.value = await loadKosDataset(configuration.dataPaths);
    }

    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      return new rdfjsDataset.DefaultKos({
        dataset: kosDatasetGlobalRef.value!,
        includeLanguageTags: new LanguageTagSet(languageTag, ""),
      });
    };
  } else {
    console.info("using NotImplementedKos");
    kosFactoryValue = () => Promise.resolve(new NotImplementedKos());
  }

  kosFactoryGlobalRef.value = kosFactoryValue;
}
export const kosFactory: KosFactory = kosFactoryGlobalRef.value;
