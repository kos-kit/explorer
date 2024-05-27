import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";
import { GlobalRef } from "@/lib/GlobalRef";
import { Kos, rdfjs, sparql } from "@kos-kit/client/models";
import SparqlClient from "sparql-http-client/ParsingClient";

const kos = new GlobalRef("kos");
if (!kos.value) {
  if (configuration.dataFilePaths.length > 0) {
    const parser = new Parser();
    const store = new Store();
    for (const dataFilePath of configuration.dataFilePaths) {
      console.info("reading", dataFilePath, "into KOS dataset");
      store.addQuads(parser.parse(fs.readFileSync(dataFilePath).toString()));
    }

    kos.value = new rdfjs.Kos(store);
  } else if (configuration.sparqlEndpoint !== null) {
    console.info(
      "using SPARQL endpoint",
      configuration.sparqlEndpoint,
      "as KOS",
    );
    kos.value = new sparql.Kos(
      new SparqlClient({ endpointUrl: configuration.sparqlEndpoint }),
    );
  } else {
    throw new RangeError();
  }
}
export default kos.value as Kos;
