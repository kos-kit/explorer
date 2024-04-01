import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "@/lib/models/ModelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { rdf, skos } from "@/lib/vocabularies";

export class RdfJsModelSet implements ModelSet {
  constructor(private readonly dataset: DatasetCore) {}

  *conceptSchemes(): Iterable<ConceptScheme> {
    for (const rdfTypeQuad of this.dataset.match(
      null,
      rdf.type,
      skos.ConceptScheme,
    )) {
      switch (rdfTypeQuad.subject.termType) {
        case "BlankNode":
        case "NamedNode":
          break;
        default:
          continue;
      }
      yield new RdfJsConceptScheme({
        dataset: this.dataset,
        identifier: rdfTypeQuad.subject,
      });
    }
  }
}
