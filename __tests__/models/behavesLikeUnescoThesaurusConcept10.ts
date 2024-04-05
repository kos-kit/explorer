import { Concept } from "@/lib/models/Concept";
import { behavesLikeConcept } from "./behavesLikeConcept";
import { DataFactory } from "n3";

export const behavesLikeUnescoThesaurusConcept10 = (concept: Concept) => {
  it("should be in the single concept scheme", () => {
    const inSchemes = concept.topConceptOf;
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have a modified date", () => {
    expect(concept.modified!.value).toStrictEqual("2019-12-15T13:26:49Z");
  });

  it("should have multiple prefLabels", () => {
    expect(concept.prefLabel("en")!.literalForm.value).toStrictEqual(
      "Right to education",
    );
    expect(concept.prefLabel("fr")!.literalForm.value).toStrictEqual(
      "Droit à l'éducation",
    );
  });

  it("should be a top concept of the single concept scheme", () => {
    const topConceptOf = concept.topConceptOf;
    expect(topConceptOf).toHaveLength(1);
    expect(
      topConceptOf[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  behavesLikeConcept(concept);
};
