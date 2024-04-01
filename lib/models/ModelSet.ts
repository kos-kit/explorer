import { ConceptScheme } from "@/lib/models/ConceptScheme";

export interface ModelSet {
  conceptSchemes(): Iterable<ConceptScheme>;
}
