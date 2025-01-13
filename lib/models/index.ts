export * from "./ClientConfiguration";
export * from "./Locale";
export * from "./ServerConfiguration";
export {
  Concept,
  ConceptScheme,
  ConceptStub,
  ConceptSchemeStub,
  Identifier,
  KosResource,
  Label,
  LabelProperty,
  labels,
  notes,
  SemanticRelationProperty,
  semanticRelations,
  semanticRelationProperties,
} from "@kos-kit/generated-models";
export type { LanguageTag } from "@kos-kit/generated-models";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptStub,
  Kos as LibKos,
} from "@kos-kit/generated-models";
export type Kos = LibKos<
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptStub
>;
