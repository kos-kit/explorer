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
  private *topConceptIdentifiers(): Iterable<Identifier> {
    const conceptIdentifierSet = new TermSet<Identifier>();

    // ConceptScheme -> Concept statement
    for (const quad of this.dataset.match(
      this.identifier,
      skos.hasTopConcept,
      null,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.object);
      if (
        conceptIdentifier !== null &&
        !conceptIdentifierSet.has(conceptIdentifier)
      ) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const quad of this.dataset.match(
      null,
      skos.topConceptOf,
      this.identifier,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.subject);
      if (
        conceptIdentifier !== null &&
        !conceptIdentifierSet.has(conceptIdentifier)
      ) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }
  }

  topConcepts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const conceptIdentifier of paginateIterable(
        this.topConceptIdentifiers(),
        { limit, offset },
      )) {
        result.push(
          new RdfJsConcept({
            dataset: this.dataset,
            identifier: conceptIdentifier,
          }),
        );
      }
      resolve(result);
    });
  }

  topConceptsCount(): Promise<number> {
    return new Promise((resolve) => {
      let count = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of this.topConceptIdentifiers()) {
        count++;
      }
      resolve(count);
    });
  }
}
