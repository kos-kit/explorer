import { NamedNode } from "@rdfjs/types";
import { skos } from "@/lib/vocabularies";

export abstract class PropertyEnum {
  readonly name: string;

  protected constructor(
    readonly identifier: NamedNode,
    readonly label: string,
  ) {
    this.name = identifier.value.substring(skos[""].value.length);
  }
}
