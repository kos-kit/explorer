import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsLabeledModel } from "@/lib/models/rdfjs/RdfJsLabeledModel";
import TermSet from "@rdfjs/term-set";
import { skos } from "@/lib/vocabularies";
import { RdfJsConcept } from "@/lib/models/rdfjs/RdfJsConcept";
import { mapTermToIdentifier } from "@/lib/models/rdfjs/mapTermToIdentifier";
import { paginateIterable } from "@/lib/utilities/paginateIterable";
import { Identifier } from "@/lib/models/Identifier";

export class RdfJsConceptScheme
  extends RdfJsLabeledModel
  implements ConceptScheme
{
  topConcepts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Iterable<Concept> {
    return paginateIterable(this._topConcepts(), { limit, offset });
  }

  *_topConcepts(): Iterable<Concept> {
    const conceptIdentifierSet = new TermSet<Identifier>();

    // ConceptScheme -> Concept statement
    for (const quad of this.dataset.match(
      this.identifier,
      skos.topConceptOf,
      null,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.object);
      if (conceptIdentifier === null) {
        continue;
      }

      if (conceptIdentifierSet.has(conceptIdentifier)) {
        continue;
      }

      conceptIdentifierSet.add(conceptIdentifier);

      yield new RdfJsConcept({
        dataset: this.dataset,
        identifier: conceptIdentifier,
      });
    }

    // Concept -> ConceptScheme statement
    for (const quad of this.dataset.match(
      null,
      skos.topConceptOf,
      this.identifier,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.subject);
      if (conceptIdentifier === null) {
        continue;
      }

      if (conceptIdentifierSet.has(conceptIdentifier)) {
        continue;
      }

      conceptIdentifierSet.add(conceptIdentifier);

      yield new RdfJsConcept({
        dataset: this.dataset,
        identifier: conceptIdentifier,
      });
    }
  }
}
