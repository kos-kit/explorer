import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  readonly concepts: readonly Concept[];
  readonly node: BlankNode | NamedNode;
}
