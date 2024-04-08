import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { testRdfJsModelSet } from "../models/rdfjs/testRdfJsModelSet";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create(testRdfJsModelSet, { conceptsLimit: 10 }),
  );
});
