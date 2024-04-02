import { ConceptScheme } from "@/lib/models/ConceptScheme";

export interface ModelSet {
  readonly conceptSchemes: Iterable<ConceptScheme>;
}
