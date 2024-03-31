import { BlankNode, Literal, NamedNode } from "@rdfjs/types";

export interface Label {
  readonly literalForm: Literal;
  readonly node: BlankNode | NamedNode | null;
}
