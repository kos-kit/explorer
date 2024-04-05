import { skos } from "@/lib/vocabularies";
import { NamedNode } from "@rdfjs/types";

export class SemanticRelationProperty {
  static readonly BROADER = new SemanticRelationProperty(
    skos.broader,
    "Broader",
  );

  static readonly BROADER_TRANSITIVE = new SemanticRelationProperty(
    skos.broaderTransitive,
    "Broader (transitive)",
  );

  static readonly NARROWER = new SemanticRelationProperty(
    skos.narrower,
    "Narrower",
  );

  static readonly NARROWER_TRANSITIVE = new SemanticRelationProperty(
    skos.narrowerTransitive,
    "Narrower (transitive)",
  );

  static readonly RELATED = new SemanticRelationProperty(
    skos.related,
    "Related",
  );

  readonly name: string;

  protected constructor(
    readonly identifier: NamedNode,
    readonly label: string,
  ) {
    this.name = identifier.value.substring(skos[""].value.length);
  }
}
