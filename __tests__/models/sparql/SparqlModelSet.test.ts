import { behavesLikeModelSet } from "../behavesLikeModelSet";
import { testSparqlModelSet } from "./testSparqlModelSet";

describe("SparqlModelSet", () => {
  behavesLikeModelSet(testSparqlModelSet);
});
