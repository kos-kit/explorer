import { Concept } from "./Concept";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  concepts(): Iterable<Concept>;
}
