import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";
import { GlobalRef } from "@/lib/models/GlobalRef";
import {
  Kos,
  LanguageTag,
  mem,
  sparql,
  Concept,
  ConceptScheme,
  Identifier,
} from "@kos-kit/client/models";
import { LanguageTagSet } from "@kos-kit/client/models/LanguageTagSet";
import { SparqlClient } from "@kos-kit/client";

class NotImplementedKos implements Kos {
  conceptByIdentifier(_identifier: Identifier): Promise<Concept> {
    throw new Error("method not implemented");
  }

  concepts(): AsyncGenerator<Concept> {
    throw new Error("method not implemented");
  }

  conceptsPage(_kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("method not implemented");
  }

  conceptsCount(): Promise<number> {
    throw new Error("method not implemented");
  }

  conceptSchemeByIdentifier(_identifier: Identifier): Promise<ConceptScheme> {
    throw new Error("method not implemented");
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("method not implemented");
  }
}

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
      new mem.Kos({
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
      new sparql.Kos({
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
