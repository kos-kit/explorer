export * from "./ClientConfiguration";
export * from "./Locale";
export * from "./ServerConfiguration";
export {
  Concept,
  ConceptScheme,
  PartialConcept,
  PartialConceptScheme,
  Identifier,
  KosResource,
  Label,
  LabelProperty,
  labels,
  notes,
  SemanticRelationProperty,
  semanticRelations,
  semanticRelationProperties,
} from "@kos-kit/models";
export type { LanguageTag } from "@kos-kit/models";
import {
  Concept,
  ConceptScheme,
  Kos as LibKos,
  PartialConcept,
  PartialConceptScheme,
} from "@kos-kit/models";
export type Kos = LibKos<
  Concept,
  ConceptScheme,
  PartialConceptScheme,
  PartialConcept
>;
