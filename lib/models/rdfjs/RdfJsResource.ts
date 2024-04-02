import { NamedNode, DatasetCore, Term } from "@rdfjs/types";
import { Identifier } from "@/lib/models/Identifier";

export abstract class RdfJsResource {
  readonly dataset: DatasetCore;
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
}
