import { Literal } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel";

export interface Concept extends LabeledModel {
  notations(): Iterable<Literal>;
}
