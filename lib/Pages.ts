import { Metadata } from "next";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { slugify } from "@/lib/utilities/slugify";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";

interface Page {
  href: string;
  metadata: Metadata;
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
      href: `/${language}/concepts/${slugify(conceptIdentifierString)}`,
      metadata: {
        // description,
        title:
          titlePrefix +
          "Concept: " +
          (concept.prefLabel(language)?.literalForm.value ??
            conceptIdentifierString),
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
      href: `/${language}/conceptSchemes/${slugify(conceptSchemeIdentifierString)}`,
      metadata: {
        // description,
        title:
          titlePrefix +
          "Concept scheme: " +
          (conceptScheme.prefLabel(language)?.literalForm.value ??
            conceptSchemeIdentifierString),
      },
    };
  }
}
