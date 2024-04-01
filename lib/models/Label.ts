import { Literal } from "@rdfjs/types";
import { Model } from "@/lib/models/Model";

export interface Label extends Model {
  readonly literalForm: Literal;
}
