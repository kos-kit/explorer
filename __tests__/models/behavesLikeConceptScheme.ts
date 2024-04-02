import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConceptScheme = (conceptScheme: ConceptScheme) => {
  it("should get concepts", () => {
    const firstConcepts = [...conceptScheme.concepts({ limit: 2, offset: 0 })];
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = [...conceptScheme.concepts({ limit: 2, offset: 10 })];
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBeTruthy();
    }
  });

  behavesLikeLabeledModel(conceptScheme);
};
