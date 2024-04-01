import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "../Concept";
import { ConceptScheme } from "../ConceptScheme";
import { RdfJsLabeledModel } from "./RdfJsLabeledModel";
import TermSet from "@rdfjs/term-set";
import { skos } from "@/lib/vocabularies";
import { RdfJsConcept } from "./RdfJsConcept";
import invariant from "ts-invariant";

export class RdfJsConceptScheme
  extends RdfJsLabeledModel
  implements ConceptScheme
{
  *concepts(): Iterable<Concept> {
    const conceptIdentifierSet = new TermSet<BlankNode | NamedNode>();

    // ConceptScheme -> Concept statement
    yield* this.filterAndMapObjects(skos.hasTopConcept, (term) => {
      switch (term.termType) {
        case "BlankNode":
        case "NamedNode":
          if (!conceptIdentifierSet.has(term)) {
            conceptIdentifierSet.add(term);
            return new RdfJsConcept(this.dataset, term);
          }
      }
      return null;
    });

    // Concept -> ConceptScheme statement
    for (const predicate of [skos.inScheme, skos.topConceptOf]) {
      for (const quad of this.dataset.match(null, predicate, this.identifier)) {
        invariant(
          quad.subject.termType === "BlankNode" ||
            quad.subject.termType === "NamedNode",
        );
        if (!conceptIdentifierSet.has(quad.subject)) {
          conceptIdentifierSet.add(quad.subject);
          yield new RdfJsConcept(this.dataset, quad.subject);
        }
      }
    }
  }
}
