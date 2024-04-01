import { Literal } from "@rdfjs/types";
import { Model } from "./Model";

export interface Label extends Model {
  readonly literalForm: Literal;
}
