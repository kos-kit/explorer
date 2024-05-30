import { Metadata } from "next";
import kos from "./kos";
import { displayLabel } from "@/lib/utilities/displayLabel";
import {
  Concept,
  ConceptScheme,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/client/models";

export class PageMetadata {
  static async concept({
    concept,
    languageTag,
  }: {
    concept: Concept;
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    const rootPageMetadata = await PageMetadata.languageTag({ languageTag });
    return {
      title: `${rootPageMetadata.title}: Concept: ${await displayLabel({ languageTag, model: concept })}`,
    } satisfies Metadata;
  }

  static async conceptScheme({
    conceptScheme,
    languageTag,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    const rootPageMetadata = await PageMetadata.languageTag({ languageTag });
    return {
      title: `${rootPageMetadata.title}: Concept Scheme: ${await displayLabel({ languageTag, model: conceptScheme })}`,
    } satisfies Metadata;
  }

  static async conceptSchemeTopConcepts({
    conceptScheme,
    languageTag,
  }: {
    conceptScheme: ConceptScheme;
    languageTag: LanguageTag;
    page: number;
  }) {
    const conceptSchemePageMetadata = await PageMetadata.conceptScheme({
      conceptScheme,
      languageTag,
    });

    return {
      title: conceptSchemePageMetadata.title + ": Top concepts",
    } satisfies Metadata;
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
    const conceptPageMetadata = await PageMetadata.concept({
      concept,
      languageTag,
    });

    return {
      title: `${conceptPageMetadata.title}: ${semanticRelationProperty.label} concepts`,
    } satisfies Metadata;
  }

  static async languageTag({
    languageTag,
  }: {
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    const conceptSchemes = await kos.conceptSchemes();

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = await conceptScheme.prefLabels({
        languageTags: new Set([languageTag, ""]),
      });
      if (prefLabels.length > 0) {
        title = prefLabels[0].literalForm.value;
      }
    }

    return {
      title: title,
    } satisfies Metadata;
  }

  static async search({
    languageTag,
  }: {
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    return {
      title: `${(await PageMetadata.languageTag({ languageTag })).title}: search results`,
    } satisfies Metadata;
  }
}
