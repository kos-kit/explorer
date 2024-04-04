import { Metadata } from "next";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "./models/LanguageTag";
import { filenamify } from "./utilities/filenamify";

interface Page {
  readonly href: string;
  readonly metadata: Metadata;
}

// const description = "Exploring uses of schema.org types across the web";
const titlePrefix = "SKOS: ";

export class Pages {
  static concept({
    concept,
    languageTag,
  }: {
    concept: Concept;
    languageTag: LanguageTag;
  }): Page {
    const conceptIdentifierString = identifierToString(concept.identifier);
    return {
      get href() {
        return `/${languageTag}/concepts/${filenamify(conceptIdentifierString)}`;
      },
      get metadata() {
        return {
          // description,
          title:
            titlePrefix +
            "Concept: " +
            (concept.prefLabel(languageTag)?.literalForm.value ??
              conceptIdentifierString),
        } satisfies Metadata;
      },
    };
  }

  static conceptScheme({
    conceptScheme,
    languageTag,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
  }): Page {
    const conceptSchemeIdentifierString = identifierToString(
      conceptScheme.identifier,
    );

    return {
      get href() {
        return `/${languageTag}/conceptSchemes/${filenamify(conceptSchemeIdentifierString)}`;
      },
      get metadata() {
        return {
          // description,
          title:
            titlePrefix +
            "Concept scheme: " +
            (conceptScheme.prefLabel(languageTag)?.literalForm.value ??
              conceptSchemeIdentifierString),
        } satisfies Metadata;
      },
    };
  }

  static conceptSchemeTopConcepts({
    conceptScheme,
    languageTag,
    page,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
    page: number;
  }) {
    const conceptSchemePage = Pages.conceptScheme({
      conceptScheme,
      languageTag,
    });
    return {
      get href() {
        return conceptSchemePage.href + "/topConcepts/" + page;
      },
      get metadata() {
        return {
          title: conceptSchemePage.metadata.title + ": Top concepts",
        } satisfies Metadata;
      },
    };
  }
}
