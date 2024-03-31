import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel";

export interface Concept extends LabeledModel {
  readonly node: BlankNode | NamedNode;
  readonly notations: readonly Literal[];
}
