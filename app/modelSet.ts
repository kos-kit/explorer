import { GlobalRef } from "@/lib/models/GlobalRef";
import { ModelSet } from "@/lib/models/ModelSet";
import { RdfJsModelSet } from "@/lib/models/rdfjs/RdfJsModelSet";
import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";

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
