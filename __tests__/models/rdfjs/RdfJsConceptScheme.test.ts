import { testRdfJsModelSet } from "./testRdfJsModelSet";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";

describe("RdfJsConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(() =>
    testRdfJsModelSet.conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
