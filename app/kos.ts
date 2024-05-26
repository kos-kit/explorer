import { Parser, Store } from "n3";
import fs from "node:fs";
import configuration from "./configuration";
import { GlobalRef } from "@/lib/GlobalRef";
import { Kos, rdfjs } from "@kos-kit/client/models";

const kos = new GlobalRef("kos");
if (!kos.value) {
  const parser = new Parser();
  const store = new Store();
  for (const dataFilePath of configuration.dataFilePaths) {
    store.addQuads(parser.parse(fs.readFileSync(dataFilePath).toString()));
  }

  kos.value = new rdfjs.Kos(store);
}
export default kos.value as Kos;
