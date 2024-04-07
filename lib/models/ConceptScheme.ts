import { Concept } from "@/lib/models/Concept";
import { Identifier } from "@/lib/models/Identifier";
import { LabeledModel } from "@/lib/models/LabeledModel";

export interface ConceptScheme extends LabeledModel {
  readonly identifier: Identifier;

  topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  topConceptsCount(): Promise<number>;
}
