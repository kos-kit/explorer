import { Literal } from "@rdfjs/types";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { ConceptScheme } from "@/lib/models/ConceptScheme";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;
  readonly inSchemes: readonly ConceptScheme[];
  readonly notations: readonly Literal[];
  readonly topConceptOf: readonly ConceptScheme[];
}
