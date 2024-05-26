import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";
import { GlobalRef } from "@/lib/GlobalRef";
import { RdfJsModelSet } from "@kos-kit/client/models/rdfjs";
import { ModelSet } from "@kos-kit/client/models";

const modelSet = new GlobalRef("modelSet");
if (!modelSet.value) {
  const parser = new Parser();
  const store = new Store();
  for (const dataFilePath of configuration.dataFilePaths) {
    store.addQuads(parser.parse(fs.readFileSync(dataFilePath).toString()));
  }

  modelSet.value = new RdfJsModelSet(store);
}
export default modelSet.value as ModelSet;
