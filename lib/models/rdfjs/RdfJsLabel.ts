import { DatasetCore, Literal } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { RdfJsModel } from "@/lib/models/rdfjs/RdfJsModel";
import { Identifier } from "@/lib/models/Identifier";

export class RdfJsLabel extends RdfJsModel implements Label {
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
