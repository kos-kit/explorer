import { Metadata } from "next";
import { Literal } from "@rdfjs/types";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";

// const description = "Exploring uses of schema.org types across the web";
const titlePrefix = "SKOS: ";

export default class PageMetadata {
  static concept({
    identifier,
    prefLabel,
  }: {
    identifier: Identifier;
    prefLabel: Literal | null;
  }): Metadata {
    return {
      // description,
      title:
        titlePrefix +
        "Concept: " +
        (prefLabel?.value ?? identifierToString(identifier)),
    };
  }

  static conceptScheme({
    identifier,
    prefLabel,
  }: {
    identifier: Identifier;
    prefLabel: Literal | null;
  }): Metadata {
    return {
      // description,
      title:
        titlePrefix +
        "Concept scheme: " +
        (prefLabel?.value ?? identifierToString(identifier)),
    };
  }
}
