import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Label } from "./Label";

export interface Concept {
  readonly prefLabels: readonly Label[];
  readonly altLabels: readonly Label[];
  readonly node: BlankNode | NamedNode;
  readonly notations: readonly Literal[];
}
