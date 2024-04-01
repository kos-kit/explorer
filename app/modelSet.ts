import { GlobalRef } from "@/lib/models/GlobalRef";
import { ModelSet } from "@/lib/models/ModelSet";
import { RdfJsModelSet } from "@/lib/models/rdfjs/RdfJsModelSet";
import { Parser, Store } from "n3";
import path from "node:path";
import fs from "node:fs";

const modelSet = new GlobalRef("modelSet");
if (!modelSet.value) {
  const parser = new Parser();
  const store = new Store();
  store.addQuads(
    parser.parse(
      fs
        .readFileSync(
          path.resolve(
            process.cwd(),
            "data",
            "unesco-thesaurus",
            "unesco-thesaurus.nt",
          ),
        )
        .toString(),
    ),
  );

  modelSet.value = new RdfJsModelSet(store);
}
export default modelSet.value as ModelSet;
