import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept";
import { Label } from "./Label";

export interface ConceptScheme {
  readonly altLabels: readonly Label[];
  readonly concepts: readonly Concept[];
  readonly prefLabels: readonly Label[];
  readonly node: BlankNode | NamedNode;
}
