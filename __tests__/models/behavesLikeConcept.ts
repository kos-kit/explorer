import { Concept } from "@/lib/models/Concept";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConcept = (concept: Concept) => {
  it("should have notations", () => {
    for (const notation of concept.notations) {
      expect(notation.value).not.toHaveLength(0);
    }
  });

  behavesLikeLabeledModel(concept);
};
