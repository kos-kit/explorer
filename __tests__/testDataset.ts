import { DatasetCore } from "@rdfjs/types";
import fs from "fs";
import { Parser, Store } from "n3";

const ntriplesStringToDataset = (input: string): DatasetCore => {
  const parser = new Parser({ format: "N-Triples" });
  const store = new Store();
  store.addQuads(parser.parse(input));
  return store;
};

require.extensions[".nt"] = function (module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};

export const testDataset: DatasetCore = ntriplesStringToDataset(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./usecsco-thesaurus.nt"),
);
