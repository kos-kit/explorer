import { ConceptScheme as KosKitConceptScheme } from "@kos-kit/models";
import { Concept } from "./Concept";
import { Label } from "./Label";

export type ConceptScheme = KosKitConceptScheme<Concept, Label>;
