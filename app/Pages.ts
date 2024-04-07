import { Metadata } from "next";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { filenamify } from "@/lib/utilities/filenamify";
import modelSet from "./modelSet";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { displayLabel } from "@/lib/utilities/displayLabel";

interface Page {
  readonly href: string;
  readonly metadata: Metadata;
}

export class Pages {
  static async concept({
    concept,
    languageTag,
  }: {
    concept: Concept;
    languageTag: LanguageTag;
  }): Promise<Page> {
    const conceptIdentifierString = identifierToString(concept.identifier);
    const rootPage = await Pages.root({ languageTag });
    return {
      get href() {
        return `/${languageTag}/concepts/${filenamify(conceptIdentifierString)}`;
      },
      get metadata() {
        return {
          title: `${rootPage.metadata.title}: Concept: ${displayLabel({ languageTag, model: concept })}`,
        } satisfies Metadata;
      },
    };
  }

  static async conceptScheme({
    conceptScheme,
    languageTag,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
  }): Promise<Page> {
    const conceptSchemeIdentifierString = identifierToString(
      conceptScheme.identifier,
    );
    const rootPage = await Pages.root({ languageTag });

    return {
      get href() {
        return `/${languageTag}/conceptSchemes/${filenamify(conceptSchemeIdentifierString)}`;
      },
      get metadata() {
        return {
          title: `${rootPage.metadata.title}: Concept Scheme: ${displayLabel({ languageTag, model: conceptScheme })}`,
        } satisfies Metadata;
      },
    };
  }

  static async conceptSchemeTopConcepts({
    conceptScheme,
    languageTag,
    page,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
    page: number;
  }) {
    const conceptSchemePage = await Pages.conceptScheme({
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

  static async conceptSemanticRelations({
    concept,
    languageTag,
    semanticRelationProperty,
  }: {
    concept: Concept;
    languageTag: LanguageTag;
    semanticRelationProperty: SemanticRelationProperty;
  }) {
    const conceptPage = await Pages.concept({
      concept,
      languageTag,
    });

    return {
      get href() {
        return (
          conceptPage.href +
          "/semanticRelations/" +
          semanticRelationProperty.name
        );
      },
      get metadata() {
        return {
          title: `${conceptPage.metadata.title}: ${semanticRelationProperty.label} concepts`,
        } satisfies Metadata;
      },
    };
  }

  static async root({
    languageTag,
  }: {
    languageTag: LanguageTag;
  }): Promise<Page> {
    const conceptSchemes = await modelSet.conceptSchemes();

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = await conceptScheme.prefLabels(languageTag);
      if (prefLabels.length > 0) {
        title = prefLabels[0].literalForm.value;
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
