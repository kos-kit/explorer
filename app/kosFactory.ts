import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";
import {
  Kos,
  LanguageTag,
  LanguageTagSet,
  NotImplementedKos,
} from "@kos-kit/models";
import { SparqlClient } from "@kos-kit/sparql-models";
import { GlobalRef } from "@kos-kit/next-utils";
import { Kos as MemKos } from "@kos-kit/mem-models";
import { Kos as SparqlKos } from "@kos-kit/sparql-models";

type KosFactory = (kwds: { languageTag: LanguageTag }) => Kos;

const kosFactory = new GlobalRef("kosFactory");
if (!kosFactory.value) {
  if (configuration.dataFilePaths.length > 0) {
    const parser = new Parser();
    const store = new Store();
    for (const dataFilePath of configuration.dataFilePaths) {
      console.info("reading", dataFilePath, "into KOS dataset");
      store.addQuads(parser.parse(fs.readFileSync(dataFilePath).toString()));
    }

    kosFactory.value = ({ languageTag }: { languageTag: LanguageTag }) =>
      new MemKos({
        dataset: store,
        includeLanguageTags: new LanguageTagSet(languageTag, ""),
      });
  } else if (configuration.sparqlEndpoint !== null) {
    console.info(
      "using SPARQL endpoint",
      configuration.sparqlEndpoint,
      "as KOS",
    );
    kosFactory.value = ({ languageTag }: { languageTag: LanguageTag }) =>
      new SparqlKos({
        includeLanguageTags: new LanguageTagSet(languageTag, ""),
        sparqlClient: new SparqlClient({
          endpointUrl: configuration.sparqlEndpoint!,
        }),
      });
  } else {
    console.info("using NotImplementedKos");
    kosFactory.value = new NotImplementedKos();
  }
}
export default kosFactory.value as KosFactory;
