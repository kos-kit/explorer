import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Label } from "../Label";
import { RdfJsResource } from "./RdfJsResource";

export class RdfJsLabel extends RdfJsResource implements Label {
  readonly literalForm: Literal;

  constructor({
    dataset,
    identifier,
    literalForm,
  }: {
    dataset: DatasetCore;
    identifier: BlankNode | NamedNode;
    literalForm: Literal;
  }) {
    super({ dataset, identifier });
    this.literalForm = literalForm;
  }
}
