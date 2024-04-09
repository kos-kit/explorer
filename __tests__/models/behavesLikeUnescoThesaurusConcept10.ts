import { Concept } from "@/lib/models/Concept";
import { behavesLikeConcept } from "./behavesLikeConcept";
import { DataFactory } from "n3";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";

export const behavesLikeUnescoThesaurusConcept10 = (
  lazyConcept: () => Promise<Concept>,
) => {
  it("should be in the single concept scheme", async () => {
    const concept = await lazyConcept();
    const inSchemes = await concept.topConceptOf();
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have a modified date", async () => {
    const concept = await lazyConcept();
    expect((await concept.modified())!.value).toStrictEqual(
      "2019-12-15T13:26:49Z",
    );
  });

  it("should have multiple prefLabels", async () => {
    const concept = await lazyConcept();

    const enPrefLabels = await concept.prefLabels({ languageTag: "en" });
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual(
      "Right to education",
    );

    const frPrefLabels = await concept.prefLabels({ languageTag: "fr" });
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Droit à l'éducation",
    );
  });

  it("should be a top concept of the single concept scheme", async () => {
    const concept = await lazyConcept();
    const topConceptOf = await concept.topConceptOf();
    expect(topConceptOf).toHaveLength(1);
    expect(
      topConceptOf[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have known semantic relations", async () => {
    const concept = await lazyConcept();
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelationProperty.NARROWER,
        conceptNumbers: [4938, 7597],
      },
      {
        semanticRelationProperty: SemanticRelationProperty.RELATED,
        conceptNumbers: [9, 556, 557, 1519, 5052],
      },
    ]) {
      expect(
        await concept.semanticRelationsCount(semanticRelationProperty),
      ).toStrictEqual(conceptNumbers.length);
      const semanticRelations = await concept.semanticRelations(
        semanticRelationProperty,
      );
      expect(semanticRelations).toHaveLength(conceptNumbers.length);
      for (const conceptNumber of conceptNumbers) {
        const conceptIdentifier = DataFactory.namedNode(
          `http://vocabularies.unesco.org/thesaurus/concept${conceptNumber}`,
        );
        expect(
          semanticRelations.find((semanticRelation) =>
            semanticRelation.identifier.equals(conceptIdentifier),
          ),
        ).toBeDefined();
      }
    }
  });

  behavesLikeConcept(lazyConcept);
};
