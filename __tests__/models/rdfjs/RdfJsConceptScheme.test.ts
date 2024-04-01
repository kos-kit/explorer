import { behavesLikeConceptScheme } from "../behavesLikeConceptScheme";
import { testRdfJsModelSet } from "./testRdfJsModelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";

describe("RdfJsConceptScheme", () => {
  const sut: ConceptScheme = [...testRdfJsModelSet.conceptSchemes()][0];
  expect(sut).toBeDefined();

  behavesLikeConceptScheme(sut);
});
