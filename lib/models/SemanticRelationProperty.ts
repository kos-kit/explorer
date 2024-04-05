import { NamedNode } from "@rdfjs/types";
import { skos } from "@/lib/vocabularies";

export class SemanticRelationProperty {
  static readonly BROADER = new SemanticRelationProperty(skos.broader);

  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty(
    skos.broaderTransitive,
  );

  static readonly NARROWER = new SemanticRelationProperty(skos.narrower);

  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty(
    skos.narrowerTransitive,
  );

  static readonly RELATED = new SemanticRelationProperty(skos.related);

  static readonly SEMANTIC_RELATION = new SemanticRelationProperty(
    skos.semanticRelation,
  );

  readonly name: string;

  private constructor(readonly identifier: NamedNode) {
    this.name = identifier.value.substring(skos[""].value.length);
  }

  static byName(name: string) {
    for (const semanticRelationProperty of SemanticRelationProperty.values) {
      if (semanticRelationProperty.name === name) {
        return semanticRelationProperty;
      }
    }
    throw new RangeError(name);
  }

  static readonly values: readonly SemanticRelationProperty[] = [
    SemanticRelationProperty.BROADER,
    SemanticRelationProperty.BROADER_TRANSITIVE,
    SemanticRelationProperty.NARROWER,
    SemanticRelationProperty.NARROWER_TRANSITIVE,
    SemanticRelationProperty.RELATED,
    SemanticRelationProperty.SEMANTIC_RELATION,
  ];
}
