import {
  Concept,
  ConceptScheme,
  Label,
  Locale,
  SemanticRelationProperty,
} from "@/lib/models";
import { Metadata } from "next";
import { kosFactory } from "./kosFactory";

export class PageMetadata {
  private readonly _locale: Locale;

  constructor({ locale }: { locale: Locale }) {
    this._locale = locale;
  }

  async concept(concept: Concept): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
    return {
      title: `${rootPageMetadata.title}: Concept: ${concept.displayLabel}`,
    } satisfies Metadata;
  }

  async conceptScheme(conceptScheme: ConceptScheme): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-base-to-string
      title: `${conceptSchemePageMetadata.title!.toString()}: Top concepts`,
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
      title: `${conceptPageMetadata.title}: ${semanticRelationProperty.name} concepts`,
    } satisfies Metadata;
  }

  async locale(): Promise<Metadata> {
    const conceptSchemes = await (
      await (
        await kosFactory({
          languageTag: this._locale,
        })
      ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
    ).flatResolve();

    let title = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = conceptScheme.labels(Label.Type.PREFERRED);
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
      title: `${(await this.locale()).title}: search results`,
    } satisfies Metadata;
  }
}
