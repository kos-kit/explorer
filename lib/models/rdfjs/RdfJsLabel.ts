import { DatasetCore, Literal } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { RdfJsResource } from "@/lib/models/rdfjs/RdfJsResource";
import { Identifier } from "@/lib/models/Identifier";

export class RdfJsLabel extends RdfJsResource implements Label {
  readonly literalForm: Literal;

  constructor({
    dataset,
    identifier,
    literalForm,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
    literalForm: Literal;
  }) {
    super({ dataset, identifier });
    this.literalForm = literalForm;
  }
}
