import { DatasetCore } from "@rdfjs/types";
import { Parser, Store } from "n3";
import path from "node:path";
import fs from "node:fs";

const ntriplesStringToDataset = (input: string): DatasetCore => {
  const parser = new Parser({ format: "N-Triples" });
  const store = new Store();
  store.addQuads(parser.parse(input));
  return store;
};

export const testDataset: DatasetCore = ntriplesStringToDataset(
  fs.readFileSync(path.join(__dirname, "unesco-thesaurus.nt")).toString(),
);
