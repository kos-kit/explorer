import { NamedNode, DatasetCore, Term, Literal } from "@rdfjs/types";
import { Identifier } from "@/lib/models/Identifier";
import { dc11, dcterms } from "@/lib/vocabularies";
import { LanguageTag } from "../LanguageTag";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class RdfJsModel {
  protected readonly dataset: DatasetCore;
  readonly identifier: Identifier;

  constructor({
    dataset,
    identifier,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
  }) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  protected countObjects(
    property: NamedNode,
    filter?: (value: Term) => boolean,
  ) {
    if (!filter) {
      filter = () => true;
    }

    let count = 0;
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      if (filter(quad.object)) {
        count++;
      }
    }
    return count;
  }

  protected findAndMapObject<T>(
    property: NamedNode,
    callback: (value: Term) => NonNullable<T> | null,
  ): NonNullable<T> | null {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = callback(quad.object);
      if (mappedObject !== null) {
        return mappedObject as NonNullable<T>;
      }
    }
    return null;
  }

  protected *filterAndMapObjects<T>(
    property: NamedNode,
    callback: (value: Term) => NonNullable<T> | null,
  ): Iterable<NonNullable<T>> {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = callback(quad.object);
      if (mappedObject !== null) {
        yield mappedObject as NonNullable<T>;
      }
    }
  }

  private languageTaggedLiteralObject(
    languageTag: LanguageTag,
    predicate: NamedNode,
  ): Literal | null {
    let untaggedLiteralValue: Literal | null = null;
    for (const quad of this.dataset.match(this.identifier, predicate, null)) {
      if (quad.object.termType !== "Literal") {
        continue;
      }
      if (quad.object.language === languageTag) {
        return quad.object;
      } else if (quad.object.language.length === 0) {
        untaggedLiteralValue = quad.object;
      }
    }
    return untaggedLiteralValue;
  }

  license(languageTag: LanguageTag): Promise<Literal | NamedNode | null> {
    return new Promise((resolve) => {
      let untaggedLiteralValue: Literal | null = null;

      for (const quad of this.dataset.match(
        this.identifier,
        dcterms.license,
        null,
      )) {
        switch (quad.object.termType) {
          case "NamedNode":
            resolve(quad.object);
            return;
          case "Literal":
            if (quad.object.language === languageTag) {
              resolve(quad.object);
              return;
            } else if (quad.object.language.length === 0) {
              untaggedLiteralValue = quad.object;
            }
            break;
          default:
            break;
        }
      }

      resolve(untaggedLiteralValue);
    });
  }

  modified(): Promise<Literal | null> {
    return new Promise((resolve) =>
      resolve(
        this.findAndMapObject(dcterms.modified, (term) =>
          term.termType === "Literal" ? term : null,
        ),
      ),
    );
  }

  rights(languageTag: LanguageTag): Promise<Literal | null> {
    return new Promise((resolve) => {
      for (const predicate of rightsPredicates) {
        const value = this.languageTaggedLiteralObject(languageTag, predicate);
        if (value !== null) {
          resolve(value);
          return;
        }
      }
      resolve(null);
    });
  }

  rightsHolder(languageTag: LanguageTag): Promise<Literal | null> {
    return new Promise((resolve) =>
      resolve(
        this.languageTaggedLiteralObject(languageTag, dcterms.rightsHolder),
      ),
    );
  }
}
