import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "../ModelSet";
import { ConceptScheme } from "../ConceptScheme";
import { rdf, skos } from "@tpluscode/rdf-ns-builders";
import { RdfJsConceptScheme } from "./RdfJsConceptScheme";

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

      yield new RdfJsConceptScheme(this.dataset, rdfTypeQuad.subject);
    }
  }
}
