import { skos } from "@/lib/vocabularies";
import { SemanticRelationProperty } from "./SemanticRelationProperty";

export class MappingProperty extends SemanticRelationProperty {
  static readonly BROAD_MATCH = new MappingProperty(
    skos.broadMatch,
    "Broad match",
  );

  static readonly CLOSE_MATCH = new MappingProperty(
    skos.closeMatch,
    "Close match",
  );

  static readonly EXACT_MATCH = new MappingProperty(
    skos.exactMatch,
    "Exact match",
  );

  static readonly NARROW_MATCH = new MappingProperty(
    skos.narrowMatch,
    "Narrow match",
  );

  static readonly RELATED_MATCH = new MappingProperty(
    skos.relatedMatch,
    "Related match",
  );
}
