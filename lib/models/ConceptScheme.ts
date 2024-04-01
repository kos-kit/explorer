import { Concept } from "@/lib/models/Concept";
import { Identifier } from "@/lib/models/Identifier";
import { LabeledModel } from "@/lib/models/LabeledModel";

export interface ConceptScheme extends LabeledModel {
  concepts(): Iterable<Concept>;
  readonly identifier: Identifier;
}
