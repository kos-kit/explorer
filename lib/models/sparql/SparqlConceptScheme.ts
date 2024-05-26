import { Concept } from "@/lib/models/Concept";
import { DatasetCore, Quad } from "@rdfjs/types";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { SparqlConcept } from "@/lib/models/sparql/SparqlConcept";
import { SparqlLabeledModel } from "@/lib/models/sparql/SparqlLabeledModel";
import { skos, skosxl } from "@/lib/vocabularies";

export class SparqlConceptScheme
  extends SparqlLabeledModel<RdfJsConceptScheme>
  implements ConceptScheme
{
  protected createRdfJsModel(
    dataset: DatasetCore<Quad, Quad>,
  ): RdfJsConceptScheme {
    return new RdfJsConceptScheme({ dataset, identifier: this.identifier });
  }

  protected override get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT {
  <${this.identifier.value}> ?p ?o .
  <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm .
  ?concept <${skos.topConceptOf.value}> <${this.identifier.value}> .
} WHERE {
  { <${this.identifier.value}> ?p ?o . }
  UNION
  { <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm . }
  UNION
  { ?concept <${skos.topConceptOf.value}> <${this.identifier.value}> . }
}
`;
  }

  async topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return (await (await this.getOrCreateRdfJsModel()).topConcepts(kwds)).map(
      (conceptScheme) =>
        new SparqlConcept({
          identifier: conceptScheme.identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
    );
  }

  async topConceptsCount(): Promise<number> {
    return (await this.getOrCreateRdfJsModel()).topConceptsCount();
  }
}
