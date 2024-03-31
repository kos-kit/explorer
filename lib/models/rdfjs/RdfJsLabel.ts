import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Label } from "../Label";
import { RdfJsResource } from "./RdfJsResource";

export class RdfJsLabel extends RdfJsResource implements Label {
  constructor(
    dataset: DatasetCore,
    identifier: BlankNode | NamedNode,
    readonly literalForm: Literal,
  ) {
    super(dataset, identifier);
  }
}
