import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ModelFactories, RdfjsDatasetKos } from "@kos-kit/models";
import { Parser, Store } from "n3";
import { describe } from "vitest";
import { LunrSearchEngine } from "../LunrSearchEngine.js";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine.js";
function parseRdfString(input) {
    const parser = new Parser();
    const store = new Store();
    store.addQuads(parser.parse(input));
    return store;
}
describe("LunrSearchEngine", () => {
    const unescoThesaurusDataset = parseRdfString(fs
        .readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "__tests__", "data", "unesco-thesaurus.nt"))
        .toString());
    behavesLikeSearchEngine(() => LunrSearchEngine.create({
        conceptsLimit: 10,
        kos: new RdfjsDatasetKos({
            dataset: unescoThesaurusDataset,
            preferredLanguages: ["en", ""],
            modelFactories: ModelFactories.default_,
        }),
        languageTag: "en",
    }));
});
//# sourceMappingURL=LunrSearchEngine.test.js.map