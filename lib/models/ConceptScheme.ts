import { Concept } from "./Concept";
import { Identifier } from "./Identifier";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  concepts(): Iterable<Concept>;
  readonly identifier: Identifier;
}
