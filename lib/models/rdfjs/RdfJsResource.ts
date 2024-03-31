import { BlankNode, NamedNode, DatasetCore, Term } from "@rdfjs/types";

export abstract class RdfJsResource {
  constructor(
    readonly dataset: DatasetCore,
    readonly identifier: BlankNode | NamedNode,
  ) {}

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
