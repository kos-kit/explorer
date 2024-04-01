import { Metadata } from "next";
import { Literal } from "@rdfjs/types";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { slugify } from "@/lib/utilities/slugify";

interface Page {
  href: string;
  metadata: Metadata;
}

// const description = "Exploring uses of schema.org types across the web";
const titlePrefix = "SKOS: ";

export default class Pages {
  static concept({
    identifier,
    prefLabel,
  }: {
    identifier: Identifier;
    prefLabel: Literal | null;
  }): Page {
    return {
      href: `/concepts/${slugify(identifierToString(identifier))}`,
      metadata: {
        // description,
        title:
          titlePrefix +
          "Concept: " +
          (prefLabel?.value ?? identifierToString(identifier)),
      },
    };
  }

  static conceptScheme({
    identifier,
    prefLabel,
  }: {
    identifier: Identifier;
    prefLabel: Literal | null;
  }): Page {
    return {
      href: `/conceptSchemes/${slugify(identifierToString(identifier))}`,
      metadata: {
        // description,
        title:
          titlePrefix +
          "Concept scheme: " +
          (prefLabel?.value ?? identifierToString(identifier)),
      },
    };
  }
}
