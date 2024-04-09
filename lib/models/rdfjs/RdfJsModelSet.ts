import { DatasetCore } from "@rdfjs/types";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { skos } from "@/lib/vocabularies";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Concept } from "@/lib/models/Concept";
import { RdfJsConcept } from "@/lib/models/rdfjs/RdfJsConcept";
import { getRdfInstances } from "./getRdfInstances";
import { paginateIterable } from "@/lib/utilities/paginateIterable";
import { AbstractModelSet } from "@/lib/models/AbstractModelSet";

export class RdfJsModelSet extends AbstractModelSet {
  constructor(private readonly dataset: DatasetCore) {
    super();
  }

  conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(
        new RdfJsConcept({ dataset: this.dataset, identifier: identifier }),
      ),
    );
  }

  private *conceptIdentifiers(): Iterable<Identifier> {
    yield* getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const conceptIdentifier of paginateIterable(
        this.conceptIdentifiers(),
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

  conceptsCount(): Promise<number> {
    return new Promise((resolve) => {
      let count = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of this.conceptIdentifiers()) {
        count++;
      }
      resolve(count);
    });
  }

  async conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(identifierToString(identifier));
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => resolve([...this._conceptSchemes()]));
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
}
