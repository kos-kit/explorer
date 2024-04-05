import { Metadata } from "next";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { filenamify } from "@/lib/utilities/filenamify";
import modelSet from "./modelSet";
import configuration from "./configuration";

interface Page {
  readonly href: string;
  readonly metadata: Metadata;
}

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
          title: `${Pages.root({ languageTag }).metadata.title}: Concept: ${
            concept.prefLabel(languageTag)?.literalForm.value ??
            conceptIdentifierString
          }`,
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
          title: `${Pages.root({ languageTag }).metadata.title}: Concept Scheme: ${
            conceptScheme.prefLabel(languageTag)?.literalForm.value ??
            conceptSchemeIdentifierString
          }`,
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

  static root({ languageTag }: { languageTag: LanguageTag }): Page {
    const conceptSchemes = modelSet.conceptSchemes;

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabel = conceptScheme.prefLabel(languageTag);
      if (prefLabel !== null) {
        title = prefLabel.literalForm.value;
      }
    }

    return {
      href: "/",
      metadata: {
        title: title,
      },
    };
  }
}
