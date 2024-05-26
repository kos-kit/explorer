import { LabeledModel } from "@/lib/models/LabeledModel";
import { SparqlModel } from "@/lib/models/sparql/SparqlModel";
import { Label } from "@/lib/models/Label";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { RdfJsLabeledModel } from "@/lib/models/rdfjs/RdfJsLabeledModel";
import { skosxl } from "@/lib/vocabularies";

export abstract class SparqlLabeledModel<RdfJsModelT extends RdfJsLabeledModel>
  extends SparqlModel<RdfJsModelT>
  implements LabeledModel
{
  async altLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(kwds);
  }

  async hiddenLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(kwds);
  }

  async prefLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).prefLabels(kwds);
  }

  protected override get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT {
  <${this.identifier.value}> ?p ?o .
  <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm .
} WHERE {  
  { <${this.identifier.value}> ?p ?o . }
  UNION
  { <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm . }
}
`;
  }
}
