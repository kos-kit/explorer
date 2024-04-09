import { Metadata } from "next";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import modelSet from "./modelSet";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { displayLabel } from "@/lib/utilities/displayLabel";

export class PageMetadata {
  static async concept({
    concept,
    languageTag,
  }: {
    concept: Concept;
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    const rootPageMetadata = await PageMetadata.root({ languageTag });
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
    const rootPageMetadata = await PageMetadata.root({ languageTag });
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

  static async root({
    languageTag,
  }: {
    languageTag: LanguageTag;
  }): Promise<Metadata> {
    const conceptSchemes = await modelSet.conceptSchemes();

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = await conceptScheme.prefLabels({ languageTag });
      if (prefLabels.length > 0) {
        title = prefLabels[0].literalForm.value;
      }
    }

    return {
      title: title,
    } satisfies Metadata;
  }
}
