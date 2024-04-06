import { Literal } from "@rdfjs/types";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { SemanticRelationProperty } from "./SemanticRelationProperty";
import { NoteProperty } from "./NoteProperty";
import { LanguageTag } from "./LanguageTag";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;
  readonly inSchemes: readonly ConceptScheme[];

  readonly notations: readonly Literal[];

  notes(languageTag: LanguageTag, property: NoteProperty): readonly Literal[];

  semanticRelations(property: SemanticRelationProperty): readonly Concept[];
  semanticRelationsCount(property: SemanticRelationProperty): number;

  readonly topConceptOf: readonly ConceptScheme[];
}
