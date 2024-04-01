import { Literal } from "@rdfjs/types";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;
  readonly notations: Iterable<Literal>;
}
