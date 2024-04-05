import { testRdfJsModelSet } from "./testRdfJsModelSet";
import { behavesLikeUnescoThesaurusConcept10 } from "../behavesLikeUnescoThesaurusConcept10";
import { DataFactory } from "n3";

describe("RdfJsConcept", () => {
  behavesLikeUnescoThesaurusConcept10(
    testRdfJsModelSet.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10",
      ),
    ),
  );
});
