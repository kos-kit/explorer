import { Metadata } from "next";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { slugify } from "@/lib/utilities/slugify";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";

interface Page {
  readonly href: string;
  readonly metadata: Metadata;
}

// const description = "Exploring uses of schema.org types across the web";
const titlePrefix = "SKOS: ";

export default class Pages {
  static concept({
    concept,
    language,
  }: {
    concept: Concept;
    language: string;
  }): Page {
    const conceptIdentifierString = identifierToString(concept.identifier);
    return {
      get href() {
        return `/${language}/concepts/${slugify(conceptIdentifierString)}`;
      },
      get metadata() {
        return {
          // description,
          title:
            titlePrefix +
            "Concept: " +
            (concept.prefLabel(language)?.literalForm.value ??
              conceptIdentifierString),
        };
      },
    };
  }

  static conceptScheme({
    conceptScheme,
    language,
  }: {
    conceptScheme: ConceptScheme;
    language: string;
  }): Page {
    const conceptSchemeIdentifierString = identifierToString(
      conceptScheme.identifier,
    );

    return {
      get href() {
        return `/${language}/conceptSchemes/${slugify(conceptSchemeIdentifierString)}`;
      },
      get metadata() {
        return {
          // description,
          title:
            titlePrefix +
            "Concept scheme: " +
            (conceptScheme.prefLabel(language)?.literalForm.value ??
              conceptSchemeIdentifierString),
        };
      },
    };
  }
}
