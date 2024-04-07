import { testSparqlModelSet } from "./testSparqlModelSet";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";

describe("SparqlConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(() =>
    testSparqlModelSet.conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
