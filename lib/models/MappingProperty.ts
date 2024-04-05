import { NamedNode } from "@rdfjs/types";
import { skos } from "@/lib/vocabularies";

export class MappingProperty {
  static readonly BROAD_MATCH = new MappingProperty(skos.broadMatch);

  static readonly CLOSE_MATCH = new MappingProperty(skos.closeMatch);

  static readonly EXACT_MATCH = new MappingProperty(skos.exactMatch);

  static readonly NARROW_MATCH = new MappingProperty(skos.narrowMatch);

  static readonly MAPPING_RELATION = new MappingProperty(skos.mappingRelation);

  static readonly RELATED_MATCH = new MappingProperty(skos.relatedMatch);

  readonly name: string;

  private constructor(readonly identifier: NamedNode) {
    this.name = identifier.value.substring(skos[""].value.length);
  }

  static byName(name: string) {
    for (const mappingProperty of MappingProperty.values) {
      if (mappingProperty.name === name) {
        return mappingProperty;
      }
    }
    throw new RangeError(name);
  }

  static readonly values: readonly MappingProperty[] = [
    MappingProperty.BROAD_MATCH,
    MappingProperty.CLOSE_MATCH,
    MappingProperty.EXACT_MATCH,
    MappingProperty.MAPPING_RELATION,
    MappingProperty.NARROW_MATCH,
    MappingProperty.RELATED_MATCH,
  ];
}
