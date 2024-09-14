import { Kos as KosKitKos } from "@kos-kit/models";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { Label } from "./Label";

export type Kos = KosKitKos<Concept, ConceptScheme, Label>;
