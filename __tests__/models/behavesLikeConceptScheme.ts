import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConceptScheme = (conceptScheme: ConceptScheme) => {
  // it("should get top concepts", () => {
  //   const firstConcepts = [
  //     ...conceptScheme.topConcepts({ limit: 2, offset: 0 }),
  //   ];
  //   expect(firstConcepts).toHaveLength(10);

  //   const nextConcepts = [
  //     ...conceptScheme.topConcepts({ limit: 2, offset: 10 }),
  //   ];
  //   expect(nextConcepts).toHaveLength(10);
  //   for (const nextConcept of nextConcepts) {
  //     expect(
  //       firstConcepts.every(
  //         (firstConcept) =>
  //           !firstConcept.identifier.equals(nextConcept.identifier),
  //       ),
  //     ).toBeTruthy();
  //   }
  // });

  it("should get top concepts count", () => {
    expect(conceptScheme.topConceptsCount).toStrictEqual(1);
  });

  // behavesLikeLabeledModel(conceptScheme);
};
