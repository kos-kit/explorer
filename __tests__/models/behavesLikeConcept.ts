import { Concept } from "@/lib/models/Concept";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConcept = (concept: Concept) => {
  behavesLikeLabeledModel(concept);
};
