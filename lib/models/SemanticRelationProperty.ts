import { skos } from "@/lib/vocabularies";
import { PropertyEnum } from "./PropertyEnum";

export class SemanticRelationProperty extends PropertyEnum {
  static readonly BROADER = new SemanticRelationProperty(skos.broader);

  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty(
    skos.broaderTransitive,
  );

  static readonly NARROWER = new SemanticRelationProperty(skos.narrower);

  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty(
    skos.narrowerTransitive,
  );

  static readonly RELATED = new SemanticRelationProperty(skos.related);

  static byName(name: string): SemanticRelationProperty | null {
    for (const semanticRelationProperty of SemanticRelationProperty.values) {
      if (semanticRelationProperty.name === name) {
        return semanticRelationProperty;
      }
    }
    return null;
  }

  static readonly values: readonly SemanticRelationProperty[] = [
    SemanticRelationProperty.BROADER,
    SemanticRelationProperty.BROADER_TRANSITIVE,
    SemanticRelationProperty.NARROWER,
    SemanticRelationProperty.NARROWER_TRANSITIVE,
    SemanticRelationProperty.RELATED,
  ];
}
