import { Literal } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel";
import { Identifier } from "./Identifier";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;
  notations(): Iterable<Literal>;
}
