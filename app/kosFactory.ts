import configuration from "./configuration";
import {
  Kos,
  LanguageTag,
  LanguageTagSet,
  NotImplementedKos,
} from "@kos-kit/models";
import { parseRdfFiles } from "@kos-kit/next-utils/parseRdfFiles";
import { SparqlClient } from "@kos-kit/sparql-models";
import { GlobalRef } from "@kos-kit/next-utils";
import { Kos as MemKos } from "@kos-kit/mem-models";
import { Kos as SparqlKos } from "@kos-kit/sparql-models";
import { DatasetCore } from "@rdfjs/types";

type KosFactory = (kwds: { languageTag: LanguageTag }) => Promise<Kos>;

const kosDataset = new GlobalRef("kosDataset");
const kosFactory = new GlobalRef("kosFactory");
if (!kosFactory.value) {
  let kosFactoryValue: KosFactory;

  if (configuration.dataFilePaths.length > 0) {
    kosFactoryValue = async ({ languageTag }: { languageTag: LanguageTag }) => {
      if (!kosDataset.value) {
        kosDataset.value = await parseRdfFiles(configuration.dataFilePaths);
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
