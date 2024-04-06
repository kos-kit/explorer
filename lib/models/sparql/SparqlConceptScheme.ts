import { Concept } from "@/lib/models/Concept";
import { SparqlModel } from "@/lib/models/sparql/SparqlModel";
import { Literal, NamedNode } from "@rdfjs/types";
import { ConceptScheme } from "../ConceptScheme";
import { Label } from "../Label";

export class SparqlConceptScheme extends SparqlModel implements ConceptScheme {
  topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("Method not implemented.");
  }
  topConceptsCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  altLabels(): Promise<readonly Label[]> {
    throw new Error("Method not implemented.");
  }
  hiddenLabels(): Promise<readonly Label[]> {
    throw new Error("Method not implemented.");
  }
  prefLabel(languageTag: string): Promise<Label | null> {
    throw new Error("Method not implemented.");
  }
  prefLabels(): Promise<readonly Label[]> {
    throw new Error("Method not implemented.");
  }
  license(languageTag: string): Promise<Literal | NamedNode<string> | null> {
    throw new Error("Method not implemented.");
  }
  modified(): Promise<Literal | null> {
    throw new Error("Method not implemented.");
  }
  rights(languageTag: string): Promise<Literal | null> {
    throw new Error("Method not implemented.");
  }
  rightsHolder(languageTag: string): Promise<Literal | null> {
    throw new Error("Method not implemented.");
  }
}
