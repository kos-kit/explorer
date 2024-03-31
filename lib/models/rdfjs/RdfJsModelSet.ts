import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "../ModelSet";
import { ConceptScheme } from "../ConceptScheme";
import { rdf, skos } from "@tpluscode/rdf-ns-builders";

export class RdfJsModelSet implements ModelSet {
  constructor(private readonly dataset: DatasetCore) {}

  *conceptSchemes(): Iterable<ConceptScheme> {
    for (const this.dataset.match(null, rdf.type, skos.ConceptScheme))
  }
}
