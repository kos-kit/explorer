import { Concept } from "@/lib/models/Concept";
import { testRdfJsModelSet } from "./testRdfJsModelSet";
import { behavesLikeConcept } from "../behavesLikeConcept";

describe("RdfJsConcept", () => {
  const sut: Concept = [
    ...testRdfJsModelSet.concepts({ limit: 1, offset: 0 }),
  ][0];
  expect(sut).toBeDefined();

  behavesLikeConcept(sut);
});
