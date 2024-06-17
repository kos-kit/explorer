import { Metadata } from "next";
import kosFactory from "./kosFactory";
import {
  Concept,
  ConceptScheme,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/models";

export class PageMetadata {
  private readonly _languageTag: LanguageTag;

  constructor({ languageTag }: { languageTag: LanguageTag }) {
    this._languageTag = languageTag;
  }

  async concept(concept: Concept): Promise<Metadata> {
    const rootPageMetadata = await this.languageTag();
    return {
      title: `${rootPageMetadata.title}: Concept: ${concept.displayLabel}`,
    } satisfies Metadata;
  }

  async conceptScheme(conceptScheme: ConceptScheme): Promise<Metadata> {
    const rootPageMetadata = await this.languageTag();
    return {
      title: `${rootPageMetadata.title}: Concept Scheme: ${conceptScheme.displayLabel}`,
    } satisfies Metadata;
  }

  async conceptSchemeTopConcepts({
    conceptScheme,
  }: {
    conceptScheme: ConceptScheme;
    page: number;
  }) {
    const conceptSchemePageMetadata = await this.conceptScheme(conceptScheme);

    return {
      title: conceptSchemePageMetadata.title + ": Top concepts",
    } satisfies Metadata;
  }

  async conceptSemanticRelations({
    concept,
    semanticRelationProperty,
  }: {
    concept: Concept;
    semanticRelationProperty: SemanticRelationProperty;
  }) {
    const conceptPageMetadata = await this.concept(concept);

    return {
      title: `${conceptPageMetadata.title}: ${semanticRelationProperty.label} concepts`,
    } satisfies Metadata;
  }

  async languageTag(): Promise<Metadata> {
    const conceptSchemes = await kosFactory({
      languageTag: this._languageTag,
    }).conceptSchemes();

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = conceptScheme.prefLabels;
      if (prefLabels.length > 0) {
        title = prefLabels[0].literalForm.value;
      }
    }

    return {
      title: title,
    } satisfies Metadata;
  }

  async search(): Promise<Metadata> {
    return {
      title: `${(await this.languageTag()).title}: search results`,
    } satisfies Metadata;
  }
}
