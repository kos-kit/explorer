import { Concept } from "@/lib/models/Concept";
import { DatasetCore, Literal, Quad } from "@rdfjs/types";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { NoteProperty } from "@/lib/models/NoteProperty";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { RdfJsConcept } from "@/lib/models/rdfjs/RdfJsConcept";
import { SparqlConceptScheme } from "@/lib/models/sparql/SparqlConceptScheme";
import { SparqlLabeledModel } from "@/lib/models/sparql/SparqlLabeledModel";

export class SparqlConcept
  extends SparqlLabeledModel<RdfJsConcept>
  implements Concept
{
  protected createRdfJsModel(dataset: DatasetCore<Quad, Quad>): RdfJsConcept {
    return new RdfJsConcept({ dataset, identifier: this.identifier });
  }

  async inSchemes(): Promise<readonly ConceptScheme[]> {
    return (await (await this.getOrCreateRdfJsModel()).inSchemes()).map(
      (conceptScheme) =>
        new SparqlConceptScheme({
          identifier: conceptScheme.identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
    );
  }

  async notations(): Promise<readonly Literal[]> {
    return (await this.getOrCreateRdfJsModel()).notations();
  }

  async notes(
    languageTag: string,
    property: NoteProperty,
  ): Promise<readonly Literal[]> {
    return (await this.getOrCreateRdfJsModel()).notes(languageTag, property);
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return (
      await (await this.getOrCreateRdfJsModel()).semanticRelations(property)
    ).map(
      (conceptScheme) =>
        new SparqlConcept({
          identifier: conceptScheme.identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
    );
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return (await this.getOrCreateRdfJsModel()).semanticRelationsCount(
      property,
    );
  }

  async topConceptOf(): Promise<readonly ConceptScheme[]> {
    return (await (await this.getOrCreateRdfJsModel()).topConceptOf()).map(
      (conceptScheme) =>
        new SparqlConceptScheme({
          identifier: conceptScheme.identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
    );
  }
}
