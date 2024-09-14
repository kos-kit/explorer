import { Concept as KosKitConcept } from "@kos-kit/models";
import { ConceptScheme } from "./ConceptScheme";
import { Label } from "./Label";

export type Concept = KosKitConcept<Concept, ConceptScheme, Label>;
