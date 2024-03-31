import { Concept } from "../Concept";
import { ConceptScheme } from "../ConceptScheme";
import { RdfJsLabeledModel } from "./RdfJsLabeledModel";

export class RdfJsConceptScheme
  extends RdfJsLabeledModel
  implements ConceptScheme
{
  *concepts(): Iterable<Concept> {}
}
