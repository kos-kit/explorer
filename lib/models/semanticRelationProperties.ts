import { MappingProperty } from "@/lib/models/MappingProperty";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";

export const mappingProperties: readonly MappingProperty[] = [
  MappingProperty.BROAD_MATCH,
  MappingProperty.CLOSE_MATCH,
  MappingProperty.EXACT_MATCH,
  MappingProperty.NARROW_MATCH,
  MappingProperty.RELATED_MATCH,
];

// https://www.w3.org/TR/skos-reference/#L4160
export const semanticRelationProperties: readonly SemanticRelationProperty[] = [
  SemanticRelationProperty.BROADER,
  SemanticRelationProperty.BROADER_TRANSITIVE,
  SemanticRelationProperty.NARROWER,
  SemanticRelationProperty.NARROWER_TRANSITIVE,
  SemanticRelationProperty.RELATED,
].concat(mappingProperties);

export const semanticRelationPropertiesByName =
  semanticRelationProperties.reduce(
    (map, semanticRelationProperty) => {
      map[semanticRelationProperty.name] = semanticRelationProperty;
      return map;
    },
    {} as {
      [index: string]: SemanticRelationProperty;
    },
  );
