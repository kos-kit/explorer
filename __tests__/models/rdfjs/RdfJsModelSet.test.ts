import { behavesLikeModelSet } from "../behavesLikeModelSet";
import { testRdfJsModelSet } from "./testRdfJsModelSet";

describe("RdfJsModelSet", () => {
  behavesLikeModelSet(testRdfJsModelSet);
});
