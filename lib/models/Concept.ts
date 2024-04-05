import { Literal } from "@rdfjs/types";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { SemanticRelationProperty } from "./SemanticRelationProperty";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;
  readonly inSchemes: readonly ConceptScheme[];

  readonly notations: readonly Literal[];

  semanticRelations(property: SemanticRelationProperty): readonly Concept[];
  semanticRelationsCount(property: SemanticRelationProperty): number;

  readonly topConceptOf: readonly ConceptScheme[];
}
