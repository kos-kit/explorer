import { ConceptScheme } from "./ConceptScheme";

export interface ModelSet {
  conceptSchemes(): Iterable<ConceptScheme>;
}
