import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Model } from "./Model";

export interface Label extends Model {
  readonly literalForm: Literal;
  readonly node: BlankNode | NamedNode | null;
}
