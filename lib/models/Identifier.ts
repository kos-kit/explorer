import { Resource } from "@kos-kit/rdf-resource";
import { dataFactory } from "@/lib/dataFactory";

export type Identifier = Resource.Identifier;

export namespace Identifier {
  export function fromString(identifier: string): Identifier {
    return Resource.Identifier.fromString(dataFactory, identifier);
  }

  export function toString(identifier: Identifier): string {
    return Resource.Identifier.toString(identifier);
  }
}
