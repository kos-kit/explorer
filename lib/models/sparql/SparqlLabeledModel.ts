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
  async altLabels(languageTag: LanguageTag): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(languageTag);
  }

  async hiddenLabels(languageTag: string): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(languageTag);
  }

  async prefLabel(languageTag: string): Promise<Label | null> {
    return (await this.getOrCreateRdfJsModel()).prefLabel(languageTag);
  }

  async prefLabels(languageTag: string): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).prefLabels(languageTag);
  }

  protected get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT WHERE {
  VALUES ?s { <${this.identifier.value}> }
  ?s ?p ?o .
  OPTIONAL { ?o <${skosxl.literalForm.value}> ?literalForm }
}
`;
  }
}
