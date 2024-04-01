import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "../Concept";
import { ConceptScheme } from "../ConceptScheme";
import { RdfJsLabeledModel } from "./RdfJsLabeledModel";
import TermSet from "@rdfjs/term-set";
import { skos } from "@/lib/vocabularies";

export class RdfJsConceptScheme
  extends RdfJsLabeledModel
  implements ConceptScheme
{
  *concepts(): Iterable<Concept> {
    const conceptIdentifierSet = new TermSet<BlankNode | NamedNode>();

    yield* this.filterAndMapObjects(skos.hasTopConcept, (term) => {
      switch (term.termType) {
        case "BlankNode":
        case "NamedNode":
          return new RdfJsConcept(this.dataset, term);
        default:
          return null;
      }
    });
  }
}
