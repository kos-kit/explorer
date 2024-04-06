import { testRdfJsModelSet } from "./testRdfJsModelSet";
import { behavesLikeUnescoThesaurusConcept10018 } from "../behavesLikeUnescoThesaurusConcept10018";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConcept10 } from "../behavesLikeUnescoThesaurusConcept10";

describe("RdfJsConcept", () => {
  behavesLikeUnescoThesaurusConcept10(() =>
    testRdfJsModelSet.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10",
      ),
    ),
  );

  behavesLikeUnescoThesaurusConcept10018(() =>
    testRdfJsModelSet.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10018",
      ),
    ),
  );
});
