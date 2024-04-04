import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "@/lib/models/ModelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { rdf, skos } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "@/lib/models/rdfjs/mapTermToIdentifier";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Concept } from "@/lib/models/Concept";
import { RdfJsConcept } from "@/lib/models/rdfjs/RdfJsConcept";
import { getRdfInstances } from "./getRdfInstances";
import { Memoize } from "typescript-memoize";
import { paginateIterable } from "@/lib/utilities/paginateIterable";

export class RdfJsModelSet implements ModelSet {
  constructor(private readonly dataset: DatasetCore) {}

  conceptByIdentifier(identifier: Identifier): Concept {
    return new RdfJsConcept({ dataset: this.dataset, identifier: identifier });
  }

  private *conceptIdentifiers(): Iterable<Identifier> {
    yield* getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  concepts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Iterable<Concept> {
    return paginateIterable(this._concepts(), { limit, offset });
  }

  private *_concepts(): Iterable<Concept> {
    for (const identifier of this.conceptIdentifiers()) {
      yield new RdfJsConcept({
        dataset: this.dataset,
        identifier,
      });
    }
  }

  @Memoize()
  get conceptsCount(): number {
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of this.conceptIdentifiers()) {
      count++;
    }
    return count;
  }

  conceptSchemeByIdentifier(identifier: Identifier): ConceptScheme {
    for (const conceptScheme of this.conceptSchemes) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(identifierToString(identifier));
  }

  get conceptSchemes(): readonly ConceptScheme[] {
    return [...this._conceptSchemes()];
  }

  private *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield new RdfJsConceptScheme({
        dataset: this.dataset,
        identifier,
      });
    }
  }

  languageTags = ["en"];
}
