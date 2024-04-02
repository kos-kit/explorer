import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "@/lib/models/ModelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { rdf, skos } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "./mapTermToIdentifier";

export class RdfJsModelSet implements ModelSet {
  constructor(private readonly dataset: DatasetCore) {}

  get conceptSchemes(): Iterable<ConceptScheme> {
    return this._conceptSchemes();
  }

  *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const rdfTypeQuad of this.dataset.match(
      null,
      rdf.type,
      skos.ConceptScheme,
    )) {
      const identifier = mapTermToIdentifier(rdfTypeQuad.subject);
      if (identifier !== null) {
        yield new RdfJsConceptScheme({
          dataset: this.dataset,
          identifier,
        });
      }
    }
  }
}
