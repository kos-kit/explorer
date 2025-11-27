import { kosFactory } from "@/app/kosFactory";
import {
  Locale,
  PartialConcept,
  PartialConceptScheme,
  SemanticRelationProperty,
  labels,
} from "@/lib/models";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export class PageMetadata {
  private readonly _locale: Locale;

  constructor({ locale }: { locale: Locale }) {
    this._locale = locale;
  }

  async concept(concept: Omit<PartialConcept, "type">): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });
    return {
      title: `${rootPageMetadata.title}: ${translations("Concept")}: ${labels(concept).display}`,
    } satisfies Metadata;
  }

  async conceptScheme(
    conceptScheme: Omit<PartialConceptScheme, "type">,
  ): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });
    return {
      title: `${rootPageMetadata.title}: ${translations("Concept scheme")}: ${labels(conceptScheme).display}`,
    } satisfies Metadata;
  }

  async conceptSchemeTopConcepts({
    conceptScheme,
  }: {
    conceptScheme: Omit<PartialConceptScheme, "type">;
    page: number;
  }) {
    const conceptSchemePageMetadata = await this.conceptScheme(conceptScheme);
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-base-to-string
      title: `${conceptSchemePageMetadata.title!.toString()}: ${translations("Top concepts")}`,
    } satisfies Metadata;
  }

  async conceptSemanticRelations({
    concept,
    semanticRelationProperty,
  }: {
    concept: Omit<PartialConcept, "type">;
    semanticRelationProperty: SemanticRelationProperty;
  }) {
    const conceptPageMetadata = await this.concept(concept);

    const translations = await getTranslations({
      locale: this._locale,
      namespace: "SemanticRelationProperties",
    });

    return {
      title: `${conceptPageMetadata.title}: ${translations(semanticRelationProperty.translationKey)}`,
    } satisfies Metadata;
  }

  async locale(): Promise<Metadata> {
    const conceptSchemes = await (
      await kosFactory({
        locale: this._locale,
      })
    ).conceptSchemeStubs({ limit: null, offset: 0, query: { type: "All" } });

    let title = "SKOS";
    if (conceptSchemes.length === 1) {
      title = labels(conceptSchemes[0]).display;
    }

    return {
      title: title,
    } satisfies Metadata;
  }

  async search(): Promise<Metadata> {
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });

    return {
      title: `${(await this.locale()).title}: ${translations("Search results")}`,
    } satisfies Metadata;
  }
}
