import { Literal } from "@rdfjs/types";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { ConceptScheme } from "@/lib/models/ConceptScheme";

export interface Concept extends LabeledModel {
  readonly conceptSchemes: readonly ConceptScheme[];
  readonly identifier: Identifier;
  readonly notations: readonly Literal[];
}
