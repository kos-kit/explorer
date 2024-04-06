import { Concept } from "@/lib/models/Concept";
import { SparqlModel } from "@/lib/models/sparql/SparqlModel";
import { Literal, NamedNode } from "@rdfjs/types";
import { ConceptScheme } from "../ConceptScheme";
import { Label } from "../Label";
import { NoteProperty } from "../NoteProperty";
import { SemanticRelationProperty } from "../SemanticRelationProperty";

export class SparqlConcept extends SparqlModel implements Concept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("Method not implemented.");
  }

  notations(): Promise<readonly Literal[]> {
    throw new Error("Method not implemented.");
  }

  notes(
    languageTag: string,
    property: NoteProperty,
  ): Promise<readonly Literal[]> {
    throw new Error("Method not implemented.");
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    throw new Error("Method not implemented.");
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    throw new Error("Method not implemented.");
  }

  topConceptOf(): Promise<readonly ConceptScheme[]> {
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
