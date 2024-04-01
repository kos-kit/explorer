import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConceptScheme = (conceptScheme: ConceptScheme) => {
  it("should get concepts", () => {
    const concepts = [...conceptScheme.concepts()];
    expect(concepts).not.toHaveLength(0);
  });

  behavesLikeLabeledModel(conceptScheme);
};
